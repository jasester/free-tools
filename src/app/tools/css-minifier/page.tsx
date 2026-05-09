'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * CSS 压缩格式化工具页面
 */
export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [action, setAction] = useState<'minify' | 'format'>('minify');
  const [error, setError] = useState('');

  /**
   * 压缩 CSS 代码
   */
  const minifyCSS = (code: string): string => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')     // 移除注释
      .replace(/\s*([\{\}\:\;\,])\s*/g, '$1') // 移除符号周围空格
      .replace(/\s+/g, ' ')                   // 合并多余空格
      .replace(/;\}/g, '}')                    // 移除最后一个分号
      .replace(/^\s+|\s+$/gm, '')             // 移除行首行尾空格
      .trim();
  };

  /**
   * 格式化 CSS 代码
   */
  const formatCSS = (code: string): string => {
    // 先压缩再格式化
    const minified = minifyCSS(code);
    let formatted = '';
    let indent = 0;

    // 按大括号分割
    const parts = minified.split(/([{}])/);

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed === '}') {
        indent = Math.max(0, indent - 1);
        formatted += '  '.repeat(indent) + trimmed + '\n';
      } else if (trimmed === '{') {
        formatted += ' {\n';
        indent++;
      } else {
        // 属性行：按分号分割
        const props = trimmed.split(';').filter(p => p.trim());
        for (const prop of props) {
          if (prop.trim()) {
            formatted += '  '.repeat(indent) + prop.trim() + ';\n';
          }
        }
      }
    }
    return formatted.trim();
  };

  const handleProcess = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      setOutput(action === 'minify' ? minifyCSS(input) : formatCSS(input));
    } catch (e) {
      setError('Error processing CSS. Please check your input.');
      setOutput('');
    }
  };

  const copyToClipboard = () => { if (output) navigator.clipboard.writeText(output); };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-dark-50">CSS Minifier & Formatter</h1>
          <p className="mb-6 text-dark-200">Minify or format CSS code instantly.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_CSS_1" format="horizontal" />

        <div className="mt-6 flex gap-1 rounded-lg bg-dark-600/50 p-1 w-fit animate-fade-in-up">
          <button onClick={() => setAction('minify')} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${action === 'minify' ? 'btn-gradient text-white' : 'text-dark-200 hover:text-dark-50'}`}>Minify</button>
          <button onClick={() => setAction('format')} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${action === 'format' ? 'btn-gradient text-white' : 'text-dark-200 hover:text-dark-50'}`}>Format</button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">Input CSS</label>
              <button onClick={() => setInput('')} className="text-xs text-dark-200 hover:text-dark-100">Clear</button>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="input-dark h-64 w-full resize-none rounded-lg p-3 font-mono text-sm text-dark-50" placeholder="Paste your CSS code here..." />
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

        <div className="mt-6 animate-fade-in-up">
          <button onClick={handleProcess} className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium">{action === 'minify' ? 'Minify' : 'Format'}</button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_CSS_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-dark-50">About CSS Minifier</h2>
          <p className="text-sm leading-relaxed text-dark-200">Minify CSS to reduce file size and improve page load times. Format minified CSS for better readability and maintenance.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
