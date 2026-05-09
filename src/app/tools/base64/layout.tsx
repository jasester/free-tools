import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder - Free Online Base64 Tool',
  description: 'Encode text to Base64 or decode Base64 to text instantly.',
  keywords: ['base64 encoder', 'base64 decoder', 'base64 online'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
