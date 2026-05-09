'use client';

import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>FreeOnlineTools - Free Online Tools for Everyone</title>
        <meta name="description" content="Free online tools including JSON formatter, image compressor, QR code generator, timestamp converter, BMI calculator, regex tester, Base64 encoder/decoder and more." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:wght@300..800&display=swap"
          rel="stylesheet"
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2711442737753289"
          crossOrigin="anonymous"
        />
      </head>
      <body className="grid-bg min-h-screen">
        <ThemeProvider>
          {/* 顶部光晕装饰 */}
          <div className="page-glow" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
