'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * UserAgent 数据库
 * 包含常见浏览器和操作系统的 UserAgent 字符串
 */
const userAgents = {
  Chrome: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  ],
  Firefox: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
  ],
  Safari: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  ],
  Edge: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
  ],
  'Mobile Chrome': [
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.179 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.179 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.179 Mobile/15E148 Safari/604.1',
  ],
  'Googlebot': [
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36',
    'Googlebot/2.1 (+http://www.google.com/bot.html)',
  ],
};

type BrowserType = keyof typeof userAgents;

/**
 * 解析 UserAgent 字符串，提取浏览器和操作系统信息
 */
const parseUA = (ua: string) => {
  let browser = 'Unknown';
  let os = 'Unknown';

  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Googlebot')) browser = 'Googlebot';
  else if (ua.includes('CriOS')) browser = 'Chrome iOS';

  if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
  else if (ua.includes('Windows NT')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone')) os = 'iOS (iPhone)';
  else if (ua.includes('iPad')) os = 'iOS (iPad)';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('X11')) os = 'Linux/Unix';

  return { browser, os };
};

/**
 * UserAgent 随机生成器工具页面
 */
export default function UserAgentGenerator() {
  const [selectedBrowser, setSelectedBrowser] = useState<BrowserType | 'random'>('random');
  const [generatedUA, setGeneratedUA] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      let browser: BrowserType;
      if (selectedBrowser === 'random') {
        const keys = Object.keys(userAgents) as BrowserType[];
        browser = keys[Math.floor(Math.random() * keys.length)];
      } else {
        browser = selectedBrowser;
      }
      const list = userAgents[browser];
      const ua = list[Math.floor(Math.random() * list.length)];
      results.push(ua);
    }
    const result = results.join('\n');
    setGeneratedUA(result);
    setHistory(prev => [result, ...prev.slice(0, 9)]);
  };

  const copyToClipboard = () => {
    if (generatedUA) navigator.clipboard.writeText(generatedUA);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-dark-50">UserAgent Generator</h1>
          <p className="mb-6 text-dark-200">Generate random UserAgent strings for testing and development.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_UA_1" format="horizontal" />

        {/* 设置区域 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          {/* 浏览器选择 */}
          <div className="glass-card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium text-dark-100">Browser Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(['random', ...Object.keys(userAgents)] as Array<BrowserType | 'random'>).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBrowser(type)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    selectedBrowser === type ? 'btn-gradient text-white' : 'btn-ghost text-dark-100'
                  }`}
                >
                  {type === 'random' ? '🎲 Random' : type}
                </button>
              ))}
            </div>
          </div>

          {/* 生成数量 */}
          <div className="glass-card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium text-dark-100">
              Generate Count: <span className="text-dark-50">{count}</span>
            </label>
            <input
              type="range" min="1" max="20" value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-accent-blue"
            />
            <div className="mt-2 flex justify-between text-xs text-dark-200">
              <span>1</span><span>20</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-3 animate-fade-in-up">
          <button onClick={generate} className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium">
            Generate
          </button>
          <button onClick={copyToClipboard} disabled={!generatedUA} className="btn-ghost rounded-lg px-6 py-2.5 text-sm font-medium disabled:opacity-50">
            Copy
          </button>
        </div>

        {/* 结果 */}
        {generatedUA && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-dark-100">Generated UserAgent</label>
                <div className="flex items-center gap-2">
                  {generatedUA.split('\n').length === 1 && (() => {
                    const info = parseUA(generatedUA);
                    return (
                      <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-xs text-accent-blue">
                        {info.browser} / {info.os}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <textarea
                value={generatedUA}
                readOnly
                className="input-dark h-32 w-full resize-none rounded-lg bg-dark-600/50 p-3 font-mono text-xs text-dark-50"
              />
            </div>
          </div>
        )}

        {/* 历史记录 */}
        {history.length > 1 && (
          <div className="mt-6 animate-fade-in-up">
            <h2 className="mb-3 text-sm font-medium text-dark-100">Recent History</h2>
            <div className="space-y-2">
              {history.slice(1, 6).map((item, i) => (
                <div key={i} className="glass-card rounded-lg p-3">
                  <code className="text-xs text-dark-100 break-all">{item.split('\n')[0]}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_UA_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-dark-50">About UserAgent Generator</h2>
          <p className="text-sm leading-relaxed text-dark-200">Generate random UserAgent strings for web scraping testing, browser simulation, and development. All data is generated locally in your browser.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
