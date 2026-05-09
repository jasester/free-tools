import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FreeOnlineTools - Free Online Tools for Everyone',
  description: 'Free online tools including JSON formatter, image compressor, QR code generator, timestamp converter, BMI calculator, regex tester, Base64 encoder/decoder and more.',
  keywords: 'free online tools, json formatter, image compressor, qr code generator, timestamp converter, bmi calculator, regex tester, base64 encoder',
  verification: {
    google: 'YOUR_GOOGLE_SITE_VERIFICATION',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:wght@300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grid-bg min-h-screen">
        {/* 顶部光晕装饰 */}
        <div className="page-glow" />
        {children}
      </body>
    </html>
  );
}
