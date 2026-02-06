'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

const frameworks = [
  {
    name: 'Express',
    import: "import { snapwyr } from 'snapwyr/express'",
    setup: "import express from 'express'",
    code: 'app.use(snapwyr({ logBody: true }))',
    constLine: 'const app = express()',
  },
  {
    name: 'Dashboard',
    import: "import { snapwyr } from 'snapwyr/express'",
    setup: "import express from 'express'",
    dashboardImport: "import { serve } from 'snapwyr/dashboard'",
    code: 'app.use(snapwyr({ logBody: true }))',
    dashboardCode: 'serve(3333)',
    constLine: 'const app = express()',
    comment: '// Start dashboard on port 3333',
  },
  {
    name: 'Next.js',
    import: "import { snapwyr } from 'snapwyr/nextjs'",
    setup: '// proxy.ts',
    code: 'export const proxy = snapwyr({ logBody: true })',
    constLine: null,
  },
  {
    name: 'Koa',
    import: "import { snapwyr } from 'snapwyr/koa'",
    setup: "import Koa from 'koa'",
    code: 'app.use(snapwyr({ logBody: true }))',
    constLine: 'const app = new Koa()',
  },
  {
    name: 'Fastify',
    import: "import { snapwyr } from 'snapwyr/fastify'",
    setup: "import Fastify from 'fastify'",
    code: 'fastify.register(snapwyr, { logBody: true })',
    constLine: 'const fastify = Fastify()',
  },
  {
    name: 'NestJS',
    import: "import { SnapwyrInterceptor } from 'snapwyr/nestjs'",
    setup: "import { APP_INTERCEPTOR } from '@nestjs/core'",
    code: 'useValue: SnapwyrInterceptor({ logBody: true })',
    constLine: null,
  },
  {
    name: 'Hono',
    import: "import { snapwyr } from 'snapwyr/hono'",
    setup: "import { Hono } from 'hono'",
    code: "app.use('*', snapwyr({ logBody: true }))",
    constLine: 'const app = new Hono()',
  },
];

