import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JS/HTML Minifier & Formatter - Free Online Code Tool',
  description: 'Minify or format JavaScript and HTML code instantly.',
  keywords: ['js minifier', 'html minifier', 'javascript formatter', 'html formatter', 'code minify'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
