'use client';

import { IDENav } from './components/ide-nav';
import { IDEHero } from './components/ide-hero';
import { IDEFeatures } from './components/ide-features';
import { IDEFrameworks } from './components/ide-frameworks';
import { IDEFooter } from './components/ide-footer';

export default function Home() {
  return (
    <div className='min-h-screen bg-[#0d0d0d] text-white antialiased'>
      <IDENav />
      <IDEHero />
      <IDEFeatures />
      <IDEFrameworks />
      <IDEFooter />
    </div>
  );
}
