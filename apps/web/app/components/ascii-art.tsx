'use client';

import { motion } from 'motion/react';

export function AsciiArt() {
  const asciiText = ` ____  _      ____  ____  _     ___  _ ____ 
/ ___\\/ \\  /|/  _ \\/  __\\/ \\  /|\\  \\///  __\\
|    \\| |\\ ||| / \\||  \\/|| |  || \\  / |  \\/|
\\___ || | \\||| |-|||  __/| |/\\|| / /  |    /
\\____/\\_/  \\|\\_/ \\|\\_/   \\_/  \\|/_/   \\_/\\_\\`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='w-full overflow-x-auto px-2'
    >
      <pre
        className='text-green-400 text-[8px] xs:text-[10px] sm:text-sm md:text-base lg:text-xl xl:text-2xl font-mono leading-tight mx-auto whitespace-pre font-bold inline-block'
        style={{
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow:
            '0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.5)',
        }}
      >
        {asciiText}
      </pre>
    </motion.div>
  );
}
