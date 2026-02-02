'use client';

import { useEffect, useState } from 'react';

interface GitHubStats {
  stargazers_count?: number;
}

export function formatNumber(num: number | null): string {
  if (num === null) return '...';
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function GitHubStars({ showInNav = false }: { showInNav?: boolean }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/emmanueltaiwo/snapwyr')
      .then((res) => res.json())
      .then((data: GitHubStats) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // Fallback if API fails - don't set to 0, keep as null
      });
  }, []);

  const className = showInNav
    ? 'flex items-center gap-2 text-sm text-cyan-400 hover:text-green-400 transition-colors font-mono'
    : 'flex items-center gap-2 text-cyan-400 hover:text-green-400 transition-colors font-mono';

  return (
    <a
      href='https://github.com/emmanueltaiwo/snapwyr'
      target='_blank'
      rel='noopener noreferrer'
      className={className}
    >
      <span className='text-green-500'>$</span>{' '}
      {showInNav ? (
        <>
          git
          {stars !== null && (
            <span className='text-xs text-green-400 border border-green-500/50 px-1.5 py-0.5'>
              {formatNumber(stars)}
            </span>
          )}
        </>
      ) : (
        <>
          git clone
          {stars !== null && (
            <span className='text-xs text-green-400 border border-green-500/50 px-2 py-0.5'>
              {formatNumber(stars)} stars
            </span>
          )}
        </>
      )}
    </a>
  );
}
