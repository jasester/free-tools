import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator - Free Online QR Code Maker',
  description: 'Generate QR codes from text or URLs for free.',
  keywords: ['qr code generator', 'qr code maker', 'create qr code'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
