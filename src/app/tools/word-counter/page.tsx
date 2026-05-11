'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 字数统计工具页面
 * 统计字符数、单词数、行数、段落数，并估算阅读时间
 */
export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0,
    speakingTime: 0,
  });

  /**
   * 计算文本统计信息
   * @param inputText - 输入的文本
   */
  const calculateStats = (inputText: string) => {
    // 字符数（含空格）
    const characters = inputText.length;

    // 字符数（不含空格）
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;

    // 单词数
    const words = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;

    // 行数
    const lines = inputText === '' ? 0 : inputText.split('\n').length;

    // 段落数（按空行分隔）
    const paragraphs =
      inputText.trim() === ''
        ? 0
        : inputText.split(/\n\s*\n/).filter((p) => p.trim() !== '').length;

    // 句子数
    const sentences =
      inputText.trim() === ''
        ? 0
        : inputText.split(/[.!?]+/).filter((s) => s.trim() !== '').length;

    // 阅读时间（按每分钟200字计算）
    const readingTime = Math.ceil(words / 200);

    // 演讲时间（按每分钟130字计算）
    const speakingTime = Math.ceil(words / 130);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      sentences,
      readingTime,
      speakingTime,
    });
  };

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  /** 清空文本 */
  const clearText = () => {
    setText('');
  };

  /** 粘贴示例文本 */
  const loadSample = () => {
    const sample = `The quick brown fox jumps over the lazy dog.

This is a sample text to demonstrate the word counter feature. It counts characters, words, lines, and paragraphs.

Word counters are useful for writers, students, and professionals who need to meet specific length requirements for their documents.`;
    setText(sample);
  };

  const statCards = [
    { label: 'Characters', value: stats.characters, subtext: 'with spaces' },
    { label: 'Characters', value: stats.charactersNoSpaces, subtext: 'no spaces' },
    { label: 'Words', value: stats.words, subtext: 'total count' },
    { label: 'Lines', value: stats.lines, subtext: 'line breaks' },
    { label: 'Paragraphs', value: stats.paragraphs, subtext: 'separated by blank lines' },
    { label: 'Sentences', value: stats.sentences, subtext: 'by punctuation' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            Word Counter
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Count characters, words, lines, paragraphs, and estimate reading time.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_WORD_1" format="horizontal" />

        {/* 统计卡片 */}
        <div className="mt-6 grid animate-fade-in-up gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <div key={card.label + card.subtext} className="glass-card rounded-xl p-4">
              <div className="text-3xl font-bold text-light-900 dark:text-dark-50">{card.value.toLocaleString()}</div>
              <div className="text-sm font-medium text-light-700 dark:text-dark-100">{card.label}</div>
              <div className="text-xs text-light-500 dark:text-dark-200">{card.subtext}</div>
            </div>
          ))}
        </div>

        {/* 时间估算 */}
        <div className="mt-4 grid animate-fade-in-up gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-light-900 dark:text-dark-50">{stats.readingTime} min</div>
                <div className="text-sm text-light-500 dark:text-dark-200">Estimated reading time</div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-light-900 dark:text-dark-50">{stats.speakingTime} min</div>
                <div className="text-sm text-light-500 dark:text-dark-200">Estimated speaking time</div>
              </div>
            </div>
          </div>
        </div>

        {/* 文本输入区域 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Your Text</label>
              <div className="flex gap-2">
                <button
                  onClick={loadSample}
                  className="text-xs text-light-500 dark:text-dark-200 hover:text-light-900 dark:hover:text-dark-50"
                >
                  Load Sample
                </button>
                <span className="text-light-600 dark:text-dark-300">|</span>
                <button
                  onClick={clearText}
                  className="text-xs text-light-500 dark:text-dark-200 hover:text-light-900 dark:hover:text-dark-50"
                >
                  Clear
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-dark h-64 w-full rounded-lg p-4 text-light-900 dark:text-dark-50"
              placeholder="Type or paste your text here..."
            />
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_WORD_2" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            About Word Counter
          </h2>
          <div className="space-y-2 text-sm text-light-500 dark:text-dark-200">
            <p>
              This word counter provides detailed statistics about your text, including character count with and without spaces, word count, line count, paragraph count, and sentence count.
            </p>
            <p>
              <strong className="text-light-700 dark:text-dark-100">Reading time</strong> is calculated at an average reading speed of 200 words per minute. <strong className="text-light-700 dark:text-dark-100">Speaking time</strong> is calculated at an average speaking speed of 130 words per minute.
            </p>
            <p>
              Useful for writers, bloggers, students, and professionals who need to meet specific word count requirements for essays, articles, speeches, and social media posts.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
