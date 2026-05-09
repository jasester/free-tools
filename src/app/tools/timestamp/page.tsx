'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 时间戳转换器页面
 * 支持 Unix 时间戳与人类可读日期之间的相互转换
 */
export default function Timestamp() {
  const [tsInput, setTsInput] = useState('');
  const [dateOutput, setDateOutput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [tsOutput, setTsOutput] = useState('');
  const now = Math.floor(Date.now() / 1000);

  /** 将 Unix 时间戳转换为可读日期 */
  const convertToDate = () => {
    const ts = parseInt(tsInput);
    if (isNaN(ts)) { setDateOutput('Invalid timestamp'); return; }
    const d = new Date(ts * 1000);
    setDateOutput(d.toLocaleString('en-US', { timeZoneName: 'short' }));
  };

  /** 将日期转换为 Unix 时间戳 */
  const convertToTimestamp = () => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) { setTsOutput('Invalid date'); return; }
    setTsOutput(String(Math.floor(d.getTime() / 1000)));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题区域 */}
        <div className="animate-fade-in-up">
          <h1 className="font-display mb-2 text-2xl font-bold text-dark-50">
            Timestamp Converter
          </h1>
          <p className="mb-6 text-sm text-dark-200">
            Convert between Unix timestamps and human-readable dates.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_9" format="horizontal" />

        {/* 转换卡片区域 */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* 时间戳转日期 */}
          <div className="glass-card animate-fade-in-up rounded-xl p-6">
            <h2 className="font-display mb-3 font-semibold text-dark-50">
              Timestamp &rarr; Date
            </h2>
            <input
              type="text"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              placeholder={`e.g. ${now}`}
              className="input-dark mb-3 w-full rounded-lg p-3 text-sm text-dark-50 placeholder-dark-200"
            />
            <button
              onClick={convertToDate}
              className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
            >
              Convert
            </button>
            {dateOutput && (
              <div className="mt-3 rounded-lg bg-dark-600/50 p-3 font-mono text-sm text-dark-100">
                {dateOutput}
              </div>
            )}
          </div>

          {/* 日期转时间戳 */}
          <div className="glass-card animate-fade-in-up rounded-xl p-6">
            <h2 className="font-display mb-3 font-semibold text-dark-50">
              Date &rarr; Timestamp
            </h2>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="input-dark mb-3 w-full rounded-lg p-3 text-sm text-dark-50"
            />
            <button
              onClick={convertToTimestamp}
              className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
            >
              Convert
            </button>
            {tsOutput && (
              <div className="mt-3 rounded-lg bg-dark-600/50 p-3 font-mono text-sm text-dark-100">
                {tsOutput}
              </div>
            )}
          </div>
        </div>

        {/* 当前时间戳展示 */}
        <div className="mt-4 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-sm text-dark-200">
              Current Unix Timestamp:{' '}
              <span className="font-mono font-bold text-dark-50">{now}</span>
            </p>
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_10" />

        {/* 关于说明区域 */}
        <section className="mt-10 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-display mb-2 text-lg font-semibold text-dark-50">
              About Timestamp Converter
            </h2>
            <p className="text-sm leading-relaxed text-dark-200">
              A Unix timestamp is the number of seconds since January 1, 1970 (UTC).
              This tool helps you convert between timestamps and human-readable dates
              instantly, useful for developers working with APIs and databases.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
