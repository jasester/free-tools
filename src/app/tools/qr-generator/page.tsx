'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 二维码生成器页面
 * 支持将文本或 URL 转换为二维码图片并下载
 */
export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState('');

  /** 生成二维码图片 */
  const generate = async () => {
    setError('');
    if (!text.trim()) {
      setError('Please enter some text or URL');
      return;
    }
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: { dark: '#000', light: '#fff' },
      });
      setQrDataUrl(dataUrl);
    } catch {
      setError('Failed to generate QR code');
    }
  };

  /** 下载二维码图片为 PNG 文件 */
  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题区域 */}
        <div className="animate-fade-in-up">
          <h1 className="font-display mb-2 text-2xl font-bold text-light-900 dark:text-dark-50">
            QR Code Generator
          </h1>
          <p className="mb-6 text-sm text-light-500 dark:text-dark-200">
            Generate QR codes from text or URLs. Free online QR code maker.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_7" format="horizontal" />

        {/* 输入与生成区域 */}
        <div className="mt-6 max-w-lg animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-light-700 dark:text-dark-100">
                Text or URL
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input-dark h-24 w-full rounded-lg p-3 text-sm text-light-900 dark:text-dark-50 placeholder-dark-200"
                placeholder="https://example.com"
              />
            </div>

            {error && (
              <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={generate}
              className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
            >
              Generate QR Code
            </button>
          </div>
        </div>

        {/* 二维码展示与下载区域 */}
        {qrDataUrl && (
          <div className="mt-6 max-w-lg animate-fade-in-up">
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="inline-block rounded-lg bg-white p-4">
                <img src={qrDataUrl} alt="QR Code" className="mx-auto" />
              </div>
              <button
                onClick={download}
                className="btn-ghost mt-4 rounded-lg px-5 py-2.5 text-sm font-medium text-light-700 dark:text-dark-100 transition"
              >
                Download PNG
              </button>
            </div>
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_8" />

        {/* 关于说明区域 */}
        <section className="mt-10 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-display mb-2 text-lg font-semibold text-light-900 dark:text-dark-50">
              About QR Code Generator
            </h2>
            <p className="text-sm leading-relaxed text-light-500 dark:text-dark-200">
              QR codes can encode URLs, text, contact information, and more.
              This generator runs entirely in your browser. No server upload required.
              Use it for website links, WiFi passwords, social media, and business cards.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
