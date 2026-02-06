'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

const frameworks = [
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
    name: 'Express',
    import: "import { snapwyr } from 'snapwyr/express'",
    setup: "import express from 'express'",
    code: 'app.use(snapwyr({ logBody: true }))',
    constLine: 'const app = express()',
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
    <section className='py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-12'
        >
          <div className='text-sm text-white/40 font-mono mb-2'>
            // Frameworks
          </div>
          <h2 className='text-3xl font-bold text-white font-mono'>
            Works with your stack
          </h2>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-6'>
          {/* Framework selector */}
          <div className='bg-[#1e1e1e] border border-white/10 rounded-lg overflow-hidden'>
            <div className='bg-[#252526] px-4 py-2.5 border-b border-white/5'>
              <div className='text-xs text-white/60 font-mono'>FRAMEWORKS</div>
            </div>
            <div className='p-4 space-y-2'>
              {frameworks.map((fw, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelected(idx)}
                  className={`w-full text-left px-4 py-3 rounded font-mono text-sm transition-all duration-200 ${
                    selected === idx
                      ? 'bg-[#094771] text-white border border-[#007acc] shadow-lg'
                      : 'bg-[#252526] text-white/70 hover:bg-[#2d2d30] hover:text-white border border-transparent'
                  }`}
                >
                  {fw.name}
                </button>
              ))}
            </div>
          </div>

          {/* Code preview */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-[#1e1e1e] border border-white/10 rounded-lg overflow-hidden'
          >
            <div className='bg-[#252526] px-4 py-2.5 border-b border-white/5 flex items-center gap-2'>
              <div className='text-xs text-white/60 font-mono'>CODE</div>
              <div className='ml-auto text-xs text-white/40 font-mono'>
                {selectedFramework.name}
              </div>
            </div>
            <div className='p-6 font-mono text-sm'>
              <div className='text-white/50 mb-3'>
                {selectedFramework.import.includes('{') ? (
                  <>
                    <span className='text-[#569cd6]'>import</span>{' '}
                    <span className='text-[#ce9178]'>
                      {selectedFramework.import.match(/\{[^}]+\}/)?.[0] ||
                        '{ snapwyr }'}
                    </span>{' '}
                    <span className='text-[#569cd6]'>from</span>{' '}
                    <span className='text-[#ce9178]'>
                      {selectedFramework.import.match(/'[^']+'/)?.[0] ||
                        "'snapwyr/express'"}
                    </span>
                    ;
                  </>
                ) : (
                  <>
                    <span className='text-[#569cd6]'>import</span>{' '}
                    <span className='text-[#4ec9b0]'>
                      {selectedFramework.import.split(' ')[1]}
                    </span>{' '}
                    <span className='text-[#569cd6]'>from</span>{' '}
                    <span className='text-[#ce9178]'>
                      {selectedFramework.import.match(/'[^']+'/)?.[0] ||
                        "'snapwyr/express'"}
                    </span>
                    ;
                  </>
                )}
              </div>
              {selectedFramework.setup &&
                !selectedFramework.setup.startsWith('//') && (
                  <div className='text-white/50 mb-3'>
                    {selectedFramework.setup.includes('{') ? (
                      <>
                        <span className='text-[#569cd6]'>import</span>{' '}
                        <span className='text-[#ce9178]'>
                          {selectedFramework.setup.match(/\{[^}]+\}/)?.[0] ||
                            selectedFramework.setup.split(' ')[1]}
                        </span>{' '}
                        <span className='text-[#569cd6]'>from</span>{' '}
                        <span className='text-[#ce9178]'>
                          {selectedFramework.setup.match(/'[^']+'/)?.[0] ||
                            "''"}
                        </span>
                        ;
                      </>
                    ) : (
                      <>
                        <span className='text-[#569cd6]'>import</span>{' '}
                        <span className='text-[#4ec9b0]'>
                          {selectedFramework.setup.split(' ')[1]}
                        </span>{' '}
                        <span className='text-[#569cd6]'>from</span>{' '}
                        <span className='text-[#ce9178]'>
                          {selectedFramework.setup.match(/'[^']+'/)?.[0] ||
                            "''"}
                        </span>
                        ;
                      </>
                    )}
                  </div>
                )}
              {selectedFramework.dashboardImport && (
                <div className='text-white/50 mb-3'>
                  <span className='text-[#569cd6]'>import</span>{' '}
                  <span className='text-[#ce9178]'>
                    {selectedFramework.dashboardImport.match(/\{[^}]+\}/)?.[0]}
                  </span>{' '}
                  <span className='text-[#569cd6]'>from</span>{' '}
                  <span className='text-[#ce9178]'>
                    {selectedFramework.dashboardImport.match(/'[^']+'/)?.[0]}
                  </span>
                  ;
                </div>
              )}
              {selectedFramework.setup?.startsWith('//') && (
                <div className='text-white/40 mb-3'>
                  {selectedFramework.setup}
                </div>
              )}
              {selectedFramework.constLine && (
                <div className='text-white/50 mb-3'>
                  <span className='text-[#569cd6]'>const</span>{' '}
                  <span className='text-[#4ec9b0]'>
                    {(selectedFramework.constLine
                      .split('=')[0]
                      ?.trim()
                      .split(' ') || [])[1] || 'app'}
                  </span>{' '}
                  ={' '}
                  {selectedFramework.constLine.includes('new') ? (
                    <>
                      <span className='text-[#569cd6]'>new</span>{' '}
                      <span className='text-[#4ec9b0]'>
                        {(selectedFramework.constLine
                          .split('new ')[1]
                          ?.split('(') || [])[0] || 'Koa'}
                      </span>
                      <span className='text-white'>()</span>
                    </>
                  ) : (
                    <span className='text-[#4ec9b0]'>
                      {selectedFramework.constLine.split('=')[1]?.trim() ||
                        'express()'}
                    </span>
                  )}
                </div>
              )}
              <div className='text-white/40 mb-2'>
                {selectedFramework.name === 'Dashboard'
                  ? '// Log incoming requests'
                  : '// One line integration'}
              </div>
              <div className='text-[#4ec9b0] mb-2'>
                {selectedFramework.code}
              </div>
              {selectedFramework.comment && (
                <div className='text-white/40 mb-2'>
                  {selectedFramework.comment}
                </div>
              )}
              {selectedFramework.dashboardCode && (
                <div className='text-[#4ec9b0]'>
                  <span className='text-[#4ec9b0]'>serve</span>(
                  <span className='text-[#ce9178]'>3333</span>);
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
