'use client';

import { motion } from 'motion/react';

interface CodeBlockProps {
  children: React.ReactNode;
  output?: React.ReactNode;
}

export function CodeBlock({ children, output }: CodeBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className='bg-black border border-white/10 rounded-xl p-6 overflow-x-auto'
    >
      {/* Code editor header */}
      <div className='flex items-center gap-2 mb-4 pb-4 border-b border-white/10'>
        <div className='flex gap-1.5'>
          <div className='w-2.5 h-2.5 rounded-full bg-white/20' />
          <div className='w-2.5 h-2.5 rounded-full bg-white/20' />
          <div className='w-2.5 h-2.5 rounded-full bg-white/20' />
        </div>
        <div className='ml-auto text-xs text-white/30 font-mono'>server.ts</div>
      </div>

      <pre className='text-sm font-mono leading-relaxed overflow-x-auto'>
        <code>{children}</code>
      </pre>

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className='mt-4 pt-4 border-t border-white/10'
        >
          <div className='text-xs font-mono whitespace-pre-wrap leading-relaxed'>
            {output}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
