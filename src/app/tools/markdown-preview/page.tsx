'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 简单的 Markdown 解析器
 */
const parseMarkdown = (md: string): string => {
  let html = md
    // 代码块
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-dark-600/50 p-3 rounded-lg overflow-auto my-2"><code>$1</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-dark-600/50 px-1.5 py-0.5 rounded text-sm">$1</code>')
    // 标题
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
    // 粗体和斜体
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent-blue hover:underline" target="_blank">$1</a>')
    // 图片
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2" />')
    // 无序列表
    .replace(/^\s*[-*+]\s+(.*$)/gim, '<li class="ml-4">$1</li>')
    // 有序列表
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
    // 引用
    .replace(/^>\s+(.*$)/gim, '<blockquote class="border-l-4 border-accent-blue pl-4 italic text-light-500 dark:text-dark-200 my-2">$1</blockquote>')
    // 分隔线
    .replace(/^---+$/gim, '<hr class="border-gray-400 dark:border-dark-600 my-4" />')
    // 段落
    .replace(/\n\n/g, '</p><p class="my-2">')
    // 换行
    .replace(/\n/g, '<br />');

  return `<div class="prose prose-invert max-w-none"><p class="my-2">${html}</p></div>`;
};

/**
 * Markdown 预览工具页面
 */
export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(`# Hello World

This is a **bold** text and this is *italic*.

## Features

- Simple and fast
- Live preview
- No external dependencies

\`\`\`javascript
const greeting = "Hello";
console.log(greeting);
\`\`\`

> This is a blockquote

[Visit GitHub](https://github.com)`);

  const copyHTML = () => {
    navigator.clipboard.writeText(parseMarkdown(markdown));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-light-900 dark:text-dark-50">Markdown Preview</h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">Live preview your Markdown with instant rendering.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_MD_1" format="horizontal" />

        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          {/* 编辑器 */}
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Markdown</label>
              <button onClick={() => setMarkdown('')} className="text-xs text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100">Clear</button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="input-dark h-96 w-full resize-none rounded-lg p-3 font-mono text-sm text-light-900 dark:text-dark-50"
              placeholder="Type your markdown here..."
            />
          </div>

          {/* 预览 */}
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Preview</label>
              <button onClick={copyHTML} className="text-xs text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100">Copy HTML</button>
            </div>
            <div
              className="h-96 overflow-auto rounded-lg bg-gray-50 dark:bg-dark-600/30 p-4 text-light-900 dark:text-dark-50"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
            />
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_MD_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-light-900 dark:text-dark-50">Markdown Syntax</h2>
          <div className="grid gap-4 text-sm text-light-500 dark:text-dark-200 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-light-700 dark:text-dark-100">Text Formatting</h3>
              <ul className="space-y-1">
                <li><code className="bg-gray-100 dark:bg-dark-600/50 px-1 rounded">**bold**</code> → <strong>bold</strong></li>
                <li><code className="bg-gray-100 dark:bg-dark-600/50 px-1 rounded">*italic*</code> → <em>italic</em></li>
                <li><code className="bg-gray-100 dark:bg-dark-600/50 px-1 rounded">`code`</code> → <code>code</code></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-light-700 dark:text-dark-100">Headers & Lists</h3>
              <ul className="space-y-1">
                <li><code className="bg-gray-100 dark:bg-dark-600/50 px-1 rounded"># H1</code> → Heading 1</li>
                <li><code className="bg-gray-100 dark:bg-dark-600/50 px-1 rounded">- item</code> → Bullet list</li>
                <li><code className="bg-gray-100 dark:bg-dark-600/50 px-1 rounded">1. item</code> → Numbered list</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
