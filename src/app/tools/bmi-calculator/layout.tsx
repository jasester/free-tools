import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI Calculator - Free Body Mass Index Calculator',
  description: 'Calculate your Body Mass Index (BMI) for free.',
  keywords: ['bmi calculator', 'body mass index', 'bmi checker'],
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
