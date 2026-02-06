'use client';

import Link from 'next/link';
import { GitHubStars } from './github-stars';

export function IDEFooter() {
  return (
    <footer className='py-6 sm:py-8 px-3 sm:px-4 md:px-6 lg:px-8 border-t border-white/10 bg-[#000000]'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4'>
          <div className='text-white/60 text-[10px] sm:text-xs font-mono text-center md:text-left'>
            {'>'} © {new Date().getFullYear()} SnapWyr. Licensed under AGPL-3.0
          </div>
          <div className='flex items-center gap-4 sm:gap-6'>
            <Link
              href='/docs'
              className='text-[10px] sm:text-xs text-white/60 hover:text-white transition-colors font-mono'
            >
              {'>'} docs
            </Link>
            <GitHubStars />
            <a
              href='https://www.npmjs.com/package/snapwyr'
              target='_blank'
              rel='noopener noreferrer'
              className='text-[10px] sm:text-xs text-white/60 hover:text-white transition-colors font-mono'
            >
              {'>'} npm
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
