'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 文本处理器工具页面
 * 支持按行去重、按字母排序、反转、随机打乱等文本处理功能
 */
export default function TextProcessor() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  /**
   * 复制输出到剪贴板
   */
  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /** 清空输入输出 */
  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  /**
   * 按行去重
   * 保留首次出现的行，去除重复行
   */
  const removeDuplicates = () => {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];

    for (const line of lines) {
      if (!seen.has(line)) {
        seen.add(line);
        result.push(line);
      }
    }

    setOutput(result.join('\n'));
  };

  /**
   * 按字母排序（升序）
   */
  const sortAscending = () => {
    const lines = input.split('\n');
    setOutput(lines.sort((a, b) => a.localeCompare(b)).join('\n'));
  };

  /**
   * 按字母排序（降序）
   */
  const sortDescending = () => {
    const lines = input.split('\n');
    setOutput(lines.sort((a, b) => b.localeCompare(a)).join('\n'));
  };

  /**
   * 按行长度排序（短到长）
   */
  const sortByLengthAsc = () => {
    const lines = input.split('\n');
    setOutput(lines.sort((a, b) => a.length - b.length).join('\n'));
  };

  /**
   * 按行长度排序（长到短）
   */
  const sortByLengthDesc = () => {
    const lines = input.split('\n');
    setOutput(lines.sort((a, b) => b.length - a.length).join('\n'));
  };

  /**
   * 反转文本
   */
  const reverseText = () => {
    setOutput(input.split('').reverse().join(''));
  };

  /**
   * 反转行顺序
   */
  const reverseLines = () => {
    const lines = input.split('\n');
    setOutput(lines.reverse().join('\n'));
  };

  /**
   * 随机打乱行顺序
   */
  const shuffleLines = () => {
    const lines = input.split('\n');
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setOutput(lines.join('\n'));
  };

  /**
   * 去除空行
   */
  const removeEmptyLines = () => {
    const lines = input.split('\n');
    setOutput(lines.filter((line) => line.trim() !== '').join('\n'));
  };

  /**
   * 去除行首行尾空白
   */
  const trimLines = () => {
    const lines = input.split('\n');
    setOutput(lines.map((line) => line.trim()).join('\n'));
  };

  /**
   * 转换为大写
   */
  const toUpperCase = () => {
    setOutput(input.toUpperCase());
  };

  /**
   * 转换为小写
   */
  const toLowerCase = () => {
    setOutput(input.toLowerCase());
  };

  const operations = [
    { label: 'Remove Duplicates', action: removeDuplicates },
    { label: 'Sort A-Z', action: sortAscending },
    { label: 'Sort Z-A', action: sortDescending },
    { label: 'Sort by Length (Short-Long)', action: sortByLengthAsc },
    { label: 'Sort by Length (Long-Short)', action: sortByLengthDesc },
    { label: 'Reverse Text', action: reverseText },
    { label: 'Reverse Lines', action: reverseLines },
    { label: 'Shuffle Lines', action: shuffleLines },
    { label: 'Remove Empty Lines', action: removeEmptyLines },
    { label: 'Trim Lines', action: trimLines },
    { label: 'UPPERCASE', action: toUpperCase },
    { label: 'lowercase', action: toLowerCase },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-dark-50">
            Text Processor
          </h1>
          <p className="mb-6 text-dark-200">
            Remove duplicates, sort lines, reverse text, shuffle, and more text operations.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_TEXT_1" format="horizontal" />

        {/* 输入输出区域 */}
        <div className="mt-6 grid animate-fade-in-up gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">Input Text</label>
              <button
                onClick={clearAll}
                className="text-xs text-dark-200 hover:text-dark-50"
              >
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-dark h-64 w-full rounded-lg p-4 font-mono text-sm text-dark-50"
              placeholder="Enter text here, one item per line..."
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">Output</label>
              <button
                onClick={copyOutput}
                className="text-xs text-blue-400 hover:underline"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              className="input-dark h-64 w-full rounded-lg bg-dark-600 p-4 font-mono text-sm text-dark-50"
              placeholder="Result will appear here..."
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <h3 className="mb-3 text-sm font-medium text-dark-100">Operations</h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {operations.map((op) => (
                <button
                  key={op.label}
                  onClick={op.action}
                  className="btn-ghost rounded-lg px-4 py-2.5 text-sm font-medium transition hover:bg-dark-500"
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_TEXT_2" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-dark-50">
            Text Operations Guide
          </h2>
          <div className="grid gap-4 text-sm text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-1">
                <strong className="text-dark-100">Remove Duplicates:</strong> Keeps only the first occurrence of each line
              </p>
              <p className="mb-1">
                <strong className="text-dark-100">Sort A-Z / Z-A:</strong> Alphabetical sorting in ascending or descending order
              </p>
              <p className="mb-1">
                <strong className="text-dark-100">Sort by Length:</strong> Sort lines by character count
              </p>
            </div>
            <div>
              <p className="mb-1">
                <strong className="text-dark-100">Reverse Text:</strong> Reverse the entire text character by character
              </p>
              <p className="mb-1">
                <strong className="text-dark-100">Shuffle Lines:</strong> Randomly reorder all lines
              </p>
              <p className="mb-1">
                <strong className="text-dark-100">Trim Lines:</strong> Remove leading and trailing whitespace from each line
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
