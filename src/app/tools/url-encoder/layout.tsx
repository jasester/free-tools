import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder - Free Online URL Encoding Tool',
  description: 'Encode or decode URL strings instantly.',
  keywords: ['url encoder', 'url decoder', 'url encoding'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
