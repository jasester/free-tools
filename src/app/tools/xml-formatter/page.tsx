'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * XML 排序、压缩、格式化工具页面
 */
export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  /**
   * 格式化 XML
   */
  const formatXML = (xml: string, indent = 2): string => {
    const PADDING = ' '.repeat(indent);
    let formatted = '';
    let pad = 0;

    // 标准化换行
    xml = xml.replace(/(>)(<)(\/*)/g, '$1\n$2$3');

    xml.split('\n').forEach(node => {
      node = node.trim();
      if (!node) return;

      // 减少缩进
      if (node.match(/^<\/\w/)) pad = Math.max(0, pad - 1);

      formatted += PADDING.repeat(pad) + node + '\n';

      // 增加缩进
      if (node.match(/^<\w[^>]*[^/]>.*$/)) pad++;
    });

    return formatted.trim();
  };

  /**
   * 压缩 XML
   */
  const minifyXML = (xml: string): string => {
    return xml
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/gm, '')
      .trim();
  };

  /**
   * 排序 XML 节点（按标签名字母排序）
   */
  const sortXML = (xml: string): string => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');

      const parseError = doc.querySelector('parsererror');
      if (parseError) throw new Error('Invalid XML');

      /**
       * 递归排序子节点
       */
      const sortChildren = (parent: Element) => {
        const children = Array.from(parent.children);
        if (children.length <= 1) {
          children.forEach(sortChildren);
          return;
        }

        children.sort((a, b) => a.tagName.localeCompare(b.tagName));
        children.forEach(child => {
          sortChildren(child);
          parent.appendChild(child);
        });
      };

      if (doc.documentElement) {
        sortChildren(doc.documentElement);
      }

      const serializer = new XMLSerializer();
      return formatXML(serializer.serializeToString(doc));
    } catch (e) {
      throw new Error('Invalid XML format. Please check your input.');
    }
  };

  const handleAction = (action: 'format' | 'minify' | 'sort') => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }

    try {
      switch (action) {
        case 'format': setOutput(formatXML(input)); break;
        case 'minify': setOutput(minifyXML(input)); break;
        case 'sort': setOutput(sortXML(input)); break;
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error processing XML');
      setOutput('');
    }
  };

  const copyToClipboard = () => { if (output) navigator.clipboard.writeText(output); };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-light-900 dark:text-dark-50">XML Formatter & Sorter</h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">Format, minify and sort XML nodes instantly.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_XML_1" format="horizontal" />

        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Input XML</label>
              <button onClick={() => setInput('')} className="text-xs text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100">Clear</button>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="input-dark h-64 w-full resize-none rounded-lg p-3 font-mono text-sm text-light-900 dark:text-dark-50" placeholder="Paste your XML here..." />
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Output</label>
              <button onClick={copyToClipboard} disabled={!output} className="text-xs text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100 disabled:opacity-50">Copy</button>
            </div>
            <textarea value={output} readOnly className="input-dark h-64 w-full resize-none rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 font-mono text-sm text-light-900 dark:text-dark-50" placeholder="Result will appear here..." />
          </div>
        </div>

        {error && <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

        <div className="mt-6 flex flex-wrap gap-3 animate-fade-in-up">
          <button onClick={() => handleAction('format')} className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium">Format</button>
          <button onClick={() => handleAction('minify')} className="btn-ghost rounded-lg px-6 py-2.5 text-sm font-medium">Minify</button>
          <button onClick={() => handleAction('sort')} className="btn-ghost rounded-lg px-6 py-2.5 text-sm font-medium">Sort Nodes</button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_XML_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-light-900 dark:text-dark-50">About XML Formatter</h2>
          <p className="text-sm leading-relaxed text-light-500 dark:text-dark-200">Format, minify and sort XML nodes alphabetically. Useful for comparing XML files and cleaning up messy XML data.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
