'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 进制转换器工具页面
 * 支持二进制、八进制、十进制、十六进制之间的实时转换
 */
export default function NumberBaseConverter() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<number>(10);
  const [copied, setCopied] = useState<string | null>(null);

  const bases = [
    { value: 2, label: 'Binary (2)', prefix: '0b' },
    { value: 8, label: 'Octal (8)', prefix: '0o' },
    { value: 10, label: 'Decimal (10)', prefix: '' },
    { value: 16, label: 'Hexadecimal (16)', prefix: '0x' },
  ];

  /**
   * 将输入值从源进制转换为指定进制
   * @param value - 输入值
   * @param base - 目标进制
   * @returns 转换后的字符串
   */
  const convertToBase = (value: string, base: number): string => {
    if (!value.trim()) return '';
    try {
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) return 'Invalid';
      return decimal.toString(base).toUpperCase();
    } catch {
      return 'Invalid';
    }
  };

  /**
   * 复制文本到剪贴板
   * @param text - 要复制的文本
   * @param label - 标签用于显示复制状态
   */
  const copyToClipboard = (text: string, label: string) => {
    if (text && text !== 'Invalid') {
      navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  /** 清空所有输入 */
  const clearAll = () => {
    setInput('');
    setCopied(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            Number Base Converter
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Convert between Binary, Octal, Decimal, and Hexadecimal instantly.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_BASE_1" format="horizontal" />

        {/* 输入区域 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">
                Input Number
              </label>
              <div className="flex gap-3">
                <select
                  value={fromBase}
                  onChange={(e) => setFromBase(parseInt(e.target.value))}
                  className="input-dark rounded-lg px-4 py-3 text-sm"
                >
                  {bases.map((base) => (
                    <option key={base.value} value={base.value}>
                      {base.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input-dark flex-1 rounded-lg p-3 font-mono text-lg text-light-900 dark:text-dark-50"
                  placeholder={`Enter ${fromBase === 2 ? 'binary' : fromBase === 8 ? 'octal' : fromBase === 16 ? 'hexadecimal' : 'decimal'} number...`}
                />
                <button
                  onClick={clearAll}
                  className="btn-ghost rounded-lg px-5 py-3 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 转换结果 */}
        <div className="mt-6 grid gap-4 animate-fade-in-up lg:grid-cols-2">
          {bases.map((base) => {
            const result = convertToBase(input, base.value);
            return (
              <div key={base.value} className="glass-card rounded-xl p-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-light-700 dark:text-dark-100">
                    {base.label}
                  </label>
                  {base.prefix && (
                    <span className="text-xs text-light-500 dark:text-dark-200">{base.prefix}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result}
                    className="input-dark flex-1 rounded-lg bg-gray-100 dark:bg-dark-600 p-3 font-mono text-sm text-light-900 dark:text-dark-50"
                  />
                  <button
                    onClick={() => copyToClipboard(result, base.label)}
                    className="btn-gradient rounded-lg px-4 py-2 text-sm font-medium"
                  >
                    {copied === base.label ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <AdCard slot="YOUR_AD_SLOT_BASE_2" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            About Number Bases
          </h2>
          <div className="space-y-2 text-sm text-light-500 dark:text-dark-200">
            <p>
              <strong className="text-light-700 dark:text-dark-100">Binary (Base 2):</strong> Uses digits 0-1. Fundamental for computer systems.
            </p>
            <p>
              <strong className="text-light-700 dark:text-dark-100">Octal (Base 8):</strong> Uses digits 0-7. Common in Unix file permissions.
            </p>
            <p>
              <strong className="text-light-700 dark:text-dark-100">Decimal (Base 10):</strong> Uses digits 0-9. Standard number system for everyday use.
            </p>
            <p>
              <strong className="text-light-700 dark:text-dark-100">Hexadecimal (Base 16):</strong> Uses digits 0-9 and letters A-F. Widely used in programming and color codes.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
