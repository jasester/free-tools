'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * URL 编码解码器工具页面
 * 支持 URL 编码和解码功能
 */
export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setError(mode === 'decode' ? 'Invalid URL encoded string' : 'Encoding error');
      setOutput('');
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setError('');
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-light-900 dark:text-dark-50">URL Encoder/Decoder</h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">Encode or decode URL strings instantly.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_URL_1" format="horizontal" />

        {/* 模式切换 */}
        <div className="mt-6 flex gap-2 animate-fade-in-up">
          <button
            onClick={() => setMode('encode')}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
              mode === 'encode'
                ? 'btn-gradient text-white'
                : 'btn-ghost text-light-700 dark:text-dark-100'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
              mode === 'decode'
                ? 'btn-gradient text-white'
                : 'btn-ghost text-light-700 dark:text-dark-100'
            }`}
          >
            Decode
          </button>
        </div>

        {/* 输入输出区域 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Input</label>
              <button onClick={() => setInput('')} className="text-xs text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100">Clear</button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-dark h-40 w-full resize-none rounded-lg p-3 font-mono text-sm text-light-900 dark:text-dark-50"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL encoded text...'}
            />
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Output</label>
              <button onClick={copyToClipboard} disabled={!output} className="text-xs text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100 disabled:opacity-50">Copy</button>
            </div>
            <textarea
              value={output}
              readOnly
              className="input-dark h-40 w-full resize-none rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 font-mono text-sm text-light-900 dark:text-dark-50"
              placeholder="Result will appear here..."
            />
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 animate-fade-in-up">
            {error}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-3 animate-fade-in-up">
          <button onClick={handleConvert} className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium">
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          <button onClick={handleSwap} disabled={!output} className="btn-ghost rounded-lg px-6 py-2.5 text-sm font-medium disabled:opacity-50">
            Swap
          </button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_URL_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-light-900 dark:text-dark-50">About URL Encoder/Decoder</h2>
          <p className="text-sm leading-relaxed text-light-500 dark:text-dark-200">URL encoding converts characters into a format that can be transmitted over the Internet. Useful for encoding special characters in URLs and form data.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
