import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SnapWyr - Zero-config HTTP Request Logger for Node.js',
  description:
    'The first and only zero-config HTTP request logger that automatically intercepts fetch and axios requests. Perfect for debugging API calls in development.',
  keywords: [
    'HTTP logger',
    'request logger',
    'Node.js',
    'debugging',
    'API logger',
    'zero config',
    'fetch logger',
    'axios logger',
  ],
  authors: [{ name: 'Emmanuel Taiwo' }],
  creator: 'Emmanuel Taiwo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://snapwyr.dev',
    title: 'SnapWyr - Zero-config HTTP Request Logger for Node.js',
    description:
      'The first and only zero-config HTTP request logger that automatically intercepts fetch requests. Axios support requires passing your axios instance.',
    siteName: 'SnapWyr',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SnapWyr - Zero-config HTTP Request Logger for Node.js',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapWyr - Zero-config HTTP Request Logger for Node.js',
    description:
      'The first and only zero-config HTTP request logger that automatically intercepts fetch requests. Axios support requires passing your axios instance. Perfect for debugging API calls in development.',
    creator: '@ez0xai',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://snapwyr.dev'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistMono.variable} antialiased`}>
        <RootProvider
          theme={{
            forcedTheme: 'dark',
            enableSystem: false,
            defaultTheme: 'dark',
          }}
        >
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
