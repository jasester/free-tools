import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UserAgent Generator - Random UA String Generator',
  description: 'Generate random UserAgent strings for testing and development.',
  keywords: ['useragent generator', 'random user agent', 'ua generator', 'browser simulation'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
