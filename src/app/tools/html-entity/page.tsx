'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/** HTML Entity 编码映射表 */
const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/** HTML Entity 解码正则表达式，匹配 &...; 格式 */
const HTML_ENTITY_REGEX = /&(?:#(\d+)|#x([\da-fA-F]+)|([a-zA-Z]+));/g;

/**
 * 将文本中的特殊字符编码为 HTML Entity
 * @param text - 待编码的原始文本
 * @returns 编码后的 HTML Entity 字符串
 */
function encodeHtmlEntities(text: string): string {
  return text.replace(/[&<>"'`=\/]/g, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * 将 HTML Entity 解码回原始字符
 * @param text - 包含 HTML Entity 的文本
 * @returns 解码后的原始文本
 */
function decodeHtmlEntities(text: string): string {
  return text.replace(HTML_ENTITY_REGEX, (match, decimal, hex, named) => {
    if (decimal) {
      return String.fromCharCode(parseInt(decimal, 10));
    }
    if (hex) {
      return String.fromCharCode(parseInt(hex, 16));
    }
    if (named) {
      // 反向查找命名实体
      const entry = Object.entries(HTML_ENTITY_MAP).find(
        ([, value]) => value === match
      );
      return entry ? entry[0] : match;
    }
    return match;
  });
}

/** 常用特殊字符参考列表 */
const REFERENCE_CHARS = [
  { char: '&', entity: '&amp;', desc: 'Ampersand' },
  { char: '<', entity: '&lt;', desc: 'Less than' },
  { char: '>', entity: '&gt;', desc: 'Greater than' },
  { char: '"', entity: '&quot;', desc: 'Double quote' },
  { char: "'", entity: '&#39;', desc: 'Single quote' },
  { char: '/', entity: '&#x2F;', desc: 'Forward slash' },
  { char: ' ', entity: '&nbsp;', desc: 'Non-breaking space' },
  { char: '\u00A9', entity: '&copy;', desc: 'Copyright' },
  { char: '\u00AE', entity: '&reg;', desc: 'Registered' },
  { char: '\u2122', entity: '&trade;', desc: 'Trademark' },
];

/**
 * HTML Entity 编码/解码工具页面组件
 * 支持特殊字符与 HTML Entity 之间的双向转换
 */
export default function HtmlEntity() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  /** 将输入文本编码为 HTML Entity */
  const encode = () => {
    setError('');
    try {
      setOutput(encodeHtmlEntities(input));
    } catch {
      setError('Failed to encode the input text');
    }
  };

  /** 将输入的 HTML Entity 解码为原始文本 */
  const decode = () => {
    setError('');
    try {
      setOutput(decodeHtmlEntities(input));
    } catch {
      setError('Failed to decode the input text');
    }
  };

  /** 清空输入和输出 */
  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  /** 交换输入输出内容 */
  const swap = () => {
    setInput(output);
    setOutput('');
    setError('');
  };

  /** 复制输出到剪贴板 */
  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="font-display mb-2 text-2xl font-bold text-light-900 dark:text-dark-50">
            HTML Entity Encoder / Decoder
          </h1>
          <p className="mb-6 text-sm text-light-500 dark:text-dark-200">
            Convert special characters to HTML entities and back. Prevent XSS and fix encoding issues.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_21" format="horizontal" />

        {/* 输入输出区域 */}
        <div className="mt-6 grid animate-fade-in-up gap-4 lg:grid-cols-2">
          {/* 输入区域 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Input</label>
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
              placeholder="Enter text or HTML entities..."
            />
          </div>

          {/* 输出区域 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Output</label>
              {output && (
                <button
                  onClick={copyOutput}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Copy
                </button>
              )}
            </div>
            {error ? (
              <div className="h-60 w-full rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-mono text-sm text-red-400">
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                className="input-dark h-60 w-full rounded-lg bg-gray-100 dark:bg-dark-600 p-3 font-mono text-sm"
                placeholder="Result will appear here..."
              />
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={encode}
            className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
          >
            Encode
          </button>
          <button
            onClick={decode}
            className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
          >
            Decode
          </button>
          <button
            onClick={clear}
            className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-medium text-light-700 dark:text-dark-100 transition"
          >
            Clear
          </button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_22" />

        {/* 参考表格 */}
        <section className="mt-10 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-display mb-4 text-lg font-semibold text-light-900 dark:text-dark-50">
              Common HTML Entities Reference
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300/50 dark:border-dark-300/50">
                    <th className="pb-2 text-left font-medium text-light-700 dark:text-dark-100">Character</th>
                    <th className="pb-2 text-left font-medium text-light-700 dark:text-dark-100">Entity</th>
                    <th className="pb-2 text-left font-medium text-light-700 dark:text-dark-100">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {REFERENCE_CHARS.map((item) => (
                    <tr key={item.entity} className="border-b border-gray-300/20 dark:border-dark-300/20">
                      <td className="py-2 font-mono text-light-900 dark:text-dark-50">{item.char === ' ' ? '(space)' : item.char}</td>
                      <td className="py-2 font-mono text-blue-400">{item.entity}</td>
                      <td className="py-2 text-light-500 dark:text-dark-200">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 说明区域 */}
        <section className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-display mb-2 text-lg font-semibold text-light-900 dark:text-dark-50">
              About HTML Entities
            </h2>
            <p className="text-sm leading-relaxed text-light-500 dark:text-dark-200">
              HTML entities are used to display reserved characters in HTML that would
              otherwise be interpreted as HTML code. For example, &lt; displays a less-than
              sign instead of starting an HTML tag. Encoding user input is a key defense
              against XSS (Cross-Site Scripting) attacks. All processing happens locally
              in your browser.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
