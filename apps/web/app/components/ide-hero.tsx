'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const frameworks = [
  {
    name: 'express',
    import: "import { snapwyr } from 'snapwyr/express'",
    setup: "import express from 'express'",
    code: 'app.use(snapwyr({ logBody: true }))',
    constLine: 'const app = express()',
    dashboard: false,
  },
  {
    name: 'dashboard',
    import: "import { snapwyr } from 'snapwyr/express'",
    setup: "import express from 'express'",
    dashboardImport: "import { serve } from 'snapwyr/dashboard'",
    code: 'app.use(snapwyr({ logBody: true }))',
    dashboardCode: 'serve(3333)',
    constLine: 'const app = express()',
    comment: '// Start dashboard on port 3333',
  },
  {
    name: 'nextjs',
    import: "import { snapwyr } from 'snapwyr/nextjs'",
    setup: '// proxy.ts',
    code: 'export const proxy = snapwyr({ logBody: true })',
    constLine: null,
    dashboard: false,
  },
  {
    name: 'koa',
    import: "import { snapwyr } from 'snapwyr/koa'",
    setup: "import Koa from 'koa'",
    code: 'app.use(snapwyr({ logBody: true }))',
    constLine: 'const app = new Koa()',
    dashboard: false,
  },
  {
    name: 'fastify',
    import: "import { snapwyr } from 'snapwyr/fastify'",
    setup: "import Fastify from 'fastify'",
    code: 'fastify.register(snapwyr, { logBody: true })',
    constLine: 'const fastify = Fastify()',
    dashboard: false,
  },
  {
    name: 'nestjs',
    import: "import { SnapwyrInterceptor } from 'snapwyr/nestjs'",
    setup: "import { APP_INTERCEPTOR } from '@nestjs/core'",
    code: 'useValue: SnapwyrInterceptor({ logBody: true })',
    constLine: null,
    dashboard: false,
  },
  {
    name: 'hono',
    import: "import { snapwyr } from 'snapwyr/hono'",
    setup: "import { Hono } from 'hono'",
    code: "app.use('*', snapwyr({ logBody: true }))",
    constLine: 'const app = new Hono()',
    dashboard: false,
  },
];

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const paths = [
  '/api/users',
  '/api/posts',
  '/api/auth',
  '/api/data',
  '/api/health',
];

