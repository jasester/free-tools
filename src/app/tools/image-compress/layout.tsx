import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor - Free Online Image Optimization Tool',
  description: 'Compress JPEG and PNG images online for free.',
  keywords: ['image compressor', 'compress jpg', 'compress png', 'image optimizer'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
