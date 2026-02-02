'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useState } from 'react';

const frameworks = [
  {
    name: 'Dashboard',
    command: 'snapwyr/dashboard',
    code: (
      <>
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ snapwyr }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'snapwyr/express'</span>;{'\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ serve }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'snapwyr/dashboard'</span>;{'\n\n'}
        <span className='text-gray-500'>// Log incoming requests</span>
        {'\n'}
        <span className='text-cyan-400'>app</span>.
        <span className='text-yellow-400'>use</span>
        <span className='text-gray-500'>(</span>
        <span className='text-cyan-400'>snapwyr</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>{'{ logBody: true }'}</span>
        <span className='text-gray-500'>))</span>;{'\n\n'}
        <span className='text-gray-500'>// Start dashboard</span>
        {'\n'}
        <span className='text-cyan-400'>serve</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>3333</span>
        <span className='text-gray-500'>)</span>;
      </>
    ),
    output: (
      <>
        <span className='text-orange-400'>[DASHBOARD]</span>{' '}
        <span className='text-gray-300'>http://localhost:3333</span>
        {'\n'}
        <span className='text-green-400'>[LOG]</span>{' '}
        <span className='text-cyan-400'>POST</span>{' '}
        <span className='text-yellow-400'>201</span>{' '}
        <span className='text-green-300'>45ms</span>{' '}
        <span className='text-gray-300'>/api/users</span>
      </>
    ),
  },
  {
    name: 'Express',
    command: 'snapwyr/express',
    code: (
      <>
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>express</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'express'</span>;{'\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ snapwyr }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'snapwyr/express'</span>;{'\n\n'}
        <span className='text-purple-400'>const</span>{' '}
        <span className='text-cyan-400'>app</span> ={' '}
        <span className='text-cyan-400'>express</span>
        <span className='text-gray-500'>()</span>;{'\n\n'}
        <span className='text-cyan-400'>app</span>.
        <span className='text-yellow-400'>use</span>
        <span className='text-gray-500'>(</span>
        <span className='text-cyan-400'>snapwyr</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>{'{ logBody: true }'}</span>
        <span className='text-gray-500'>))</span>;
      </>
    ),
    output: (
      <>
        <span className='text-green-400'>[LOG]</span>{' '}
        <span className='text-cyan-400'>POST</span>{' '}
        <span className='text-yellow-400'>201</span>{' '}
        <span className='text-green-300'>45ms</span>{' '}
        <span className='text-gray-300'>/api/users</span>
      </>
    ),
  },
  {
    name: 'Next.js',
    command: 'snapwyr/nextjs',
    code: (
      <>
        <span className='text-green-400'>$</span>{' '}
        <span className='text-cyan-400'>npm</span>{' '}
        <span className='text-yellow-400'>install</span>{' '}
        <span className='text-green-300'>snapwyr</span>
        {'\n\n'}
        <span className='text-gray-500'>// proxy.ts</span>
        {'\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ snapwyr }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'snapwyr/nextjs'</span>;{'\n\n'}
        <span className='text-purple-400'>export const</span>{' '}
        <span className='text-cyan-400'>proxy</span> ={' '}
        <span className='text-cyan-400'>snapwyr</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>{'{ logBody: true }'}</span>
        <span className='text-gray-500'>)</span>;
      </>
    ),
    output: (
      <>
        <span className='text-green-400'>[LOG]</span>{' '}
        <span className='text-cyan-400'>GET</span>{' '}
        <span className='text-yellow-400'>200</span>{' '}
        <span className='text-green-300'>12ms</span>{' '}
        <span className='text-gray-300'>/api/users</span>
        {'\n'}
        <span className='text-green-400'>[RES]</span>{' '}
        <span className='text-green-300'>{'[{ id: 1 }, { id: 2 }]'}</span>
      </>
    ),
  },
  {
    name: 'Koa',
    command: 'snapwyr/koa',
    code: (
      <>
        <span className='text-green-400'>$</span>{' '}
        <span className='text-cyan-400'>npm</span>{' '}
        <span className='text-yellow-400'>install</span>{' '}
        <span className='text-green-300'>snapwyr</span>
        {'\n\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>Koa</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'koa'</span>;{'\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ snapwyr }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'snapwyr/koa'</span>;{'\n\n'}
        <span className='text-purple-400'>const</span>{' '}
        <span className='text-cyan-400'>app</span> ={' '}
        <span className='text-purple-400'>new</span>{' '}
        <span className='text-cyan-400'>Koa</span>
        <span className='text-gray-500'>()</span>;{'\n\n'}
        <span className='text-cyan-400'>app</span>.
        <span className='text-yellow-400'>use</span>
        <span className='text-gray-500'>(</span>
        <span className='text-cyan-400'>snapwyr</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>{'{ logBody: true }'}</span>
        <span className='text-gray-500'>))</span>;
      </>
    ),
    output: (
      <>
        <span className='text-green-400'>[LOG]</span>{' '}
        <span className='text-cyan-400'>PUT</span>{' '}
        <span className='text-yellow-400'>200</span>{' '}
        <span className='text-green-300'>89ms</span>{' '}
        <span className='text-gray-300'>/api/users/1</span>
        {'\n'}
        <span className='text-green-400'>[REQ]</span>{' '}
        <span className='text-cyan-400'>{"{ name: 'Jane' }"}</span>
        {'\n'}
        <span className='text-green-400'>[RES]</span>{' '}
        <span className='text-green-300'>{"{ id: 1, name: 'Jane' }"}</span>
      </>
    ),
  },
  {
    name: 'Fastify',
    command: 'snapwyr/fastify',
    code: (
      <>
        <span className='text-green-400'>$</span>{' '}
        <span className='text-cyan-400'>npm</span>{' '}
        <span className='text-yellow-400'>install</span>{' '}
        <span className='text-green-300'>snapwyr</span>
        {'\n\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>Fastify</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'fastify'</span>;{'\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ snapwyr }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'snapwyr/fastify'</span>;{'\n\n'}
        <span className='text-purple-400'>const</span>{' '}
        <span className='text-cyan-400'>fastify</span> ={' '}
        <span className='text-cyan-400'>Fastify</span>
        <span className='text-gray-500'>()</span>;{'\n\n'}
        <span className='text-cyan-400'>fastify</span>.
        <span className='text-yellow-400'>register</span>
        <span className='text-gray-500'>(</span>
        <span className='text-purple-400'>async</span>{' '}
        <span className='text-gray-500'>(</span>
        <span className='text-cyan-400'>fastify</span>
        <span className='text-gray-500'>) {'=> {'}</span>
        {'\n'}
        <span className='text-gray-500'> </span>
        <span className='text-cyan-400'>fastify</span>.
        <span className='text-yellow-400'>addHook</span>
        <span className='text-gray-500'>(</span>
        <span className='text-green-300'>'onRequest'</span>
        <span className='text-gray-500'>, </span>
        <span className='text-cyan-400'>snapwyr</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>{'{ logBody: true }'}</span>
        <span className='text-gray-500'>))</span>;{'\n'}
        <span className='text-gray-500'>{'})'}</span>;
      </>
    ),
    output: (
      <>
        <span className='text-green-400'>[LOG]</span>{' '}
        <span className='text-cyan-400'>DELETE</span>{' '}
        <span className='text-red-400'>204</span>{' '}
        <span className='text-green-300'>23ms</span>{' '}
        <span className='text-gray-300'>/api/users/1</span>
      </>
    ),
  },
  {
    name: 'NestJS',
    command: 'snapwyr/nestjs',
    code: (
      <>
        <span className='text-green-400'>$</span>{' '}
        <span className='text-cyan-400'>npm</span>{' '}
        <span className='text-yellow-400'>install</span>{' '}
        <span className='text-green-300'>snapwyr</span>
        {'\n\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ Module }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'@nestjs/common'</span>;{'\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ APP_INTERCEPTOR }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'@nestjs/core'</span>;{'\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ SnapwyrInterceptor }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'snapwyr/nestjs'</span>;{'\n\n'}
        <span className='text-cyan-400'>@Module</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>{'{'}</span>
        {'\n'}
        <span className='text-gray-500'> </span>
        <span className='text-yellow-400'>providers</span>
        <span className='text-gray-500'>: [</span>
        {'\n'}
        <span className='text-gray-500'> {'{'}</span>
        {'\n'}
        <span className='text-gray-500'> </span>
        <span className='text-yellow-400'>provide</span>
        <span className='text-gray-500'>: </span>
        <span className='text-cyan-400'>APP_INTERCEPTOR</span>
        <span className='text-gray-500'>,</span>
        {'\n'}
        <span className='text-gray-500'> </span>
        <span className='text-yellow-400'>useValue</span>
        <span className='text-gray-500'>: </span>
        <span className='text-cyan-400'>SnapwyrInterceptor</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>{'{ logBody: true }'}</span>
        <span className='text-gray-500'>),</span>
        {'\n'}
        <span className='text-gray-500'> {'}'}</span>
        {'\n'}
        <span className='text-gray-500'> ],</span>
        {'\n'}
        <span className='text-yellow-400'>{'}'}</span>
        <span className='text-gray-500'>)</span>
        {'\n'}
        <span className='text-purple-400'>export class</span>{' '}
        <span className='text-cyan-400'>AppModule</span> {'{}'}
      </>
    ),
    output: (
      <>
        <span className='text-green-400'>[LOG]</span>{' '}
        <span className='text-cyan-400'>GET</span>{' '}
        <span className='text-yellow-400'>200</span>{' '}
        <span className='text-green-300'>156ms</span>{' '}
        <span className='text-gray-300'>/api/users</span>
        {'\n'}
        <span className='text-green-400'>[RES]</span>{' '}
        <span className='text-green-300'>{"[{ id: 1, name: 'John' }]"}</span>
      </>
    ),
  },
  {
    name: 'Hono',
    command: 'snapwyr/hono',
    code: (
      <>
        <span className='text-green-400'>$</span>{' '}
        <span className='text-cyan-400'>npm</span>{' '}
        <span className='text-yellow-400'>install</span>{' '}
        <span className='text-green-300'>snapwyr</span>
        {'\n\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ Hono }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'hono'</span>;{'\n'}
        <span className='text-purple-400'>import</span>{' '}
        <span className='text-cyan-400'>{'{ snapwyr }'}</span>{' '}
        <span className='text-purple-400'>from</span>{' '}
        <span className='text-green-300'>'snapwyr/hono'</span>;{'\n\n'}
        <span className='text-purple-400'>const</span>{' '}
        <span className='text-cyan-400'>app</span> ={' '}
        <span className='text-purple-400'>new</span>{' '}
        <span className='text-cyan-400'>Hono</span>
        <span className='text-gray-500'>()</span>;{'\n\n'}
        <span className='text-cyan-400'>app</span>.
        <span className='text-yellow-400'>use</span>
        <span className='text-gray-500'>(</span>
        <span className='text-green-300'>'*'</span>
        <span className='text-gray-500'>, </span>
        <span className='text-cyan-400'>snapwyr</span>
        <span className='text-gray-500'>(</span>
        <span className='text-yellow-400'>{'{ logBody: true }'}</span>
        <span className='text-gray-500'>))</span>;
      </>
    ),
    output: (
      <>
        <span className='text-green-400'>[LOG]</span>{' '}
        <span className='text-cyan-400'>POST</span>{' '}
        <span className='text-yellow-400'>201</span>{' '}
        <span className='text-green-300'>8ms</span>{' '}
        <span className='text-gray-300'>/api/users</span>
        {'\n'}
        <span className='text-green-400'>[REQ]</span>{' '}
        <span className='text-cyan-400'>{"{ name: 'Alice' }"}</span>
        {'\n'}
        <span className='text-green-400'>[RES]</span>{' '}
        <span className='text-green-300'>{"{ id: 3, name: 'Alice' }"}</span>
      </>
    ),
  },
];

