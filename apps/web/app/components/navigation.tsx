'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { GitHubStars } from './github-stars';
import { useState } from 'react';
import Image from 'next/image';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href='/' className='flex items-center'>
              <Image
                src='/logo-full-white.png'
                alt='snapwyr'
                width={120}
                height={40}
                className='h-8 w-auto'
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className='hidden sm:flex items-center gap-6'
          >
            <Link
              href='/docs'
              className='text-sm text-white/60 hover:text-white transition-colors duration-200'
            >
              Docs
            </Link>
            <GitHubStars showInNav />
            <a
              href='https://www.npmjs.com/package/snapwyr'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-white/60 hover:text-white transition-colors duration-200'
            >
              npm
            </a>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='sm:hidden flex flex-col gap-1.5 p-2'
            aria-label='Toggle menu'
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className='w-5 h-px bg-white block'
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className='w-5 h-px bg-white block'
            />
            <motion.span
              animate={
                isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className='w-5 h-px bg-white block'
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='sm:hidden border-t border-white/10 overflow-hidden'
          >
            <div className='py-4 space-y-3'>
              <Link
                href='/docs'
                onClick={() => setIsMenuOpen(false)}
                className='block text-sm text-white/60 hover:text-white transition-colors py-2'
              >
                Docs
              </Link>
              <a
                href='https://github.com/emmanueltaiwo/snapwyr'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-sm text-white/60 hover:text-white transition-colors py-2'
              >
                GitHub
              </a>
              <a
                href='https://www.npmjs.com/package/snapwyr'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-sm text-white/60 hover:text-white transition-colors py-2'
              >
                npm
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
