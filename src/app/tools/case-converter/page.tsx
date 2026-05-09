'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 文本大小写转换工具页面
 * 支持多种文本格式转换：大写、小写、驼峰、帕斯卡、蛇形、短横线、常量等
 */
export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  /**
   * 复制文本到剪贴板
   * @param text - 要复制的文本
   * @param label - 标签用于显示复制状态
   */
  const copyToClipboard = (text: string, label: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  /** 清空输入 */
  const clearInput = () => {
    setInput('');
    setCopied(null);
  };

  /**
   * 转换为驼峰命名 (camelCase)
   * @param text - 输入文本
   * @returns 驼峰命名格式
   */
  const toCamelCase = (text: string): string => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[-_]/g, '');
  };

  /**
   * 转换为帕斯卡命名 (PascalCase)
   * @param text - 输入文本
   * @returns 帕斯卡命名格式
   */
  const toPascalCase = (text: string): string => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[-_]/g, '');
  };

  /**
   * 转换为蛇形命名 (snake_case)
   * @param text - 输入文本
   * @returns 蛇形命名格式
   */
  const toSnakeCase = (text: string): string => {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_')
      .replace(/^_+|_+$/g, '');
  };

  /**
   * 转换为短横线命名 (kebab-case)
   * @param text - 输入文本
   * @returns 短横线命名格式
   */
  const toKebabCase = (text: string): string => {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('-')
      .replace(/^-+|-+$/g, '');
  };

  /**
   * 转换为常量命名 (CONSTANT_CASE)
   * @param text - 输入文本
   * @returns 常量命名格式
   */
  const toConstantCase = (text: string): string => {
    return toSnakeCase(text).toUpperCase();
  };

  /**
   * 转换为标题格式 (Title Case)
   * @param text - 输入文本
   * @returns 标题格式
   */
  const toTitleCase = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  };

  /**
   * 转换为句子格式 (Sentence case)
   * @param text - 输入文本
   * @returns 句子格式
   */
  const toSentenceCase = (text: string): string => {
    return text.toLowerCase().replace(/(^\w|\.\s+\w)/g, (match) => match.toUpperCase());
  };

  const conversions = [
    { label: 'UPPER CASE', value: input.toUpperCase(), key: 'upper' },
    { label: 'lower case', value: input.toLowerCase(), key: 'lower' },
    { label: 'Title Case', value: toTitleCase(input), key: 'title' },
    { label: 'Sentence case', value: toSentenceCase(input), key: 'sentence' },
    { label: 'camelCase', value: toCamelCase(input), key: 'camel' },
    { label: 'PascalCase', value: toPascalCase(input), key: 'pascal' },
    { label: 'snake_case', value: toSnakeCase(input), key: 'snake' },
    { label: 'kebab-case', value: toKebabCase(input), key: 'kebab' },
    { label: 'CONSTANT_CASE', value: toConstantCase(input), key: 'constant' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-dark-50">
            Case Converter
          </h1>
          <p className="mb-6 text-dark-200">
            Convert text between different cases: Upper, Lower, Camel, Pascal, Snake, Kebab, and more.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_CASE_1" format="horizontal" />

        {/* 输入区域 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">Input Text</label>
              <button
                onClick={clearInput}
                className="text-xs text-dark-200 hover:text-dark-50"
              >
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-dark h-32 w-full rounded-lg p-4 text-dark-50"
              placeholder="Enter text to convert..."
            />
          </div>
        </div>

        {/* 转换结果 */}
        <div className="mt-6 grid gap-4 animate-fade-in-up md:grid-cols-2 lg:grid-cols-3">
          {conversions.map((conversion) => (
            <div key={conversion.key} className="glass-card rounded-xl p-4">
              <label className="mb-2 block text-xs font-medium text-dark-200">
                {conversion.label}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={conversion.value}
                  className="input-dark flex-1 rounded-lg bg-dark-600 p-2 font-mono text-sm text-dark-50"
                />
                <button
                  onClick={() => copyToClipboard(conversion.value, conversion.key)}
                  className="btn-gradient rounded-lg px-3 py-2 text-xs font-medium"
                >
                  {copied === conversion.key ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <AdCard slot="YOUR_AD_SLOT_CASE_2" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-dark-50">
            Case Types Explained
          </h2>
          <div className="grid gap-4 text-sm text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-1">
                <strong className="text-dark-100">camelCase:</strong> First word lowercase, subsequent words capitalized
              </p>
              <p className="mb-1">
                <strong className="text-dark-100">PascalCase:</strong> All words capitalized, no separators
              </p>
              <p className="mb-1">
                <strong className="text-dark-100">snake_case:</strong> Lowercase words separated by underscores
              </p>
            </div>
            <div>
              <p className="mb-1">
                <strong className="text-dark-100">kebab-case:</strong> Lowercase words separated by hyphens
              </p>
              <p className="mb-1">
                <strong className="text-dark-100">CONSTANT_CASE:</strong> Uppercase words separated by underscores
              </p>
              <p className="mb-1">
                <strong className="text-dark-100">Title Case:</strong> First letter of each word capitalized
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
