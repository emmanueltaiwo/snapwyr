import { SnapWyrEmitter, RequestEvent } from '../index.js';

// Optimized ID generation using counter + random for better performance
let requestCounter = 0;
function generateRequestId(): string {
  return `${Date.now()}-${++requestCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

function serializeBody(body: any): string | undefined {
  if (body == null) return undefined;

  try {
    if (typeof body === 'string') {
      const trimmed = body.trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        try {
          const parsed = JSON.parse(body);
          return JSON.stringify(parsed, null, 2);
        } catch {
          return body;
        }
      }
      return body;
    }
    return JSON.stringify(body, null, 2);
  } catch {
    return '[unable to serialize]';
  }
}

function addInterceptors(axiosInstance: any, emitter: SnapWyrEmitter): void {
  if (axiosInstance._snapwyrPatched) return;
  axiosInstance._snapwyrPatched = true;

  const config = emitter.getConfig();
  const logBody = config.logBody === true;

  axiosInstance.interceptors.request.use(
    (config: any) => {
      try {
        const id = generateRequestId();
        config._snapwyrId = id;
        config._snapwyrStartTime = Date.now();
      } catch {}
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: any) => {
      try {
        logAxiosRequest(response.config, response, null, emitter, logBody);
      } catch {}
      return response;
    },
    (error: any) => {
      try {
        logAxiosRequest(
          error.config || {},
          error.response,
          error,
          emitter,
          logBody
        );
      } catch {}
      return Promise.reject(error);
    }
  );
}

function logAxiosRequest(
  config: any,
  response: any,
  error: any,
  emitter: SnapWyrEmitter,
  logBody: boolean
): void {
  const id = config._snapwyrId || generateRequestId();
  const startTime = config._snapwyrStartTime || Date.now();
  const duration = Date.now() - startTime;

  // Optimize URL construction
  let url = config.url || '';
  if (config.baseURL && url && !url.startsWith('http')) {
    const baseURL = config.baseURL.endsWith('/')
      ? config.baseURL.slice(0, -1)
      : config.baseURL;
    const path = url.startsWith('/') ? url : `/${url}`;
    url = `${baseURL}${path}`;
  }

  const method = (config.method || 'GET').toUpperCase();
  const status = response?.status;
  const errorMessage = error ? error.message || String(error) : undefined;

  // Only serialize bodies if logging is enabled
  const requestBody =
    logBody && config.data ? serializeBody(config.data) : undefined;

  const responseBody =
    logBody && response?.data ? serializeBody(response.data) : undefined;

  const event: RequestEvent = {
    id,
    method,
    url,
    status,
    duration,
    timestamp: startTime,
    requestBody,
    responseBody,
    error: errorMessage,
    direction: 'outgoing',
  };

  emitter.emitRequest(event);
}

function patchAxiosInstance(axios: any, emitter: SnapWyrEmitter): void {
  if (!axios || !axios.interceptors) {
    return;
  }

  addInterceptors(axios, emitter);

  const originalCreate = axios.create;
  if (typeof originalCreate === 'function' && !originalCreate._snapwyrPatched) {
    axios.create = function (...args: any[]) {
      const instance = originalCreate.apply(this, args);
      addInterceptors(instance, emitter);
      return instance;
    };
    axios.create._snapwyrPatched = true;
  }

  try {
    if (typeof require !== 'undefined' && require.cache) {
      // @ts-ignore
      for (const key in require.cache) {
        if (
          key.includes('node_modules/axios') ||
          key.includes('node_modules\\axios')
        ) {
          const cached = require.cache[key];
          if (cached && cached.exports) {
            const cachedAxios = cached.exports.default || cached.exports;
            if (cachedAxios && cachedAxios.interceptors) {
              addInterceptors(cachedAxios, emitter);
              if (cachedAxios.create && !cachedAxios.create._snapwyrPatched) {
                const cachedOriginalCreate = cachedAxios.create;
                cachedAxios.create = function (...args: any[]) {
                  const instance = cachedOriginalCreate.apply(this, args);
                  addInterceptors(instance, emitter);
                  return instance;
                };
                cachedAxios.create._snapwyrPatched = true;
              }
            }
            if (cached.exports.default) {
              cached.exports.default = axios;
            }
            if (
              typeof cached.exports === 'object' &&
              cached.exports !== axios
            ) {
              Object.assign(cached.exports, axios);
            }
          }
        }
      }
    }
  } catch {}

  if (axios.Axios && typeof axios.Axios === 'function') {
    const OriginalAxios = axios.Axios;
    if (!OriginalAxios._snapwyrPatched) {
      // Wrap the constructor to add interceptors after instance creation
      const NewAxios = function (this: any, ...args: any[]) {
        OriginalAxios.apply(this, args);
        // Add interceptors to the instance after it's constructed
        if (this && this.interceptors) {
          addInterceptors(this, emitter);
        }
      };
      NewAxios.prototype = OriginalAxios.prototype;
      NewAxios.prototype.constructor = NewAxios;
      Object.setPrototypeOf(NewAxios, OriginalAxios);
      Object.getOwnPropertyNames(OriginalAxios).forEach((key) => {
        if (key !== 'prototype' && key !== 'length' && key !== 'name') {
          try {
            // @ts-ignore
            NewAxios[key] = OriginalAxios[key];
          } catch {}
        }
      });
      axios.Axios = NewAxios;
      axios.Axios._snapwyrPatched = true;
    }
  }

  if (axios.default && axios.default !== axios) {
    addInterceptors(axios.default, emitter);
  }
}

export function patchAxios(emitter: SnapWyrEmitter, axiosInstance?: any): void {
  if (!axiosInstance) {
    return;
  }

  try {
    if (
      axiosInstance &&
      axiosInstance.interceptors &&
      typeof axiosInstance.interceptors === 'object'
    ) {
      patchAxiosInstance(axiosInstance, emitter);
    } else {
      console.warn(
        '[SnapWyr] Provided axios instance does not have interceptors. Axios interception will not work.'
      );
    }
  } catch (error) {
    console.error('[SnapWyr] Failed to patch provided axios instance:', error);
  }
}
