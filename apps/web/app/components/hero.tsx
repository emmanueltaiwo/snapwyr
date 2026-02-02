'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { CodeBlock } from './code-block';
import { AsciiArt } from './ascii-art';

export function Hero() {
  return (
    <section className='relative pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center font-mono'>
      {/* Terminal background grid */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className='max-w-7xl mx-auto w-full relative z-10'>
        {/* ASCII Art Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-6'
        >
          <AsciiArt />
          <div className='text-xs sm:text-sm text-cyan-400 font-mono mt-2'>
            [SYSTEM INITIALIZED]
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='flex justify-center mb-4 px-2'
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className='inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-green-500/50 bg-black/50 text-xs sm:text-sm text-green-400 font-mono backdrop-blur-sm text-center'
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 flex-shrink-0'
            />
            <span className='hidden sm:inline'>The first and only zero-config HTTP request logger</span>
            <span className='sm:hidden'>Zero-config HTTP logger</span>
          </motion.span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='text-center mb-4 px-2'
        >
          <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight font-mono'>
            <span className='text-gray-400'>Zero-config</span>{' '}
            <span className='text-green-400'>HTTP logger</span>{' '}
            <span className='text-gray-400'>+</span>{' '}
            <span className='text-cyan-400'>dashboard</span>
          </h2>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 px-4 font-mono'
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='w-full sm:w-auto'
          >
            <Link
              href='/docs'
              className='relative px-6 sm:px-8 py-3 sm:py-4 bg-green-500 text-black rounded-none border-2 border-green-500 font-bold overflow-hidden group text-center font-mono tracking-wider block text-sm sm:text-base'
            >
              <span className='relative z-10'>$ npm start</span>
              <motion.div
                className='absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity'
                initial={false}
              />
            </Link>
          </motion.div>
          <motion.a
            href='https://github.com/emmanueltaiwo/snapwyr'
            target='_blank'
            rel='noopener noreferrer'
            whileHover={{ scale: 1.05, borderColor: 'rgb(34, 211, 238)' }}
            whileTap={{ scale: 0.95 }}
            className='px-6 sm:px-8 py-3 sm:py-4 border-2 border-cyan-500 rounded-none font-bold hover:bg-cyan-500/10 transition-all w-full sm:w-auto text-center font-mono text-cyan-400 tracking-wider text-sm sm:text-base'
          >
            $ git clone
          </motion.a>
        </motion.div>

        {/* Code Preview - Terminal Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className='max-w-5xl mx-auto px-2 sm:px-4'
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <CodeBlock
              output={
                <>
                  <span className='text-green-400'>[LOG]</span>{' '}
                  <span className='text-cyan-400'>POST</span>{' '}
                  <span className='text-yellow-400'>201</span>{' '}
                  <span className='text-green-300'>45ms</span>{' '}
                  <span className='text-gray-300'>/api/users</span>
                  {'\n'}
                  <span className='text-orange-400'>[DASHBOARD]</span>{' '}
                  <span className='text-gray-300'>http://localhost:3333</span>
                </>
              }
            >
              <span className='text-purple-400'>import</span>{' '}
              <span className='text-cyan-400'>{'{ snapwyr }'}</span>{' '}
              <span className='text-purple-400'>from</span>{' '}
              <span className='text-green-300'>'snapwyr/express'</span>;{'\n'}
              <span className='text-purple-400'>import</span>{' '}
              <span className='text-cyan-400'>{'{ serve }'}</span>{' '}
              <span className='text-purple-400'>from</span>{' '}
              <span className='text-green-300'>'snapwyr/dashboard'</span>;{'\n\n'}
              <span className='text-gray-500'>// Log all incoming requests</span>{'\n'}
              <span className='text-cyan-400'>app</span>
              <span className='text-gray-500'>.</span>
              <span className='text-yellow-400'>use</span>
              <span className='text-gray-500'>(</span>
              <span className='text-cyan-400'>snapwyr</span>
              <span className='text-gray-500'>(</span>
              <span className='text-yellow-400'>{'{ logBody: true }'}</span>
              <span className='text-gray-500'>))</span>;{'\n\n'}
              <span className='text-gray-500'>// Open dashboard at localhost:3333</span>{'\n'}
              <span className='text-cyan-400'>serve</span>
              <span className='text-gray-500'>(</span>
              <span className='text-yellow-400'>3333</span>
              <span className='text-gray-500'>)</span>;
            </CodeBlock>
          </motion.div>
        </motion.div>
      </div>

      {/* Terminal-style background effects */}
      <div className='absolute inset-0 -z-0 overflow-hidden pointer-events-none'>
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl'
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl'
        />
      </div>
    </section>
  );
}
