'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * Base64 编码/解码工具页面组件
 * 支持文本编码为 Base64、Base64 解码为文本，以及交换输入输出
 */
export default function Base64() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  /** 将输入文本编码为 Base64 字符串 */
  const encode = () => {
    setError('');
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setMode('encode');
    } catch {
      setError('Failed to encode');
    }
  };

  /** 将输入的 Base64 字符串解码为文本 */
  const decode = () => {
    setError('');
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setMode('decode');
    } catch {
      setError('Invalid Base64 string');
    }
  };

  /** 清空输入、输出和错误信息 */
  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  /** 交换输入输出内容，并切换编码/解码模式 */
  const swap = () => {
    setInput(output);
    setOutput('');
    setError('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-2 animate-fade-in-up font-display text-2xl font-bold text-dark-50">
          Base64 Encoder / Decoder
        </h1>
        <p className="mb-6 animate-fade-in-up text-dark-200">
          Encode text to Base64 or decode Base64 to text instantly online.
        </p>

        <AdCard slot="YOUR_AD_SLOT_15" format="horizontal" />

        <div className="mt-6 grid animate-fade-in-up gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">
                {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
              </label>
              <button
                onClick={swap}
                className="text-xs text-blue-400 hover:underline"
              >
                Swap &harr;
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-dark h-60 w-full rounded-lg p-3 font-mono text-sm"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-100">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </label>
            {error ? (
              <div className="h-60 w-full rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-mono text-sm text-red-400">
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                className="input-dark h-60 w-full rounded-lg bg-dark-600 p-3 font-mono text-sm"
                placeholder="Result will appear here..."
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={encode}
            className={`btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition ${mode === 'encode' ? '' : 'opacity-50'}`}
          >
            Encode
          </button>
          <button
            onClick={decode}
            className={`btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition ${mode === 'decode' ? '' : 'opacity-50'}`}
          >
            Decode
          </button>
          <button
            onClick={clear}
            className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-medium text-dark-100 transition"
          >
            Clear
          </button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_16" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-dark-50">
            About Base64
          </h2>
          <p className="text-sm leading-relaxed text-dark-200">
            Base64 is a binary-to-text encoding scheme that represents binary data in
            an ASCII string format. It is commonly used for data transmission, email
            attachments, embedding images in HTML/CSS, and API authentication tokens.
            All processing happens in your browser.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
