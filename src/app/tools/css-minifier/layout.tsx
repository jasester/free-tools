import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Minifier & Formatter - Free Online CSS Tool',
  description: 'Minify or format CSS code instantly.',
  keywords: ['css minifier', 'css formatter', 'css beautifier', 'minify css'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
