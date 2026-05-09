import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timestamp Converter - Unix Timestamp to Date Converter',
  description: 'Convert between Unix timestamps and human-readable dates instantly.',
  keywords: ['timestamp converter', 'unix timestamp', 'epoch converter'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
