'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { GitHubStars } from './github-stars';
import { useState } from 'react';
import Image from 'next/image';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='fixed top-0 w-full z-50 border-b border-green-500/20 bg-black/95 backdrop-blur-sm font-mono'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-14 sm:h-16'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href='/'
              className='text-lg sm:text-xl font-bold cursor-pointer text-green-400 tracking-wider'
            >
              <Image
                src='/logo-full-white.png'
                alt='snapwyr'
                width={100}
                height={100}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='hidden sm:flex items-center gap-4 md:gap-6'
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href='/docs'
                className='text-sm text-cyan-400 hover:text-green-400 transition-colors relative group'
              >
                <span className='text-green-500'>$</span> docs
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300' />
              </Link>
            </motion.div>
            <GitHubStars showInNav />
            <motion.a
              href='https://www.npmjs.com/package/snapwyr'
              target='_blank'
              rel='noopener noreferrer'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='text-sm text-cyan-400 hover:text-green-400 transition-colors'
            >
              <span className='text-green-500'>$</span> npm
            </motion.a>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='sm:hidden flex flex-col gap-1.5 p-2'
            aria-label='Toggle menu'
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className='w-5 h-0.5 bg-green-400 block'
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className='w-5 h-0.5 bg-green-400 block'
            />
            <motion.span
              animate={
                isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className='w-5 h-0.5 bg-green-400 block'
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='sm:hidden border-t border-green-500/20 overflow-hidden'
            >
              <div className='py-4 space-y-4'>
                <Link
                  href='/docs'
                  onClick={() => setIsMenuOpen(false)}
                  className='block text-sm text-cyan-400 hover:text-green-400 transition-colors py-2'
                >
                  <span className='text-green-500'>$</span> docs
                </Link>
                <a
                  href='https://github.com/emmanueltaiwo/snapwyr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block text-sm text-cyan-400 hover:text-green-400 transition-colors py-2'
                >
                  <span className='text-green-500'>$</span> github
                </a>
                <a
                  href='https://www.npmjs.com/package/snapwyr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block text-sm text-cyan-400 hover:text-green-400 transition-colors py-2'
                >
                  <span className='text-green-500'>$</span> npm
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
