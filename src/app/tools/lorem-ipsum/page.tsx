'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * Lorem Ipsum 生成器工具页面
 * 生成占位文本，可指定段落数、句子数、单词数
 */
export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(5);
  const [wordsPerSentence, setWordsPerSentence] = useState(8);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'plain' | 'html'>('plain');

  // Lorem Ipsum 词库
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
  ];

  /**
   * 获取随机单词
   * @returns 随机单词
   */
  const getRandomWord = (): string => {
    return words[Math.floor(Math.random() * words.length)];
  };

  /**
   * 生成句子
   * @param wordCount - 单词数量
   * @returns 生成的句子
   */
  const generateSentence = (wordCount: number): string => {
    const sentenceWords: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      sentenceWords.push(getRandomWord());
    }
    // 首字母大写
    sentenceWords[0] = sentenceWords[0].charAt(0).toUpperCase() + sentenceWords[0].slice(1);
    return sentenceWords.join(' ') + '.';
  };

  /**
   * 生成段落
   * @param sentenceCount - 句子数量
   * @param wordsPerSentenceCount - 每句单词数
   * @returns 生成的段落
   */
  const generateParagraph = (sentenceCount: number, wordsPerSentenceCount: number): string => {
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      // 添加一些随机性到句子长度
      const variation = Math.floor(Math.random() * 5) - 2; // -2 到 +2
      const actualWordCount = Math.max(3, wordsPerSentenceCount + variation);
      sentences.push(generateSentence(actualWordCount));
    }
    return sentences.join(' ');
  };

  /**
   * 生成 Lorem Ipsum 文本
   */
  const generateLoremIpsum = () => {
    const generatedParagraphs: string[] = [];
    for (let i = 0; i < paragraphs; i++) {
      generatedParagraphs.push(generateParagraph(sentencesPerParagraph, wordsPerSentence));
    }

    if (format === 'html') {
      setOutput(generatedParagraphs.map((p) => `<p>${p}</p>`).join('\n\n'));
    } else {
      setOutput(generatedParagraphs.join('\n\n'));
    }
    setCopied(false);
  };

  /**
   * 复制到剪贴板
   */
  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * 快速生成预设
   * @param p - 段落数
   * @param s - 每段句子数
   * @param w - 每句单词数
   */
  const quickGenerate = (p: number, s: number, w: number) => {
    setParagraphs(p);
    setSentencesPerParagraph(s);
    setWordsPerSentence(w);
    // 使用 setTimeout 确保状态更新后再生成
    setTimeout(() => {
      const generatedParagraphs: string[] = [];
      for (let i = 0; i < p; i++) {
        const variation = Math.floor(Math.random() * 5) - 2;
        const actualWordCount = Math.max(3, w + variation);
        const sentences: string[] = [];
        for (let j = 0; j < s; j++) {
          const sentenceWords: string[] = [];
          for (let k = 0; k < actualWordCount; k++) {
            sentenceWords.push(words[Math.floor(Math.random() * words.length)]);
          }
          sentenceWords[0] = sentenceWords[0].charAt(0).toUpperCase() + sentenceWords[0].slice(1);
          sentences.push(sentenceWords.join(' ') + '.');
        }
        generatedParagraphs.push(sentences.join(' '));
      }
      setOutput(format === 'html' ? generatedParagraphs.map((para) => `<p>${para}</p>`).join('\n\n') : generatedParagraphs.join('\n\n'));
    }, 0);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-dark-50">
            Lorem Ipsum Generator
          </h1>
          <p className="mb-6 text-dark-200">
            Generate placeholder text for your designs and layouts.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_LOREM_1" format="horizontal" />

        {/* 设置区域 */}
        <div className="mt-6 grid animate-fade-in-up gap-4 lg:grid-cols-2">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 text-sm font-medium text-dark-100">Configuration</h3>

            {/* 段落数 */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-dark-200">Paragraphs</label>
                <span className="text-sm font-medium text-dark-50">{paragraphs}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={paragraphs}
                onChange={(e) => setParagraphs(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-dark-200">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            {/* 每段句子数 */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-dark-200">Sentences per Paragraph</label>
                <span className="text-sm font-medium text-dark-50">{sentencesPerParagraph}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={sentencesPerParagraph}
                onChange={(e) => setSentencesPerParagraph(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-dark-200">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            {/* 每句单词数 */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-dark-200">Words per Sentence</label>
                <span className="text-sm font-medium text-dark-50">{wordsPerSentence}</span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                value={wordsPerSentence}
                onChange={(e) => setWordsPerSentence(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-dark-200">
                <span>3</span>
                <span>20</span>
              </div>
            </div>

            {/* 格式选择 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm text-dark-200">Output Format</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormat('plain')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    format === 'plain'
                      ? 'bg-accent-blue text-white'
                      : 'bg-dark-600 text-dark-200 hover:text-dark-50'
                  }`}
                >
                  Plain Text
                </button>
                <button
                  onClick={() => setFormat('html')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    format === 'html'
                      ? 'bg-accent-blue text-white'
                      : 'bg-dark-600 text-dark-200 hover:text-dark-50'
                  }`}
                >
                  HTML
                </button>
              </div>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={generateLoremIpsum}
              className="btn-gradient w-full rounded-lg py-3 text-sm font-semibold"
            >
              Generate Lorem Ipsum
            </button>
          </div>

          {/* 快速预设 */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 text-sm font-medium text-dark-100">Quick Presets</h3>
            <div className="space-y-2">
              <button
                onClick={() => quickGenerate(1, 3, 6)}
                className="btn-ghost w-full rounded-lg px-4 py-3 text-left text-sm transition hover:bg-dark-500"
              >
                <span className="font-medium text-dark-50">Short</span>
                <span className="ml-2 text-dark-200">1 paragraph, 3 sentences</span>
              </button>
              <button
                onClick={() => quickGenerate(3, 5, 8)}
                className="btn-ghost w-full rounded-lg px-4 py-3 text-left text-sm transition hover:bg-dark-500"
              >
                <span className="font-medium text-dark-50">Medium</span>
                <span className="ml-2 text-dark-200">3 paragraphs, 5 sentences</span>
              </button>
              <button
                onClick={() => quickGenerate(5, 8, 10)}
                className="btn-ghost w-full rounded-lg px-4 py-3 text-left text-sm transition hover:bg-dark-500"
              >
                <span className="font-medium text-dark-50">Long</span>
                <span className="ml-2 text-dark-200">5 paragraphs, 8 sentences</span>
              </button>
              <button
                onClick={() => quickGenerate(10, 10, 12)}
                className="btn-ghost w-full rounded-lg px-4 py-3 text-left text-sm transition hover:bg-dark-500"
              >
                <span className="font-medium text-dark-50">Very Long</span>
                <span className="ml-2 text-dark-200">10 paragraphs, 10 sentences</span>
              </button>
            </div>
          </div>
        </div>

        {/* 输出区域 */}
        {output && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-dark-100">Generated Text</label>
                <button
                  onClick={copyToClipboard}
                  className="btn-gradient rounded-lg px-4 py-2 text-sm font-medium"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                readOnly
                value={output}
                className="input-dark h-64 w-full rounded-lg bg-dark-600 p-4 font-mono text-sm text-dark-50"
              />
            </div>
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_LOREM_2" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-dark-50">
            About Lorem Ipsum
          </h2>
          <div className="space-y-2 text-sm text-dark-200">
            <p>
              Lorem Ipsum is a placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.
            </p>
            <p>
              The text is derived from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC.
            </p>
            <p>
              This generator creates random combinations of Latin words to produce placeholder text that has a natural distribution of word lengths and sentence structures.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
