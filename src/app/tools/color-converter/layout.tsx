import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Converter - HEX, RGB, HSL Color Converter',
  description: 'Convert between HEX, RGB and HSL color formats instantly.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hsl'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
