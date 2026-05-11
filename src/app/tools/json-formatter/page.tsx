'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * JSON 格式化工具页面
 * 提供格式化、压缩和清空 JSON 数据的功能
 */
export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  /** 格式化 JSON 数据 */
  const format = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  /** 压缩 JSON 数据 */
  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  /** 清空输入输出和错误信息 */
  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-light-900 dark:text-dark-50">
            JSON Formatter
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Format, validate and beautify JSON data online.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_3" format="horizontal" />

        {/* 输入输出区域 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          {/* 输入区域 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-dark h-80 w-full rounded-lg p-3 font-mono text-sm text-light-900 dark:text-dark-50 placeholder-dark-200"
              placeholder='{"key": "value"}'
            />
          </div>
          {/* 输出区域 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
              Output
            </label>
            {error ? (
              <div className="h-80 w-full rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-mono text-sm text-red-400">
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                className="input-dark h-80 w-full rounded-lg bg-gray-100 dark:bg-dark-600 p-3 font-mono text-sm text-light-900 dark:text-dark-50 placeholder-dark-200 focus:outline-none"
                placeholder="Formatted JSON will appear here..."
              />
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 flex gap-3 animate-fade-in-up">
          <button
            onClick={format}
            className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
          >
            Format
          </button>
          <button
            onClick={minify}
            className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-medium text-light-700 dark:text-dark-100 transition"
          >
            Minify
          </button>
          <button
            onClick={clear}
            className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-medium text-light-700 dark:text-dark-100 transition"
          >
            Clear
          </button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_4" />

        {/* 关于说明卡片 */}
        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-light-900 dark:text-dark-50">
            About JSON Formatter
          </h2>
          <p className="text-sm leading-relaxed text-light-500 dark:text-dark-200">
            JSON (JavaScript Object Notation) is a lightweight data-interchange format.
            Use this free online JSON formatter to beautify, validate and minify JSON data.
            All processing happens in your browser - your data is never uploaded to any server.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
