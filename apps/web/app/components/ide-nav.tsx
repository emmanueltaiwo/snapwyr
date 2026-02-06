'use client';

import Link from 'next/link';
import { GitHubStars } from './github-stars';

export function IDENav() {
  return (
    <nav className='fixed top-0 w-full z-50 bg-[#181818] border-b border-white/5'>
      <div className='max-w-full mx-auto'>
        {/* Menu bar */}
        <div className='flex items-center h-7 px-4 bg-[#2d2d30] border-b border-white/5 text-xs text-white/70 font-mono'>
          <div className='flex items-center gap-4'>
            <span className='hover:text-white cursor-pointer transition-colors'>
              File
            </span>
            <span className='hover:text-white cursor-pointer transition-colors'>
              Edit
            </span>
            <span className='hover:text-white cursor-pointer transition-colors'>
              View
            </span>
            <span className='hover:text-white cursor-pointer transition-colors'>
              Terminal
            </span>
            <span className='hover:text-white cursor-pointer transition-colors'>
              Help
            </span>
          </div>
          <div className='ml-auto flex items-center gap-4'>
            <Link href='/docs' className='hover:text-white transition-colors'>
              docs
            </Link>
            <GitHubStars showInNav />
            <a
              href='https://www.npmjs.com/package/snapwyr'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-white transition-colors'
            >
              npm
            </a>
          </div>
        </div>
        {/* Title bar */}
        <div className='flex items-center h-10 px-4 bg-[#181818]'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-[#ff5f56]' />
            <div className='w-3 h-3 rounded-full bg-[#ffbd2e]' />
            <div className='w-3 h-3 rounded-full bg-[#27c93f]' />
          </div>
          <div className='ml-4 text-sm text-white/60 font-mono'>snapwyr</div>
          <div className='ml-auto text-xs text-white/30 font-mono'>
            Zero-config HTTP logger
          </div>
        </div>
      </div>
    </nav>
  );
}