export function IDEFrameworks() {
  const [selected, setSelected] = useState(0);

  const selectedFramework = frameworks[selected];
  if (!selectedFramework) return null;

  return (
    <section className='py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8 border-t border-white/10 bg-[#000000] relative overflow-hidden'>
      {/* CRT Scanlines */}
      <div className='absolute inset-0 pointer-events-none opacity-[0.02]'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.05) 2px, rgba(255, 255, 255, 0.05) 4px)',
          }}
        />
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-8 sm:mb-12'
        >
          <div className='text-xs sm:text-sm text-white/60 font-mono mb-2'>
            <span className='text-gray-500'>//</span> Frameworks
          </div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white font-mono'>
            {'>'} Works with your stack
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
          {/* Framework selector */}
          <div className='bg-[#000000] border border-white/10 rounded overflow-hidden'>
            <div className='bg-[#0a0a0a] px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/10'>
              <div className='text-[10px] sm:text-xs text-white font-mono'>
                <span className='text-white/40'>[</span>FRAMEWORKS
                <span className='text-white/40'>]</span>
              </div>
            </div>
            <div className='p-3 sm:p-4 space-y-2'>
              {frameworks.map((fw, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded font-mono text-xs sm:text-sm transition-all duration-200 ${
                    selected === idx
                      ? 'bg-[#0a0a0a] text-white border-2 border-white'
                      : 'bg-[#000000] text-white/70 hover:bg-[#0a0a0a] hover:text-white border border-white/10'
                  }`}
                >
                  {'>'} {fw.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Code preview */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-[#000000] border border-white/10 rounded overflow-hidden'
          >
            <div className='bg-[#0a0a0a] px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/10 flex items-center gap-2'>
              <div className='text-[10px] sm:text-xs text-white font-mono'>
                <span className='text-white/40'>[</span>CODE
                <span className='text-white/40'>]</span>
              </div>
              <div className='ml-auto text-[10px] sm:text-xs text-white/40 font-mono'>
                {selectedFramework.name}
              </div>
            </div>
            <div className='p-4 sm:p-6 font-mono text-xs sm:text-sm bg-[#000000] overflow-x-auto'>
              <div className='mb-3'>
                {selectedFramework.import.includes('{') ? (
                  <>
                    <span className='text-cyan-400'>import</span>{' '}
                    <span className='text-blue-300'>
                      {selectedFramework.import.match(/\{[^}]+\}/)?.[0] ||
                        '{ snapwyr }'}
                    </span>{' '}
                    <span className='text-cyan-400'>from</span>{' '}
                    <span className='text-yellow-300'>
                      {selectedFramework.import.match(/'[^']+'/)?.[0] ||
                        "'snapwyr/express'"}
                    </span>
                    ;
                  </>
                ) : (
                  <>
                    <span className='text-cyan-400'>import</span>{' '}
                    <span className='text-blue-300'>
                      {selectedFramework.import.split(' ')[1]}
                    </span>{' '}
                    <span className='text-cyan-400'>from</span>{' '}
                    <span className='text-yellow-300'>
                      {selectedFramework.import.match(/'[^']+'/)?.[0] ||
                        "'snapwyr/express'"}
                    </span>
                    ;
                  </>
                )}
              </div>
              {selectedFramework.setup &&
                !selectedFramework.setup.startsWith('//') && (
                  <div className='mb-3'>
                    {selectedFramework.setup.includes('{') ? (
                      <>
                        <span className='text-cyan-400'>import</span>{' '}
                        <span className='text-blue-300'>
                          {selectedFramework.setup.match(/\{[^}]+\}/)?.[0] ||
                            selectedFramework.setup.split(' ')[1]}
                        </span>{' '}
                        <span className='text-cyan-400'>from</span>{' '}
                        <span className='text-yellow-300'>
                          {selectedFramework.setup.match(/'[^']+'/)?.[0] ||
                            "''"}
                        </span>
                        ;
                      </>
                    ) : (
                      <>
                        <span className='text-cyan-400'>import</span>{' '}
                        <span className='text-blue-300'>
                          {selectedFramework.setup.split(' ')[1]}
                        </span>{' '}
                        <span className='text-cyan-400'>from</span>{' '}
                        <span className='text-yellow-300'>
                          {selectedFramework.setup.match(/'[^']+'/)?.[0] ||
                            "''"}
                        </span>
                        ;
                      </>
                    )}
                  </div>
                )}
              {selectedFramework.dashboardImport && (
                <div className='mb-3'>
                  <span className='text-cyan-400'>import</span>{' '}
                  <span className='text-blue-300'>
                    {selectedFramework.dashboardImport.match(/\{[^}]+\}/)?.[0]}
                  </span>{' '}
                  <span className='text-cyan-400'>from</span>{' '}
                  <span className='text-yellow-300'>
                    {selectedFramework.dashboardImport.match(/'[^']+'/)?.[0]}
                  </span>
                  ;
                </div>
              )}
              {selectedFramework.setup?.startsWith('//') && (
                <div className='text-gray-500 mb-3'>
                  {selectedFramework.setup}
                </div>
              )}
              {selectedFramework.constLine && (
                <div className='mb-3'>
                  <span className='text-cyan-400'>const</span>{' '}
                  <span className='text-blue-300'>
                    {(selectedFramework.constLine
                      .split('=')[0]
                      ?.trim()
                      .split(' ') || [])[1] || 'app'}
                  </span>{' '}
                  ={' '}
                  {selectedFramework.constLine.includes('new') ? (
                    <>
                      <span className='text-cyan-400'>new</span>{' '}
                      <span className='text-blue-300'>
                        {(selectedFramework.constLine
                          .split('new ')[1]
                          ?.split('(') || [])[0] || 'Koa'}
                      </span>
                      <span className='text-yellow-300'>()</span>
                    </>
                  ) : (
                    <span className='text-blue-300'>
                      {selectedFramework.constLine.split('=')[1]?.trim() ||
                        'express()'}
                    </span>
                  )}
                </div>
              )}
              <div className='text-gray-500 mb-2'>
                {selectedFramework.name === 'Dashboard'
                  ? '// Log incoming requests'
                  : '// One line integration'}
              </div>
              <div className='mb-2'>
                {selectedFramework.name === 'Next.js' ? (
                  <>
                    <span className='text-cyan-400'>export const</span>{' '}
                    <span className='text-blue-300'>proxy</span> ={' '}
                    <span className='text-blue-300'>snapwyr</span>(
                    <span className='text-white'>{'{'} </span>
                    <span className='text-purple-300'>logBody</span>
                    <span className='text-white'>: </span>
                    <span className='text-green-400'>true</span>
                    <span className='text-white'> {'}'})</span>
                  </>
                ) : selectedFramework.name === 'NestJS' ? (
                  <>
                    <span className='text-purple-300'>useValue</span>:{' '}
                    <span className='text-blue-300'>SnapwyrInterceptor</span>(
                    <span className='text-white'>{'{'} </span>
                    <span className='text-purple-300'>logBody</span>
                    <span className='text-white'>: </span>
                    <span className='text-green-400'>true</span>
                    <span className='text-white'> {'}'})</span>
                  </>
                ) : selectedFramework.name === 'Fastify' ? (
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
                ) : selectedFramework.name === 'Hono' ? (
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
              {selectedFramework.comment && (
                <div className='text-gray-500 mb-2'>
                  {selectedFramework.comment}
                </div>
              )}
              {selectedFramework.dashboardCode && (
                <div>
                  <span className='text-blue-300'>serve</span>(
                  <span className='text-yellow-300'>3333</span>);
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
