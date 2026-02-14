import type { MetadataRoute } from 'next';
import { getDocsContent } from '@/lib/docs-content';

const BASE_URL = 'https://snapwyr.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getDocsContent(BASE_URL);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const docPages: MetadataRoute.Sitemap = docs.map((page) => ({
    url: `${BASE_URL}/docs/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...docPages];
}