export function Installation() {
  const [selectedFramework, setSelectedFramework] = useState(0);

  return (
    <section className='py-16 sm:py-24 lg:py-32 px-3 sm:px-6 lg:px-8 border-t border-green-500/20 relative overflow-hidden font-mono'>
      {/* Terminal grid */}
      <div className='absolute inset-0 opacity-[0.02]'>
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className='absolute inset-0'
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className='text-center mb-8 sm:mb-12 lg:mb-16'
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 text-green-400 tracking-wider font-mono'
          >
            $ frameworks --supported
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='text-sm sm:text-base md:text-lg lg:text-xl text-cyan-400 max-w-2xl mx-auto font-mono px-2'
          >
            [INFO] One line. All requests logged.
          </motion.p>
        </motion.div>

        {/* Framework Selector */}
        <div className='flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-1'>
          {frameworks.map((framework, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedFramework(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 border sm:border-2 font-bold transition-all font-mono text-xs sm:text-sm md:text-base ${
                selectedFramework === index
                  ? 'bg-green-500 text-black border-green-500'
                  : 'bg-black border-green-500/50 text-green-400 hover:border-green-500 hover:bg-green-500/10'
              }`}
            >
              {framework.name}
            </motion.button>
          ))}
        </div>

        {/* Code Display */}
        <motion.div
          key={selectedFramework}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-5xl mx-auto px-1'
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='relative'
          >
            <div className='bg-black border border-green-500/50 sm:border-2 p-3 sm:p-4 md:p-6 shadow-[0_0_20px_rgba(0,255,0,0.3)]'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3 sm:mb-4 pb-2 border-b border-green-500/30'>
                <span className='text-green-400 font-bold text-sm sm:text-base md:text-lg'>
                  {frameworks[selectedFramework]?.name}
                </span>
                <span className='text-gray-500 text-xs sm:text-sm'>
                  → {frameworks[selectedFramework]?.command}
                </span>
              </div>
              <div className='bg-black/50 rounded-none p-2 sm:p-3 md:p-4 overflow-x-auto border border-green-500/30 mb-3 sm:mb-4'>
                <pre className='text-[10px] xs:text-xs sm:text-sm font-mono'>
                  <code className='text-gray-300'>
                    {frameworks[selectedFramework]?.code}
                  </code>
                </pre>
              </div>
              <div className='pt-3 sm:pt-4 border-t border-green-500/30'>
                <div className='text-[10px] sm:text-xs text-green-400 font-mono whitespace-pre-wrap'>
                  {frameworks[selectedFramework]?.output}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Installation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='text-center mt-8 sm:mt-12'
        >
          <div className='inline-block bg-black border border-green-500/50 sm:border-2 p-4 sm:p-6 mb-4 sm:mb-6'>
            <div className='text-xs sm:text-sm text-green-400 mb-2 font-mono'>
              [INSTALL]
            </div>
            <code className='text-sm sm:text-base md:text-lg font-mono text-green-300'>
              <span className='text-green-500'>$</span>{' '}
              <span className='text-cyan-400'>npm install</span>{' '}
              <span className='text-green-300'>snapwyr</span>
            </code>
          </div>
          <div className='mt-4 sm:mt-6'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href='/docs'
                className='inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-green-500 text-black border-2 border-green-500 font-bold hover:bg-green-400 transition-colors group font-mono tracking-wider text-sm sm:text-base'
              >
                $ docs --read
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className='inline-block'
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
