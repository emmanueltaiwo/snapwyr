import type { MetadataRoute } from 'next';

const BASE_URL = 'https://snapwyr.xyz';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SnapWyr',
    short_name: 'SnapWyr',
    description:
      'Zero-config HTTP request logger for Node.js with real-time web dashboard. Log incoming and outgoing requests with beautiful console output.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0d0d',
    theme_color: '#0d0d0d',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/og.png',
        sizes: '1200x630',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['developer tools', 'utilities'],
    lang: 'en',
    scope: '/',
  };
}
