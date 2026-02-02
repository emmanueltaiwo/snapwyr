import { Navigation } from '@/app/components/navigation';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';

export default async function DocsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-black text-white'>
      <Navigation />
      <div className='mt-16'>
        <DocsLayout
          tree={source.getPageTree()}
          nav={{
            title: 'SnapWyr',
            url: '/',
          }}
        >
          {children}
        </DocsLayout>
      </div>
    </div>
  );
}
