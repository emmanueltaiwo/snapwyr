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

const bootSequence = [
  'Initializing snapwyr v1.0.0...',
  'Loading HTTP interceptor...',
  'Scanning for frameworks...',
  '✓ Express detected',
  '✓ Next.js detected',
  '✓ Koa detected',
  '✓ Fastify detected',
  '✓ NestJS detected',
  '✓ Hono detected',
  'System ready.',
  '',
  'Welcome to snapwyr.',
  'Zero-config HTTP request logger.',
  '',
];

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

const fileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'index.ts', type: 'file' },
      {
        name: 'utils',
        type: 'folder',
        children: [{ name: 'helpers.ts', type: 'file' }],
      },
      {
        name: 'routes',
        type: 'folder',
        children: [{ name: 'api.ts', type: 'file' }],
      },
    ],
  },
  {
    name: 'node_modules',
    type: 'folder',
    children: [
      {
        name: 'snapwyr',
        type: 'folder',
        children: [{ name: 'index.js', type: 'file' }],
      },
    ],
  },
  { name: 'package.json', type: 'file' },
];

export function IDEHero() {
  const [currentFramework, setCurrentFramework] = useState(0);
  const [logs, setLogs] = useState<
    Array<{ method: string; path: string; status: number; time: string }>
  >([]);
  const [activeTab, setActiveTab] = useState('index.ts');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentTyping, setCurrentTyping] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src'])
  );

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
        return newLogs.slice(-20);
      });
    }, 1200);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    const cmdInterval = setInterval(() => {
      const commands = [
        '$ npm install snapwyr',
        '$ npm run dev',
        '$ curl http://localhost:3000/api/users',
        '$ git commit -m "Add snapwyr"',
      ];
      const cmd = commands[Math.floor(Math.random() * commands.length)];
      if (cmd) {
        setCommandHistory((prev) => {
          const newHistory = [...prev, cmd];
          return newHistory.slice(-10);
        });
      }
    }, 4000);
    return () => clearInterval(cmdInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (bootComplete) return;

    const bootInterval = setInterval(() => {
      setBootLines((prev) => {
        if (prev.length < bootSequence.length) {
          const nextLine = bootSequence[prev.length];
          if (nextLine !== undefined) {
            return [...prev, nextLine];
          }
          return prev;
        } else {
          setBootComplete(true);
          clearInterval(bootInterval);
          return prev;
        }
      });
    }, 300);

    return () => clearInterval(bootInterval);
  }, [bootComplete]);

  // Typing effect for prompt
  useEffect(() => {
    if (!bootComplete) return;
    
    const prompts = [
      'user@snapwyr:~$ ',
      'snapwyr --help',
      'snapwyr --version',
      'snapwyr --start',
    ];
    
    const promptIndex = typingIndex % prompts.length;
    const currentPrompt = prompts[promptIndex];
    
    if (!currentPrompt) return;
    
    if (currentTyping.length < currentPrompt.length) {
      const timer = setTimeout(() => {
        setCurrentTyping(currentPrompt.slice(0, currentTyping.length + 1));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentTyping('');
        setTypingIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTyping, typingIndex, bootComplete]);

  const safeIndex = currentFramework % frameworks.length;
  const currentFw = frameworks[safeIndex];

  if (!currentFw) {
    return null;
  }

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const handleFileClick = (fileName: string) => {
    if (fileName === 'index.ts' || fileName === 'package.json') {
      setActiveTab(fileName);
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0, path = '') => {
    return nodes.map((node) => {
      const nodePath = path ? `${path}/${node.name}` : node.name;
      const isExpanded = expandedFolders.has(nodePath);

      if (node.type === 'folder') {
        return (
          <div key={nodePath}>
            <div
              onClick={() => toggleFolder(nodePath)}
              className='flex items-center gap-1 cursor-pointer hover:text-white transition-colors py-0.5'
              style={{ paddingLeft: `${level * 12}px` }}
            >
              <span className='text-xs'>{isExpanded ? '📂' : '📁'}</span>
              <span className='text-white/80'>{node.name}/</span>
            </div>
            {isExpanded && node.children && (
              <div className='ml-2'>
                {renderFileTree(node.children, level + 1, nodePath)}
              </div>
            )}
          </div>
        );
      } else {
        const isActive = activeTab === node.name;
        return (
          <div
            key={nodePath}
            onClick={() => handleFileClick(node.name)}
            className={`flex items-center gap-1 cursor-pointer transition-colors py-0.5 ${
              isActive ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
            style={{ paddingLeft: `${level * 12}px` }}
          >
            <span className='text-xs'>📄</span>
            <span>{node.name}</span>
          </div>
        );
      }
    });
  };

  return (
    <section className='pt-20 sm:pt-24 pb-12 sm:pb-20 px-3 sm:px-4 md:px-6 lg:px-8 min-h-screen bg-[#000000] relative overflow-hidden'>
      {/* CRT Scanlines */}
      <div className='fixed inset-0 pointer-events-none z-50 opacity-[0.02]'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.05) 2px, rgba(255, 255, 255, 0.05) 4px)',
          }}
        />
      </div>

      <div className='max-w-[2000px] mx-auto relative z-10'>
        {/* ASCII Art Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mb-6 sm:mb-8 font-mono text-white text-xs leading-tight overflow-x-auto'
        >
          <pre className='text-white overflow-x-auto text-[10px] sm:text-[19px] md:text-lg'>
            {` ____  _      ____  ____  _     ___  _ ____ 
/ ___\\/ \\  /|/  _ \\/  __\\/ \\  /|\\  \\///  __\\
|    \\| |\\ ||| / \\||  \\/|| |  || \\  / |  \\/|
\\___ || | \\||| |-|||  __/| |/\\|| / /  |    /
\\____/\\_/  \\|\\_/ \\|\\_/   \\_/  \\|/_/   \\_/\\_\\`}
          </pre>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className='text-white/60 text-xs sm:text-sm mt-2'
          >
            {'>'} Zero-config HTTP request logger for developers
          </motion.div>
        </motion.div>

        {/* Main Layout - Terminal Multiplexer Style */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-2 mb-4 sm:mb-6'>
          {/* Left Panel - File Tree (hidden on mobile, 2 cols on desktop) */}
          <div className='hidden lg:block lg:col-span-2'>
            <div className='bg-[#000000] border border-white/10 rounded font-mono text-xs h-full'>
              <div className='bg-[#0a0a0a] px-2 py-1 border-b border-white/10 text-white'>
                <span className='text-white/40'>[</span>EXPLORER
                <span className='text-white/40'>]</span>
              </div>
              <div className='p-2 space-y-0.5 text-white/80 max-h-[600px] overflow-y-auto'>
                {renderFileTree(fileTree)}
              </div>
            </div>
          </div>

          {/* Center Panel - Code Editor (full width on mobile, 7 cols on desktop) */}
          <div className='col-span-1 lg:col-span-7 space-y-2'>
            {/* Editor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className='bg-[#000000] border border-white/10 rounded overflow-hidden'
            >
              {/* Tabs */}
              <div className='flex items-center bg-[#0a0a0a] border-b border-white/10 overflow-x-auto'>
                <button
                  onClick={() => setActiveTab('index.ts')}
                  className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-mono border-r border-white/10 transition-colors whitespace-nowrap ${
                    activeTab === 'index.ts'
                      ? 'bg-[#000000] text-white border-b-2 border-b-white'
                      : 'bg-[#0a0a0a] text-white/60 hover:text-white hover:bg-[#111111]'
                  }`}
                >
                  index.ts
                </button>
                <button
                  onClick={() => setActiveTab('package.json')}
                  className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-mono border-r border-white/10 transition-colors whitespace-nowrap ${
                    activeTab === 'package.json'
                      ? 'bg-[#000000] text-white border-b-2 border-b-white'
                      : 'bg-[#0a0a0a] text-white/60 hover:text-white hover:bg-[#111111]'
                  }`}
                >
                  package.json
                </button>
                <div className='flex-1 bg-[#0a0a0a] border-b border-white/10' />
                <div className='px-2 sm:px-3 text-[10px] sm:text-xs text-white/40 font-mono whitespace-nowrap'>
                  {frameworks[safeIndex]?.name}
                </div>
              </div>

              {/* Editor Content */}
              <div className='relative min-h-[300px] sm:min-h-[400px] md:min-h-[450px] bg-[#000000]'>
                {/* Line numbers */}
                <div className='absolute left-0 top-0 bottom-0 w-8 sm:w-10 bg-[#0a0a0a] border-r border-white/10 text-white/20 text-[10px] sm:text-xs pt-4 pl-1 sm:pl-2 space-y-3 font-mono'>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <div key={num}>{num}</div>
                  ))}
                </div>
                <div className='pl-10 sm:pl-12 pr-2 sm:pr-4 py-3 sm:py-4 font-mono text-xs sm:text-sm overflow-x-auto'>
                  <AnimatePresence mode='wait'>
                    {activeTab === 'index.ts' ? (
                      <motion.div
                        key={`index-${currentFramework}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className='space-y-2'
                      >
                        <div>
                          {currentFw.import.includes('{') ? (
                            <>
                              <span className='text-cyan-400'>import</span>{' '}
                              <span className='text-blue-300'>
                                {currentFw.import.match(/\{[^}]+\}/)?.[0] ||
                                  '{ snapwyr }'}
                              </span>{' '}
                              <span className='text-cyan-400'>from</span>{' '}
                              <span className='text-yellow-300'>
                                {currentFw.import.match(/'[^']+'/)?.[0] ||
                                  "'snapwyr/express'"}
                              </span>
                              ;
                            </>
                          ) : (
                            <>
                              <span className='text-cyan-400'>import</span>{' '}
                              <span className='text-blue-300'>
                                {currentFw.import.split(' ')[1]}
                              </span>{' '}
                              <span className='text-cyan-400'>from</span>{' '}
                              <span className='text-yellow-300'>
                                {currentFw.import.match(/'[^']+'/)?.[0] ||
                                  "'snapwyr/express'"}
                              </span>
                              ;
                            </>
                          )}
                        </div>
                        {currentFw.setup &&
                          !currentFw.setup.startsWith('//') && (
                            <div>
                              {currentFw.setup.includes('{') ? (
                                <>
                                  <span className='text-cyan-400'>import</span>{' '}
                                  <span className='text-blue-300'>
                                    {currentFw.setup.match(/\{[^}]+\}/)?.[0] ||
                                      currentFw.setup.split(' ')[1]}
                                  </span>{' '}
                                  <span className='text-cyan-400'>from</span>{' '}
                                  <span className='text-yellow-300'>
                                    {currentFw.setup.match(/'[^']+'/)?.[0] ||
                                      "''"}
                                  </span>
                                  ;
                                </>
                              ) : (
                                <>
                                  <span className='text-cyan-400'>import</span>{' '}
                                  <span className='text-blue-300'>
                                    {currentFw.setup.split(' ')[1]}
                                  </span>{' '}
                                  <span className='text-cyan-400'>from</span>{' '}
                                  <span className='text-yellow-300'>
                                    {currentFw.setup.match(/'[^']+'/)?.[0] ||
                                      "''"}
                                  </span>
                                  ;
                                </>
                              )}
                            </div>
                          )}
                        {currentFw.dashboardImport && (
                          <div>
                            <span className='text-cyan-400'>import</span>{' '}
                            <span className='text-blue-300'>
                              {
                                currentFw.dashboardImport.match(
                                  /\{[^}]+\}/
                                )?.[0]
                              }
                            </span>{' '}
                            <span className='text-cyan-400'>from</span>{' '}
                            <span className='text-yellow-300'>
                              {currentFw.dashboardImport.match(/'[^']+'/)?.[0]}
                            </span>
                            ;
                          </div>
                        )}
                        {currentFw.setup?.startsWith('//') && (
                          <div className='text-gray-500'>{currentFw.setup}</div>
                        )}
                        {currentFw.constLine && (
                          <div>
                            <span className='text-cyan-400'>const</span>{' '}
                            <span className='text-blue-300'>
                              {(currentFw.constLine
                                .split('=')[0]
                                ?.trim()
                                .split(' ') || [])[1] || 'app'}
                            </span>{' '}
                            ={' '}
                            {currentFw.constLine.includes('new') ? (
                              <>
                                <span className='text-cyan-400'>new</span>{' '}
                                <span className='text-blue-300'>
                                  {(currentFw.constLine
                                    .split('new ')[1]
                                    ?.split('(') || [])[0] || 'Koa'}
                                </span>
                                <span className='text-yellow-300'>()</span>
                              </>
                            ) : (
                              <span className='text-blue-300'>
                                {currentFw.constLine.split('=')[1]?.trim() ||
                                  'express()'}
                              </span>
                            )}
                          </div>
                        )}
                        <div className='text-gray-500'>
                          {currentFw.name === 'dashboard'
                            ? '// Log incoming requests'
                            : "// One line. That's it."}
                        </div>
                        <div>
                          {currentFw.name === 'nextjs' ? (
                            <>
                              <span className='text-cyan-400'>
                                export const
                              </span>{' '}
                              <span className='text-blue-300'>proxy</span> ={' '}
                              <span className='text-blue-300'>snapwyr</span>(
                              <span className='text-white'>{'{'} </span>
                              <span className='text-purple-300'>logBody</span>
                              <span className='text-white'>: </span>
                              <span className='text-green-400'>true</span>
                              <span className='text-white'> {'}'})</span>
                            </>
                          ) : currentFw.name === 'nestjs' ? (
                            <>
                              <span className='text-purple-300'>useValue</span>:{' '}
                              <span className='text-blue-300'>
                                SnapwyrInterceptor
                              </span>
                              (<span className='text-white'>{'{'} </span>
                              <span className='text-purple-300'>logBody</span>
                              <span className='text-white'>: </span>
                              <span className='text-green-400'>true</span>
                              <span className='text-white'> {'}'})</span>
                            </>
                          ) : currentFw.name === 'fastify' ? (
                            <>
                              <span className='text-blue-300'>fastify</span>.
                              <span className='text-purple-300'>register</span>(
                              <span className='text-blue-300'>snapwyr</span>,{' '}
                              <span className='text-white'>{'{'} </span>
                              <span className='text-purple-300'>logBody</span>
                              <span className='text-white'>: </span>
                              <span className='text-green-400'>true</span>
                              <span className='text-white'> {'}'})</span>
                            </>
                          ) : currentFw.name === 'hono' ? (
                            <>
                              <span className='text-blue-300'>app</span>.
                              <span className='text-purple-300'>use</span>(
                              <span className='text-yellow-300'>'*'</span>,{' '}
                              <span className='text-blue-300'>snapwyr</span>(
                              <span className='text-white'>{'{'} </span>
                              <span className='text-purple-300'>logBody</span>
                              <span className='text-white'>: </span>
                              <span className='text-green-400'>true</span>
                              <span className='text-white'> {'}'}))</span>
                            </>
                          ) : (
                            <>
                              <span className='text-blue-300'>app</span>.
                              <span className='text-purple-300'>use</span>(
                              <span className='text-blue-300'>snapwyr</span>(
                              <span className='text-white'>{'{'} </span>
                              <span className='text-purple-300'>logBody</span>
                              <span className='text-white'>: </span>
                              <span className='text-green-400'>true</span>
                              <span className='text-white'> {'}'}))</span>
                            </>
                          )}
                        </div>
                        {currentFw.comment && (
                          <div className='text-gray-500'>
                            {currentFw.comment}
                          </div>
                        )}
                        {currentFw.dashboardCode && (
                          <div>
                            <span className='text-blue-300'>serve</span>(
                            <span className='text-yellow-300'>3333</span>);
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
                        <div className='text-yellow-300'>{'{'}</div>
                        <div className='pl-4'>
                          <div>
                            <span className='text-yellow-300'>"name"</span>:{' '}
                            <span className='text-yellow-300'>"my-app"</span>,
                          </div>
                          <div>
                            <span className='text-yellow-300'>
                              "dependencies"
                            </span>
                            : {'{'}
                          </div>
                          <div className='pl-4'>
                            <div>
                              <span className='text-yellow-300'>"snapwyr"</span>
                              :{' '}
                              <span className='text-yellow-300'>"latest"</span>
                            </div>
                          </div>
                          <div className='text-yellow-300'>{'}'}</div>
                        </div>
                        <div className='text-yellow-300'>{'}'}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Terminal (full width on mobile, 3 cols on desktop) */}
          <div className='col-span-1 lg:col-span-3 space-y-2'>
            {/* Terminal Window */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='bg-[#000000] border border-white/10 rounded overflow-hidden'
            >
              {/* Terminal header */}
              <div className='bg-[#0a0a0a] px-2 py-1 border-b border-white/10 flex items-center gap-2'>
                <div className='flex items-center gap-1'>
                  <div className='w-1.5 h-1.5 rounded-full bg-[#ff5f56]' />
                  <div className='w-1.5 h-1.5 rounded-full bg-[#ffbd2e]' />
                  <div className='w-1.5 h-1.5 rounded-full bg-[#27c93f]' />
                </div>
                <div className='ml-2 text-[10px] sm:text-xs text-white font-mono'>
                  <span className='text-white/40'>[</span>TERMINAL
                  <span className='text-white/40'>]</span>
                </div>
                <div className='ml-auto text-[10px] sm:text-xs text-green-400 font-mono'>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ●
                  </motion.span>
                </div>
              </div>

              {/* Terminal content */}
              <div className='p-2 sm:p-3 font-mono text-[10px] sm:text-xs bg-[#000000] min-h-[250px] sm:min-h-[300px] md:min-h-[350px] max-h-[350px] overflow-y-auto'>
                {/* Boot sequence */}
                {!bootComplete ? (
                  <div className='space-y-0.5 text-white/80'>
                    {bootLines.map((line, idx) => (
                      <div key={idx} className='text-white/80'>
                        {line.startsWith('✓') ? (
                          <span className='text-green-400'>{line}</span>
                        ) : line.startsWith('System ready') ? (
                          <span className='text-white font-bold'>{line}</span>
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                    <span
                      className={`inline-block w-2 h-3 bg-white ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                ) : (
                  <>
                    {/* Command history */}
                    <div className='space-y-1 mb-3 text-white/70'>
                      {commandHistory.map((cmd, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className='text-white/70 wrap-break-word'
                        >
                          <span className='text-white'>$</span> {cmd}
                        </motion.div>
                      ))}
                    </div>

                    {/* Live logs */}
                    <div className='border-t border-white/10 pt-3'>
                      <div className='text-white/60 mb-2 flex items-center gap-2 text-[10px] sm:text-xs'>
                        <span className='text-green-400'>●</span>
                        <span>Live HTTP logs</span>
                      </div>
                      <div className='space-y-1'>
                        <AnimatePresence>
                          {logs.map((log, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className='flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs flex-wrap'
                            >
                              <span className='text-white'>→</span>
                              <span className='text-white font-semibold'>
                                {log.method}
                              </span>
                              <span className='text-green-400'>
                                {log.status}
                              </span>
                              <span className='text-yellow-400'>
                                {log.time}
                              </span>
                              <span className='text-white/80 break-all'>
                                {log.path}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Typing prompt */}
                    <div className='mt-4 flex items-center gap-2 text-white'>
                      <span className='break-all'>{currentTyping}</span>
                      <span
                        className={`inline-block w-2 h-3 bg-white ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Stats Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='bg-[#000000] border border-white/10 rounded overflow-hidden'
            >
              <div className='bg-[#0a0a0a] px-2 py-1 border-b border-white/10'>
                <div className='text-[10px] sm:text-xs text-white font-mono'>
                  <span className='text-white/40'>[</span>STATS
                  <span className='text-white/40'>]</span>
                </div>
              </div>
              <div className='p-3 sm:p-4 space-y-3 sm:space-y-4'>
                <div>
                  <div className='text-white/60 text-[10px] sm:text-xs font-mono mb-1'>
                    Requests
                  </div>
                  <div className='text-2xl sm:text-3xl font-bold text-white font-mono'>
                    {logs.length}
                  </div>
                </div>
                <div>
                  <div className='text-white/60 text-[10px] sm:text-xs font-mono mb-1'>
                    Avg Response
                  </div>
                  <div className='text-xl sm:text-2xl font-bold text-white font-mono'>
                    {logs.length > 0
                      ? Math.round(
                          logs.reduce(
                            (sum, log) => sum + parseInt(log.time),
                            0
                          ) / logs.length
                        )
                      : 0}
                    <span className='text-sm text-white/50'>ms</span>
                  </div>
                </div>
                <div>
                  <div className='text-white/60 text-[10px] sm:text-xs font-mono mb-1'>
                    Success Rate
                  </div>
                  <div className='text-xl sm:text-2xl font-bold text-green-400 font-mono'>
                    {logs.length > 0
                      ? Math.round(
                          (logs.filter((log) => log.status < 300).length /
                            logs.length) *
                            100
                        )
                      : 0}
                    <span className='text-sm text-green-400/50'>%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='text-center mt-8 sm:mt-12'
        >
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4'>
            <Link
              href='/docs'
              className='w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white hover:bg-white/90 text-black rounded font-mono text-xs sm:text-sm font-bold transition-all duration-200 border-2 border-white'
            >
              {'>'} Get Started
            </Link>
            <a
              href='https://github.com/emmanueltaiwo/snapwyr'
              target='_blank'
              rel='noopener noreferrer'
              className='w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white/50 hover:border-white text-white rounded font-mono text-xs sm:text-sm transition-all duration-200 hover:bg-white/10'
            >
              {'>'} View on GitHub
            </a>
          </div>
          <div className='text-white/60 text-[10px] sm:text-xs font-mono'>
            <span className='text-white'>$</span> npm install snapwyr
          </div>
        </motion.div>
      </div>
    </section>
  );
}
