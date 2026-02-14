import { NextResponse } from 'next/server';
import { getDocsContent } from '@/lib/docs-content';

const BASE_URL = 'https://snapwyr.xyz';

export function GET() {
  const docs = getDocsContent(BASE_URL);

  const lines: string[] = [
    '# SnapWyr',
    '',
    'Zero-config HTTP request logger for Node.js with a real-time web dashboard.',
    '',
    '## Overview',
    '',
    'SnapWyr automatically intercepts and logs HTTP requests (fetch, axios) with beautiful console output and a live web UI. Supports Express, Fastify, Koa, Hono, NestJS, and Next.js.',
    '',
    '## Key Links',
    '',
    `> Homepage: ${BASE_URL}`,
    `> Documentation: ${BASE_URL}/docs`,
    `> Getting Started: ${BASE_URL}/docs/getting-started/introduction`,
    `> Installation: ${BASE_URL}/docs/getting-started/installation`,
    `> npm: https://www.npmjs.com/package/snapwyr`,
    `> GitHub: https://github.com/emmanueltaiwo/snapwyr`,
    '',
    '## Documentation Index',
    '',
    ...docs.map(
      (p) =>
        `> ${p.title}: ${BASE_URL}/docs/${p.slug}${p.description ? ` - ${p.description}` : ''}`
    ),
    '',
    '## Full Context',
    '',
    `For complete documentation with full page content, see: ${BASE_URL}/llms-full.txt`,
    '',
  ];

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
