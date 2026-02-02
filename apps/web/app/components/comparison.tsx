'use client';

import { motion } from 'motion/react';
import { useState } from 'react';

const comparisonData = [
  {
    feature: 'Real-time dashboard',
    snapwyr: '✓',
    manual: 'N/A',
    other: 'N/A',
  },
  {
    feature: 'Zero configuration',
    snapwyr: '✓',
    manual: '✗',
    other: 'Partial',
  },
  {
    feature: 'Automatic interception',
    snapwyr: '✓',
    manual: '✗',
    other: 'Partial',
  },
  {
    feature: 'Framework middleware',
    snapwyr: '✓',
    manual: '✗',
    other: 'Limited',
  },
  {
    feature: 'Production-safe',
    snapwyr: '✓',
    manual: 'Manual',
    other: 'Varies',
  },
  {
    feature: 'Terminal output',
    snapwyr: '✓',
    manual: 'Manual',
    other: 'Varies',
  },
  {
    feature: 'Small bundle size',
    snapwyr: '✓',
    manual: 'N/A',
    other: 'Varies',
  },
];

export function Comparison() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section className='py-16 sm:py-24 lg:py-32 px-3 sm:px-6 lg:px-8 border-t border-green-500/20 bg-black/50 relative overflow-hidden font-mono'>
      {/* Terminal background */}
      <div className='absolute inset-0 opacity-[0.02]'>
        <div
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
          className='text-center mb-10 sm:mb-16 lg:mb-20'
        >
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-green-400 font-mono tracking-wider'>
            $ compare --snapwyr
          </h2>
          <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-400 max-w-3xl mx-auto font-mono px-2'>
            [ANALYSIS] See how we compare
          </p>
        </motion.div>

        {/* Desktop Table View */}
        <div className='hidden lg:block overflow-x-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='bg-black border-2 border-green-500/50 rounded-none overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.2)] glitch'
          >
            <div className='bg-green-500/10 border-b-2 border-green-500/50'>
              <table className='w-full font-mono'>
                <thead>
                  <tr>
                    <th className='text-left p-6 font-bold text-lg text-green-400'>
                      FEATURE
                    </th>
                    <th className='text-center p-6 font-bold text-lg'>
                      <span className='text-green-400 bg-black/50 px-4 py-2 border border-green-500/50'>
                        SNAPWYR
                      </span>
                    </th>
                    <th className='text-center p-6 font-semibold text-gray-500 text-lg'>
                      MANUAL
                    </th>
                    <th className='text-center p-6 font-semibold text-gray-500 text-lg'>
                      OTHERS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      onHoverStart={() => setHoveredRow(index)}
                      onHoverEnd={() => setHoveredRow(null)}
                      className={`border-b border-green-500/10 transition-all font-mono ${
                        hoveredRow === index
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'hover:bg-green-500/5'
                      }`}
                    >
                      <td className='p-6 font-semibold text-lg text-cyan-400'>
                        {row.feature}
                      </td>
                      <td className='p-6 text-center'>
                        <motion.span
                          animate={{
                            scale: hoveredRow === index ? 1.3 : 1,
                          }}
                          transition={{
                            duration: 0.4,
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                          }}
                          className='inline-block text-green-400 font-bold text-2xl'
                        >
                          {row.snapwyr}
                        </motion.span>
                      </td>
                      <td className='p-6 text-center text-gray-500 text-lg'>
                        {row.manual}
                      </td>
                      <td className='p-6 text-center text-gray-500 text-lg'>
                        {row.other}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Mobile Card View */}
        <div className='lg:hidden space-y-4 sm:space-y-6'>
          {comparisonData.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              className='bg-black border border-green-500/50 sm:border-2 p-4 sm:p-6 font-mono'
            >
              <h3 className='font-bold mb-4 sm:mb-6 text-base sm:text-lg md:text-xl text-center text-green-400'>
                {row.feature}
              </h3>
              <div className='space-y-3 sm:space-y-4'>
                <div className='flex items-center justify-between p-3 sm:p-4 bg-green-500/10 border border-green-500/50'>
                  <span className='text-cyan-400 font-semibold text-xs sm:text-sm'>
                    SNAPWYR
                  </span>
                  <span className='text-green-400 font-bold text-xl sm:text-2xl'>
                    {row.snapwyr}
                  </span>
                </div>
                <div className='flex items-center justify-between p-3 sm:p-4 bg-black/50 border border-gray-700'>
                  <span className='text-gray-400 text-xs sm:text-sm'>
                    MANUAL
                  </span>
                  <span className='text-gray-500 text-sm sm:text-base'>
                    {row.manual}
                  </span>
                </div>
                <div className='flex items-center justify-between p-3 sm:p-4 bg-black/50 border border-gray-700'>
                  <span className='text-gray-400 text-xs sm:text-sm'>
                    OTHERS
                  </span>
                  <span className='text-gray-500 text-sm sm:text-base'>
                    {row.other}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
