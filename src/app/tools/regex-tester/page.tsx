'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 正则表达式测试器页面组件
 * 提供正则表达式输入、测试字符串输入，并高亮展示匹配结果
 */
export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [inputText, setInputText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [err, setErr] = useState('');

  /** 执行正则匹配，捕获异常并展示匹配结果 */
  const runTest = () => {
    setErr('');
    setMatches([]);
    if (!pattern) {
      return;
    }
    try {
      const regex = new RegExp(pattern, flags);
      const found = inputText.match(regex);
      if (found) {
        setMatches(found);
      }
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-2 animate-fade-in-up font-display text-2xl font-bold text-dark-50">
          Regex Tester
        </h1>
        <p className="mb-6 animate-fade-in-up text-dark-200">
          Test and debug regular expressions online with match highlighting.
        </p>

        <AdCard slot="YOUR_AD_SLOT_13" format="horizontal" />

        <div className="glass-card mt-6 animate-fade-in-up rounded-lg p-6">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-dark-100">
              Pattern
            </label>
            <div className="flex gap-2">
              <span className="input-dark flex items-center rounded-lg border px-3 font-mono text-dark-200">
                /
              </span>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="input-dark flex-1 rounded-lg p-3 font-mono text-sm"
                placeholder="\d+"
              />
              <span className="input-dark flex items-center rounded-lg border px-3 font-mono text-dark-200">
                /
              </span>
              <input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="input-dark w-20 rounded-lg p-3 font-mono text-sm"
                placeholder="g"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-dark-100">
              Test String
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input-dark h-40 w-full rounded-lg p-3 font-mono text-sm"
              placeholder="Enter text to test..."
            />
          </div>

          <button
            onClick={runTest}
            className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
          >
            Test
          </button>

          {err && (
            <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {err}
            </p>
          )}

          {matches.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-dark-100">
                Matches ({matches.length}):
              </p>
              <div className="rounded-lg bg-green-500/10 p-4 font-mono text-sm">
                {matches.map((m, i) => (
                  <span
                    key={i}
                    className="mr-2 inline-block rounded bg-green-500/20 px-1.5 py-0.5 text-green-400"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <AdCard slot="YOUR_AD_SLOT_14" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-dark-50">
            Common Regex Patterns
          </h2>
          <div className="mt-3 space-y-2 text-sm text-dark-100">
            <div className="rounded bg-dark-600 px-3 py-2 font-mono">
              <code className="text-dark-50">\\d+</code> — One or more digits
            </div>
            <div className="rounded bg-dark-600 px-3 py-2 font-mono">
              <code className="text-dark-50">\\w+</code> — One or more word characters
            </div>
            <div className="rounded bg-dark-600 px-3 py-2 font-mono">
              <code className="text-dark-50">^https?://</code> — URLs starting with http/https
            </div>
            <div className="rounded bg-dark-600 px-3 py-2 font-mono">
              <code className="text-dark-50">[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]&#123;2,&#125;</code> — Email
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
