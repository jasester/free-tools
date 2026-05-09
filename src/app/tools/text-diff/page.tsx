'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * Diff 对比工具页面
 * 对比两段文本的差异
 */
export default function TextDiff() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [diffResult, setDiffResult] = useState<{ type: 'same' | 'added' | 'removed'; text: string }[]>([]);

  /**
   * 简单的行级 diff 算法
   */
  const calculateDiff = () => {
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    const result: { type: 'same' | 'added' | 'removed'; text: string }[] = [];

    let i = 0, j = 0;
    while (i < leftLines.length || j < rightLines.length) {
      const leftLine = leftLines[i];
      const rightLine = rightLines[j];

      if (i >= leftLines.length) {
        result.push({ type: 'added', text: rightLine });
        j++;
      } else if (j >= rightLines.length) {
        result.push({ type: 'removed', text: leftLine });
        i++;
      } else if (leftLine === rightLine) {
        result.push({ type: 'same', text: leftLine });
        i++;
        j++;
      } else {
        // 简单处理：如果不同，先标记删除，再标记添加
        result.push({ type: 'removed', text: leftLine });
        result.push({ type: 'added', text: rightLine });
        i++;
        j++;
      }
    }

    setDiffResult(result);
  };

  const clearAll = () => {
    setLeftText('');
    setRightText('');
    setDiffResult([]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-dark-50">Text Diff Tool</h1>
          <p className="mb-6 text-dark-200">Compare two texts and see the differences highlighted.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_DIFF_1" format="horizontal" />

        {/* 输入区域 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">Original Text</label>
              <button onClick={() => setLeftText('')} className="text-xs text-dark-200 hover:text-dark-100">Clear</button>
            </div>
            <textarea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              className="input-dark h-48 w-full resize-none rounded-lg p-3 font-mono text-sm text-dark-50"
              placeholder="Paste original text here..."
            />
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-dark-100">Modified Text</label>
              <button onClick={() => setRightText('')} className="text-xs text-dark-200 hover:text-dark-100">Clear</button>
            </div>
            <textarea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              className="input-dark h-48 w-full resize-none rounded-lg p-3 font-mono text-sm text-dark-50"
              placeholder="Paste modified text here..."
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-3 animate-fade-in-up">
          <button onClick={calculateDiff} className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium">Compare</button>
          <button onClick={clearAll} className="btn-ghost rounded-lg px-6 py-2.5 text-sm font-medium">Clear All</button>
        </div>

        {/* Diff 结果 */}
        {diffResult.length > 0 && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-4">
              <h3 className="mb-3 text-sm font-medium text-dark-100">Diff Result</h3>
              <div className="max-h-96 overflow-auto rounded-lg font-mono text-sm">
                {diffResult.map((line, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 ${
                      line.type === 'added'
                        ? 'bg-green-500/20 text-green-400'
                        : line.type === 'removed'
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-dark-100'
                    }`}
                  >
                    <span className="mr-2 select-none">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    {line.text || ' '}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_DIFF_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-dark-50">About Text Diff</h2>
          <p className="text-sm leading-relaxed text-dark-200">Compare two versions of text to see what changed. Added lines are shown in green, removed lines in red.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
