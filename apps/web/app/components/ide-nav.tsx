'use client';

import Link from 'next/link';
import { GitHubStars } from './github-stars';

export function IDENav() {
  return (
    <nav className='fixed top-0 w-full z-50 bg-[#000000] border-b border-white/10'>
      <div className='max-w-full mx-auto'>
        {/* Menu bar */}
        <div className='flex items-center h-7 px-2 sm:px-4 bg-[#0a0a0a] border-b border-white/10 text-[10px] sm:text-xs text-white/80 font-mono overflow-x-auto'>
          <div className='flex items-center gap-2 sm:gap-4'>
            <span className='hover:text-white cursor-pointer transition-colors whitespace-nowrap'>
              {'>'} File
            </span>
            <span className='hover:text-white cursor-pointer transition-colors whitespace-nowrap'>
              {'>'} Edit
            </span>
            <span className='hover:text-white cursor-pointer transition-colors whitespace-nowrap'>
              {'>'} View
            </span>
            <span className='hidden sm:inline hover:text-white cursor-pointer transition-colors whitespace-nowrap'>
              {'>'} Terminal
            </span>
            <span className='hidden md:inline hover:text-white cursor-pointer transition-colors whitespace-nowrap'>
              {'>'} Help
            </span>
          </div>
          <div className='ml-auto flex items-center gap-2 sm:gap-4'>
            <Link
              href='/docs'
              className='hover:text-white transition-colors whitespace-nowrap'
            >
              {'>'} docs
            </Link>
            <GitHubStars showInNav />
            <a
              href='https://www.npmjs.com/package/snapwyr'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-white transition-colors whitespace-nowrap'
            >
              {'>'} npm
            </a>
          </div>
        </div>
        {/* Title bar */}
        <div className='flex items-center h-10 px-2 sm:px-4 bg-[#000000]'>
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <div className='w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]' />
            <div className='w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]' />
            <div className='w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]' />
          </div>
          <div className='ml-2 sm:ml-4 text-xs sm:text-sm text-white font-mono'>
            {'>'} snapwyr
          </div>
          <div className='ml-auto text-[10px] sm:text-xs text-white/40 font-mono hidden sm:block'>
            Zero-config HTTP logger
          </div>
        </div>
      </div>
    </nav>
  );
}
