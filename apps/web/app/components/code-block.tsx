"use client";

import { motion } from "motion/react";

interface CodeBlockProps {
  children: React.ReactNode;
  output?: React.ReactNode;
}

export function CodeBlock({ children, output }: CodeBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black border border-green-500/50 sm:border-2 rounded-none p-3 sm:p-4 md:p-6 overflow-x-auto shadow-[0_0_20px_rgba(0,255,0,0.3)] font-mono relative"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 pb-2 border-b border-green-500/30">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 border border-red-600"></div>
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 border border-yellow-600"></div>
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 border border-green-600"></div>
        <div className="ml-auto text-[10px] sm:text-xs text-green-400">terminal</div>
      </div>
      
      <pre className="text-[10px] xs:text-xs sm:text-sm font-mono overflow-x-auto">
        <code className="text-gray-300">{children}</code>
      </pre>
      
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-500/30"
        >
          <div className="text-[10px] sm:text-xs text-green-400 font-mono whitespace-pre-wrap">
            {output}
          </div>
        </motion.div>
      )}
      
      {/* Terminal cursor */}
      <span className="terminal-cursor absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-green-400" />
    </motion.div>
  );
}
