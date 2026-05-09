'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * JavaScript/HTML 压缩格式化工具页面
 * 支持压缩和格式化 JavaScript 和 HTML 代码
 */
export default function JsHtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'js' | 'html'>('js');
  const [action, setAction] = useState<'minify' | 'format'>('minify');
  const [error, setError] = useState('');

  /**
   * 压缩 JavaScript 代码
   */
  const minifyJS = (code: string): string => {
    return code
      .replace(/\/\/.*$/gm, '')           // 移除单行注释
      .replace(/\/\*[\s\S]*?\*\//g, '')    // 移除多行注释
      .replace(/\s*([\{\}\[\]\(\)\;\,\:\+\-\*\/\=\!\&\|\?\<\>])\s*/g, '$1') // 移除运算符周围空格
      .replace(/\s+/g, ' ')                // 合并多余空格
      .replace(/^\s+|\s+$/gm, '')          // 移除行首行尾空格
      .trim();
  };

  /**
   * 格式化 JavaScript 代码
   */
  const formatJS = (code: string): string => {
    let formatted = '';
    let indent = 0;
    const lines = code.replace(/\n/g, '').split(/([{}])/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed === '}') {
        indent = Math.max(0, indent - 1);
      }

      formatted += '  '.repeat(indent) + trimmed + '\n';

      if (trimmed === '{') {
        indent++;
      }
    }
    return formatted.trim();
  };

  /**
   * 压缩 HTML 代码
   */
  const minifyHTML = (code: string): string => {
    return code
      .replace(/<!--[\s\S]*?-->/g, '')      // 移除注释
      .replace(/>\s+</g, '><')               // 移除标签间空格
      .replace(/\s+/g, ' ')                  // 合并多余空格
      .replace(/^\s+|\s+$/gm, '')            // 移除行首行尾空格
      .trim();
  };

  /**
   * 格式化 HTML 代码
   */
  const formatHTML = (code: string): string => {
    let formatted = '';
    let indent = 0;
    const selfClosing = /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i;
    const closing = /^<\//;
    const opening = /^<[a-zA-Z]/;

    // 简单按标签分割
    const tokens = code.replace(/>\s*</g, '>\n<').split('\n');

    for (const token of tokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;

      if (closing.test(trimmed)) {
        indent = Math.max(0, indent - 1);
      }

      formatted += '  '.repeat(indent) + trimmed + '\n';

      if (opening.test(trimmed) && !selfClosing.test(trimmed) && !closing.test(trimmed) && !trimmed.endsWith('/>')) {
        indent++;
      }
    }
    return formatted.trim();
  };

  /**
   * 执行压缩或格式化
   */
  const handleProcess = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }

    try {
      if (mode === 'js') {
        setOutput(action === 'minify' ? minifyJS(input) : formatJS(input));
      } else {
        setOutput(action === 'minify' ? minifyHTML(input) : formatHTML(input));
      }
    } catch (e) {
      setError('Error processing code. Please check your input.');
      setOutput('');
    }
  };

  const copyToClipboard = () => { if (output) navigator.clipboard.writeText(output); };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-dark-50">JS/HTML Minifier & Formatter</h1>
          <p className="mb-6 text-dark-200">Minify or format JavaScript and HTML code instantly.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_JSH_1" format="horizontal" />

        {/* 模式切换 */}
        <div className="mt-6 flex flex-wrap gap-2 animate-fade-in-up">
          <div className="flex gap-1 rounded-lg bg-dark-600/50 p-1">
            <button onClick={() => setMode('js')} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${mode === 'js' ? 'btn-gradient text-white' : 'text-dark-200 hover:text-dark-50'}`}>JavaScript</button>
            <button onClick={() => setMode('html')} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${mode === 'html' ? 'btn-gradient text-white' : 'text-dark-200 hover:text-dark-50'}`}>HTML</button>
          </div>
          <div className="flex gap-1 rounded-lg bg-dark-600/50 p-1">
            <button onClick={() => setAction('minify')} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${action === 'minify' ? 'btn-gradient text-white' : 'text-dark-200 hover:text-dark-50'}`}>Minify</button>
            <button onClick={() => setAction('format')} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${action === 'format' ? 'btn-gradient text-white' : 'text-dark-200 hover:text-dark-50'}`}>Format</button>
          </div>
        </div>

        {/* 输入输出 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">Input ({mode === 'js' ? 'JavaScript' : 'HTML'})</label>
              <button onClick={() => setInput('')} className="text-xs text-dark-200 hover:text-dark-100">Clear</button>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="input-dark h-64 w-full resize-none rounded-lg p-3 font-mono text-sm text-dark-50" placeholder={`Paste your ${mode === 'js' ? 'JavaScript' : 'HTML'} code here...`} />
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">Output</label>
              <button onClick={copyToClipboard} disabled={!output} className="text-xs text-dark-200 hover:text-dark-100 disabled:opacity-50">Copy</button>
            </div>
            <textarea value={output} readOnly className="input-dark h-64 w-full resize-none rounded-lg bg-dark-600/50 p-3 font-mono text-sm text-dark-50" placeholder="Result will appear here..." />
          </div>
        </div>

        {error && <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

        <div className="mt-6 flex gap-3 animate-fade-in-up">
          <button onClick={handleProcess} className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium">{action === 'minify' ? 'Minify' : 'Format'}</button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_JSH_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-dark-50">About JS/HTML Minifier</h2>
          <p className="text-sm leading-relaxed text-dark-200">Minify JavaScript and HTML code to reduce file size for faster page loading. Format minified code for better readability.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
