import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SQL Formatter - Free Online SQL Beautifier',
  description: 'Minify or format SQL queries instantly.',
  keywords: ['sql formatter', 'sql beautifier', 'sql minifier', 'format sql'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
