import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XML Formatter & Sorter - Free Online XML Tool',
  description: 'Format, minify and sort XML nodes instantly.',
  keywords: ['xml formatter', 'xml sorter', 'xml beautifier', 'xml minifier'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