export function IDEHero() {
  const [currentFramework, setCurrentFramework] = useState(0);
  const [logs, setLogs] = useState<
    Array<{ method: string; path: string; status: number; time: string }>
  >([]);
  const [activeTab, setActiveTab] = useState('index.ts');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFramework((prev) => (prev + 1) % frameworks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const methodIdx = Math.floor(Math.random() * methods.length);
      const pathIdx = Math.floor(Math.random() * paths.length);
      const statusIdx = Math.floor(Math.random() * 3);
      const method = methods[methodIdx] || 'GET';
      const path = paths[pathIdx] || '/api/users';
      const status = [200, 201, 204][statusIdx] || 200;
      const time = `${Math.floor(Math.random() * 50 + 5)}ms`;

      setLogs((prev) => {
        const newLogs = [...prev, { method, path, status, time }];
        return newLogs.slice(-10);
      });
    }, 1200);
    return () => clearInterval(logInterval);
  }, []);

  // Ensure currentFramework is always valid
  const safeIndex = currentFramework % frameworks.length;
  const currentFw = frameworks[safeIndex];

  if (!currentFw) {
    return null;
  }

  return (
    <section className='pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <h1 className='text-6xl sm:text-7xl lg:text-8xl font-bold mb-4 text-white font-mono tracking-tight'>
            snapwyr
          </h1>
          <p className='text-xl text-white/50 font-mono'>
            Zero-config HTTP request logger for developers
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-6 mb-12'>
          {/* Left: Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className='bg-[#1e1e1e] border border-white/10 rounded-lg overflow-hidden shadow-2xl'
          >
            {/* Tabs */}
            <div className='flex items-center bg-[#252526] border-b border-white/5'>
              <button
                onClick={() => setActiveTab('index.ts')}
                className={`px-4 py-2.5 text-xs font-mono border-r border-white/5 transition-colors ${
                  activeTab === 'index.ts'
                    ? 'bg-[#1e1e1e] text-white border-b-2 border-b-[#007acc]'
                    : 'bg-[#252526] text-white/60 hover:text-white hover:bg-[#2d2d30]'
                }`}
              >
                index.ts
              </button>
              <button
                onClick={() => setActiveTab('package.json')}
                className={`px-4 py-2.5 text-xs font-mono border-r border-white/5 transition-colors ${
                  activeTab === 'package.json'
                    ? 'bg-[#1e1e1e] text-white border-b-2 border-b-[#007acc]'
                    : 'bg-[#252526] text-white/60 hover:text-white hover:bg-[#2d2d30]'
                }`}
              >
                package.json
              </button>
              <div className='flex-1 bg-[#252526] border-b border-white/5' />
            </div>

            {/* Editor Content */}
            <div className='relative min-h-[320px]'>
              {/* Line numbers */}
              <div className='absolute left-0 top-0 bottom-0 w-12 bg-[#252526] border-r border-white/5 text-white/30 text-xs pt-4 pl-4 space-y-3 font-mono'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>
              <div className='pl-16 pr-6 py-4 font-mono text-sm'>
                <AnimatePresence mode='wait'>
                  {activeTab === 'index.ts' ? (
                    <motion.div
                      key={`index-${currentFramework}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className='space-y-3'
                    >
                      <div>
                        {currentFw.import.includes('{') ? (
                          <>
                            <span className='text-[#569cd6]'>import</span>{' '}
                            <span className='text-[#ce9178]'>
                              {currentFw.import.match(/\{[^}]+\}/)?.[0] ||
                                '{ snapwyr }'}
                            </span>{' '}
                            <span className='text-[#569cd6]'>from</span>{' '}
                            <span className='text-[#ce9178]'>
                              {currentFw.import.match(/'[^']+'/)?.[0] ||
                                "'snapwyr/express'"}
                            </span>
                            ;
                          </>
                        ) : (
                          <>
                            <span className='text-[#569cd6]'>import</span>{' '}
                            <span className='text-[#4ec9b0]'>
                              {currentFw.import.split(' ')[1]}
                            </span>{' '}
                            <span className='text-[#569cd6]'>from</span>{' '}
                            <span className='text-[#ce9178]'>
                              {currentFw.import.match(/'[^']+'/)?.[0] ||
                                "'snapwyr/express'"}
                            </span>
                            ;
                          </>
                        )}
                      </div>
                      {currentFw.setup && !currentFw.setup.startsWith('//') && (
                        <div>
                          {currentFw.setup.includes('{') ? (
                            <>
                              <span className='text-[#569cd6]'>import</span>{' '}
                              <span className='text-[#ce9178]'>
                                {currentFw.setup.match(/\{[^}]+\}/)?.[0] ||
                                  currentFw.setup.split(' ')[1]}
                              </span>{' '}
                              <span className='text-[#569cd6]'>from</span>{' '}
                              <span className='text-[#ce9178]'>
                                {currentFw.setup.match(/'[^']+'/)?.[0] || "''"}
                              </span>
                              ;
                            </>
                          ) : (
                            <>
                              <span className='text-[#569cd6]'>import</span>{' '}
                              <span className='text-[#4ec9b0]'>
                                {currentFw.setup.split(' ')[1]}
                              </span>{' '}
                              <span className='text-[#569cd6]'>from</span>{' '}
                              <span className='text-[#ce9178]'>
                                {currentFw.setup.match(/'[^']+'/)?.[0] || "''"}
                              </span>
                              ;
                            </>
                          )}
                        </div>
                      )}
                      {currentFw.dashboardImport && (
                        <div>
                          <span className='text-[#569cd6]'>import</span>{' '}
                          <span className='text-[#ce9178]'>
                            {currentFw.dashboardImport.match(/\{[^}]+\}/)?.[0]}
                          </span>{' '}
                          <span className='text-[#569cd6]'>from</span>{' '}
                          <span className='text-[#ce9178]'>
                            {currentFw.dashboardImport.match(/'[^']+'/)?.[0]}
                          </span>
                          ;
                        </div>
                      )}
                      {currentFw.setup?.startsWith('//') && (
                        <div className='text-white/40'>{currentFw.setup}</div>
                      )}
                      {currentFw.constLine && (
                        <div>
                          <span className='text-[#569cd6]'>const</span>{' '}
                          <span className='text-[#4ec9b0]'>
                            {(currentFw.constLine
                              .split('=')[0]
                              ?.trim()
                              .split(' ') || [])[1] || 'app'}
                          </span>{' '}
                          ={' '}
                          {currentFw.constLine.includes('new') ? (
                            <>
                              <span className='text-[#569cd6]'>new</span>{' '}
                              <span className='text-[#4ec9b0]'>
                                {(currentFw.constLine
                                  .split('new ')[1]
                                  ?.split('(') || [])[0] || 'Koa'}
                              </span>
                              <span className='text-white'>()</span>
                            </>
                          ) : (
                            <span className='text-[#4ec9b0]'>
                              {currentFw.constLine.split('=')[1]?.trim() ||
                                'express()'}
                            </span>
                          )}
                        </div>
                      )}
                      <div className='text-white/40'>
                        {currentFw.name === 'dashboard'
                          ? '// Log incoming requests'
                          : "// One line. That's it."}
                      </div>
                      <div>
                        {currentFw.name === 'nextjs' ? (
                          <>
                            <span className='text-[#569cd6]'>export const</span>{' '}
                            <span className='text-[#4ec9b0]'>proxy</span> ={' '}
                            <span className='text-[#4ec9b0]'>snapwyr</span>(
                            <span className='text-white'>{'{'} </span>
                            <span className='text-[#9cdcfe]'>logBody</span>
                            <span className='text-white'>: </span>
                            <span className='text-[#569cd6]'>true</span>
                            <span className='text-white'> {'}'})</span>
                          </>
                        ) : currentFw.name === 'nestjs' ? (
                          <>
                            <span className='text-[#dcdcaa]'>useValue</span>:{' '}
                            <span className='text-[#4ec9b0]'>
                              SnapwyrInterceptor
                            </span>
                            (<span className='text-white'>{'{'} </span>
                            <span className='text-[#9cdcfe]'>logBody</span>
                            <span className='text-white'>: </span>
                            <span className='text-[#569cd6]'>true</span>
                            <span className='text-white'> {'}'})</span>
                          </>
                        ) : currentFw.name === 'fastify' ? (
                          <>
                            <span className='text-[#4ec9b0]'>fastify</span>.
                            <span className='text-[#dcdcaa]'>register</span>(
                            <span className='text-[#4ec9b0]'>snapwyr</span>,{' '}
                            <span className='text-white'>{'{'} </span>
                            <span className='text-[#9cdcfe]'>logBody</span>
                            <span className='text-white'>: </span>
                            <span className='text-[#569cd6]'>true</span>
                            <span className='text-white'> {'}'})</span>
                          </>
                        ) : currentFw.name === 'hono' ? (
                          <>
                            <span className='text-[#4ec9b0]'>app</span>.
                            <span className='text-[#dcdcaa]'>use</span>(
                            <span className='text-[#ce9178]'>'*'</span>,{' '}
                            <span className='text-[#4ec9b0]'>snapwyr</span>(
                            <span className='text-white'>{'{'} </span>
                            <span className='text-[#9cdcfe]'>logBody</span>
                            <span className='text-white'>: </span>
                            <span className='text-[#569cd6]'>true</span>
                            <span className='text-white'> {'}'}))</span>
                          </>
                        ) : (
                          <>
                            <span className='text-[#4ec9b0]'>app</span>.
                            <span className='text-[#dcdcaa]'>use</span>(
                            <span className='text-[#4ec9b0]'>snapwyr</span>(
                            <span className='text-white'>{'{'} </span>
                            <span className='text-[#9cdcfe]'>logBody</span>
                            <span className='text-white'>: </span>
                            <span className='text-[#569cd6]'>true</span>
                            <span className='text-white'> {'}'}))</span>
                          </>
                        )}
                      </div>
                      {currentFw.comment && (
                        <div className='text-white/40'>{currentFw.comment}</div>
                      )}
                      {currentFw.dashboardCode && (
                        <div>
                          <span className='text-[#4ec9b0]'>serve</span>(
                          <span className='text-[#ce9178]'>3333</span>);
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key='package'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='space-y-2'
                    >
                      <div>{'{'}</div>
                      <div className='pl-4'>
                        <div>
                          <span className='text-[#ce9178]'>"name"</span>:{' '}
                          <span className='text-[#ce9178]'>"my-app"</span>,
                        </div>
                        <div>
                          <span className='text-[#ce9178]'>"dependencies"</span>
                          : {'{'}
                        </div>
                        <div className='pl-4'>
                          <div>
                            <span className='text-[#ce9178]'>"snapwyr"</span>:{' '}
                            <span className='text-[#ce9178]'>"latest"</span>
                          </div>
                        </div>
                        <div>{'}'}</div>
                      </div>
                      <div>{'}'}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right: Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='bg-[#1e1e1e] border border-white/10 rounded-lg overflow-hidden shadow-2xl'
          >
            {/* Terminal header */}
            <div className='bg-[#252526] px-4 py-2.5 border-b border-white/5 flex items-center gap-2'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-[#ff5f56]' />
                <div className='w-2 h-2 rounded-full bg-[#ffbd2e]' />
                <div className='w-2 h-2 rounded-full bg-[#27c93f]' />
              </div>
              <div className='ml-3 text-xs text-white/60 font-mono'>
                TERMINAL
              </div>
              <div className='ml-auto text-xs text-white/40 font-mono'>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Live
                </motion.span>
              </div>
            </div>

            {/* Terminal content */}
            <div className='p-4 font-mono text-xs bg-[#0d0d0d] min-h-[320px]'>
              <div className='text-green-400 mb-2'>$ npm install snapwyr</div>
              <div className='text-white/40 mb-1'>
                added 1 package, and audited 2 packages in 1s
              </div>
              <div className='text-white/30 mb-4'>found 0 vulnerabilities</div>

              <div className='border-t border-white/10 pt-4 mt-4'>
                <div className='text-white/40 mb-3 flex items-center gap-2'>
                  <motion.div
                    className='w-1.5 h-1.5 rounded-full bg-green-400'
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  Live logs streaming...
                </div>
                <div className='space-y-1.5'>
                  <AnimatePresence>
                    {logs.map((log, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className='flex items-center gap-3'
                      >
                        <span className='text-green-400'>→</span>
                        <span className='text-[#569cd6] font-semibold'>
                          {log.method}
                        </span>
                        <span className='text-green-400'>{log.status}</span>
                        <span className='text-white/50'>{log.time}</span>
                        <span className='text-white'>{log.path}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='text-center'
        >
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-4'>
            <Link
              href='/docs'
              className='px-8 py-3 bg-[#007acc] hover:bg-[#0098ff] text-white rounded font-mono text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              Get Started
            </Link>
            <a
              href='https://github.com/emmanueltaiwo/snapwyr'
              target='_blank'
              rel='noopener noreferrer'
              className='px-8 py-3 border border-white/20 hover:border-white/40 text-white rounded font-mono text-sm transition-all duration-200 hover:bg-white/5'
            >
              View on GitHub
            </a>
          </div>
          <div className='text-white/30 text-xs font-mono'>
            $ npm install snapwyr
          </div>
        </motion.div>
      </div>
    </section>
  );
}
