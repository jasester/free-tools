import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Generator - Strong Secure Password Generator',
  description: 'Generate strong, secure passwords with custom options.',
  keywords: ['password generator', 'strong password', 'secure password'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
