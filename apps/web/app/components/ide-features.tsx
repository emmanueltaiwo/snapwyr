'use client';

import { motion } from 'motion/react';

const features = [
  { icon: '⚡', title: 'Zero-config', desc: 'No setup needed' },
  { icon: '📊', title: 'Real-time dashboard', desc: 'Live WebSocket updates' },
  {
    icon: '🔌',
    title: 'Framework agnostic',
    desc: 'Works with all frameworks',
  },
  { icon: '🔒', title: 'Auto redaction', desc: 'Secures sensitive data' },
  { icon: '🔄', title: 'Bidirectional', desc: 'Logs incoming & outgoing' },
  { icon: '📋', title: 'cURL export', desc: 'Copy requests instantly' },
];

export function IDEFeatures() {
  return (
    <section className='py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#181818]'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-12'
        >
          <div className='text-sm text-white/40 font-mono mb-2'>
            // Features
          </div>
          <h2 className='text-3xl font-bold text-white font-mono'>
            Everything you need
          </h2>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className='bg-[#1e1e1e] border border-white/5 rounded-lg p-5 hover:bg-[#252526] hover:border-white/10 transition-all duration-200 group cursor-pointer'
            >
              <div className='text-2xl mb-2'>{feature.icon}</div>
              <div className='text-white font-mono text-sm font-semibold mb-1'>
                {feature.title}
              </div>
              <div className='text-white/50 text-xs font-mono'>
                {feature.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
