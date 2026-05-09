import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Formatter - Free Online JSON Validator & Beautifier',
  description: 'Free online JSON formatter to beautify, validate and minify JSON data.',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'online json tool', 'json parser'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
