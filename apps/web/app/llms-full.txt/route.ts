import { NextResponse } from 'next/server';
import { getDocsContent } from '@/lib/docs-content';

const BASE_URL = 'https://snapwyr.xyz';

export function GET() {
  const docs = getDocsContent(BASE_URL);

  const sections: string[] = [
    '# SnapWyr - Full Documentation Context',
    '',
    'Zero-config HTTP request logger for Node.js with a real-time web dashboard.',
    'Log incoming and outgoing HTTP requests with beautiful console output and a live web UI.',
    '',
    '## Key Links',
    '',
    `Homepage: ${BASE_URL}`,
    `Documentation: ${BASE_URL}/docs`,
    `npm: https://www.npmjs.com/package/snapwyr`,
    `GitHub: https://github.com/emmanueltaiwo/snapwyr`,
    '',
    '---',
    '',
  ];

  for (const page of docs) {
    const pageUrl = `${BASE_URL}/docs/${page.slug}`;
    sections.push(`## ${page.title}`);
    sections.push('');
    sections.push(`URL: ${pageUrl}`);
    if (page.description) {
      sections.push(`Description: ${page.description}`);
      sections.push('');
    }
    sections.push('### Content');
    sections.push('');
    sections.push(page.body);
    sections.push('');
    sections.push('---');
    sections.push('');
  }

  return new NextResponse(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
