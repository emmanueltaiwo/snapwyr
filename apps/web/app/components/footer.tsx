'use client';

import Link from 'next/link';
import { GitHubStars } from './github-stars';

export function Footer() {
  return (
    <footer className='py-8 sm:py-12 px-3 sm:px-6 lg:px-8 border-t border-green-500/20 font-mono'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6'>
          <div className='text-green-400/70 text-xs sm:text-sm text-center md:text-left'>
            <p>
              <span className='text-green-500'>$</span> snapwyr --version
              {'\n'}
              <span className='text-gray-500'>[INFO]</span> ©{' '}
              {new Date().getFullYear()} SnapWyr. AGPL-3.0
            </p>
          </div>
          <div className='flex items-center gap-4 sm:gap-6 text-xs sm:text-sm'>
            <Link
              href='/docs'
              className='text-cyan-400 hover:text-green-400 transition-colors font-mono'
            >
              <span className='text-green-500'>$</span> docs
            </Link>
            <GitHubStars />
            <a
              href='https://www.npmjs.com/package/snapwyr'
              target='_blank'
              rel='noopener noreferrer'
              className='text-cyan-400 hover:text-green-400 transition-colors font-mono'
            >
              <span className='text-green-500'>$</span> npm
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
