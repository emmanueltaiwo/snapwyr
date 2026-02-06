'use client';

import { motion } from 'motion/react';

const features = [
  { icon: '⚡', title: 'Zero-config', desc: 'No setup needed', ascii: 'ZERO' },
  {
    icon: '📊',
    title: 'Real-time dashboard',
    desc: 'Live WebSocket updates',
    ascii: 'REAL',
  },
  {
    icon: '🔌',
    title: 'Framework agnostic',
    desc: 'Works with all frameworks',
    ascii: 'AGNO',
  },
  {
    icon: '🔒',
    title: 'Auto redaction',
    desc: 'Secures sensitive data',
    ascii: 'AUTO',
  },
  {
    icon: '🔄',
    title: 'Bidirectional',
    desc: 'Logs incoming & outgoing',
    ascii: 'BI-DI',
  },
  {
    icon: '📋',
    title: 'cURL export',
    desc: 'Copy requests instantly',
    ascii: 'CURL',
  },
];

export function IDEFeatures() {
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
            <span className='text-gray-500'>//</span> Features
          </div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white font-mono'>
            {'>'} Everything you need
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{
                borderColor: '#ffffff',
                boxShadow: '0 0 20px rgba(255,255,255,0.1)',
              }}
              className='bg-[#000000] border border-white/10 rounded p-4 sm:p-6 hover:bg-[#0a0a0a] transition-all duration-200 group cursor-pointer relative overflow-hidden'
            >
              {/* ASCII badge */}
              <div className='absolute top-2 right-2 text-white/20 font-mono text-[10px] sm:text-xs'>
                [{feature.ascii}]
              </div>

              <div className='text-xl sm:text-2xl mb-2 sm:mb-3'>
                {feature.icon}
              </div>
              <div className='text-white font-mono text-sm sm:text-base font-semibold mb-1'>
                {'>'} {feature.title}
              </div>
              <div className='text-white/60 text-xs sm:text-sm font-mono'>
                {feature.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
