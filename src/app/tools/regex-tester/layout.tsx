import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regex Tester - Online Regular Expression Tester',
  description: 'Test and debug regular expressions online with real-time match highlighting.',
  keywords: ['regex tester', 'regular expression', 'regex online', 'test regex'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
