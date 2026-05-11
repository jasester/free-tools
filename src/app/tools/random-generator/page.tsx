'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 生成模式类型
 */
type GenerateMode = 'number' | 'password' | 'dice' | 'coin' | 'uuid' | 'color';

/**
 * 历史记录项接口
 */
interface HistoryItem {
  id: string;
  mode: GenerateMode;
  value: string;
  timestamp: number;
}

/**
 * 随机数生成器工具页面
 * 支持多种生成模式：随机数字、随机密码、随机骰子、随机硬币、随机UUID、随机颜色
 */
export default function RandomGenerator() {
  // 当前生成模式
  const [mode, setMode] = useState<GenerateMode>('number');
  // 生成数量
  const [count, setCount] = useState(1);
  // 生成结果
  const [results, setResults] = useState<string[]>([]);
  // 历史记录
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // 复制状态
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // 数字模式设置
  const [numberMin, setNumberMin] = useState(1);
  const [numberMax, setNumberMax] = useState(100);

  // 密码模式设置
  const [passwordLength, setPasswordLength] = useState(12);
  const [passwordOptions, setPasswordOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  // 颜色模式设置
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  /**
   * 生成唯一ID
   * @returns 唯一ID字符串
   */
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  /**
   * 生成随机数字
   * @param min - 最小值
   * @param max - 最大值
   * @returns 随机数字字符串
   */
  const generateRandomNumber = (min: number, max: number): string => {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  };

  /**
   * 生成随机密码
   * @param length - 密码长度
   * @param options - 字符类型选项
   * @returns 随机密码字符串
   */
  const generateRandomPassword = (length: number, options: typeof passwordOptions): string => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    let validChars = '';
    if (options.uppercase) validChars += chars.uppercase;
    if (options.lowercase) validChars += chars.lowercase;
    if (options.numbers) validChars += chars.numbers;
    if (options.symbols) validChars += chars.symbols;

    if (validChars === '') return '';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += validChars.charAt(Math.floor(Math.random() * validChars.length));
    }
    return result;
  };

  /**
   * 生成随机骰子结果
   * @returns 1-6的随机数字字符串
   */
  const generateRandomDice = (): string => {
    return (Math.floor(Math.random() * 6) + 1).toString();
  };

  /**
   * 生成随机硬币结果
   * @returns "正面"或"反面"字符串
   */
  const generateRandomCoin = (): string => {
    return Math.random() < 0.5 ? 'Heads (正面)' : 'Tails (反面)';
  };

  /**
   * 生成UUID v4
   * @returns UUID字符串
   */
  const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  /**
   * 生成随机颜色
   * @param format - 颜色格式
   * @returns 颜色字符串
   */
  const generateRandomColor = (format: 'hex' | 'rgb' | 'hsl'): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    switch (format) {
      case 'hex':
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
      case 'rgb':
        return `rgb(${r}, ${g}, ${b})`;
      case 'hsl': {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2 / 255;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 * 255 - max - min) : d / (max + min);
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
          }
        }
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      }
      default:
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
  };

  /**
   * 根据当前模式生成随机值
   * @returns 生成的随机值
   */
  const generateByMode = (): string => {
    switch (mode) {
      case 'number':
        return generateRandomNumber(numberMin, numberMax).toString();
      case 'password':
        return generateRandomPassword(passwordLength, passwordOptions);
      case 'dice':
        return generateRandomDice();
      case 'coin':
        return generateRandomCoin();
      case 'uuid':
        return generateUUID();
      case 'color':
        return generateRandomColor(colorFormat);
      default:
        return '';
    }
  };

  /**
   * 执行生成操作
   */
  const handleGenerate = () => {
    const newResults: string[] = [];
    const newHistoryItems: HistoryItem[] = [];

    for (let i = 0; i < count; i++) {
      const value = generateByMode();
      newResults.push(value);

      // 添加到历史记录
      const historyItem: HistoryItem = {
        id: generateId(),
        mode,
        value,
        timestamp: Date.now(),
      };
      newHistoryItems.push(historyItem);
    }

    setResults(newResults);
    setHistory(prev => [...newHistoryItems, ...prev].slice(0, 50)); // 保留最近50条
    setCopiedAll(false);
    setCopiedIndex(null);
  };

  /**
   * 复制单个结果到剪贴板
   * @param value - 要复制的值
   * @param index - 结果索引
   */
  const copySingle = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  /**
   * 复制所有结果到剪贴板
   */
  const copyAll = () => {
    if (results.length > 0) {
      navigator.clipboard.writeText(results.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  /**
   * 清空历史记录
   */
  const clearHistory = () => {
    setHistory([]);
  };

  /**
   * 从历史记录重新生成
   * @param item - 历史记录项
   */
  const regenerateFromHistory = (item: HistoryItem) => {
    setMode(item.mode);
    setCount(1);
    // 延迟执行生成，等待状态更新
    setTimeout(() => {
      handleGenerate();
    }, 0);
  };

  /**
   * 获取模式标签
   * @param modeValue - 模式值
   * @returns 模式标签
   */
  const getModeLabel = (modeValue: GenerateMode): string => {
    const labels: Record<GenerateMode, string> = {
      number: 'Random Number',
      password: 'Random Password',
      dice: 'Random Dice',
      coin: 'Random Coin',
      uuid: 'Random UUID',
      color: 'Random Color',
    };
    return labels[modeValue];
  };

  /**
   * 获取模式图标
   * @param modeValue - 模式值
   * @returns SVG图标
   */
  const getModeIcon = (modeValue: GenerateMode) => {
    const icons: Record<GenerateMode, JSX.Element> = {
      number: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      password: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      dice: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      coin: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      uuid: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      color: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    };
    return icons[modeValue];
  };

  // 初始生成
  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            Random Generator
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Generate random numbers, passwords, dice rolls, coins, UUIDs, and colors.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_RANDOM_1" format="horizontal" />

        {/* 模式选择 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium text-light-700 dark:text-dark-100">Generation Mode</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
              {(['number', 'password', 'dice', 'coin', 'uuid', 'color'] as GenerateMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                    mode === m
                      ? 'bg-accent-blue/20 text-accent-blue ring-1 ring-accent-blue'
                      : 'bg-gray-100 dark:bg-dark-600/50 text-light-500 dark:text-dark-200 hover:bg-gray-300 dark:hover:bg-dark-500 hover:text-light-700 dark:hover:text-dark-100'
                  }`}
                >
                  {getModeIcon(m)}
                  <span className="text-xs font-medium">{getModeLabel(m)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 模式特定设置 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            {/* 数字模式设置 */}
            {mode === 'number' && (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">
                    Min Value: <span className="text-light-900 dark:text-dark-50">{numberMin}</span>
                  </label>
                  <input
                    type="number"
                    value={numberMin}
                    onChange={(e) => setNumberMin(parseInt(e.target.value) || 0)}
                    className="input-dark w-full rounded-lg p-3 text-light-900 dark:text-dark-50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">
                    Max Value: <span className="text-light-900 dark:text-dark-50">{numberMax}</span>
                  </label>
                  <input
                    type="number"
                    value={numberMax}
                    onChange={(e) => setNumberMax(parseInt(e.target.value) || 0)}
                    className="input-dark w-full rounded-lg p-3 text-light-900 dark:text-dark-50"
                  />
                </div>
              </div>
            )}

            {/* 密码模式设置 */}
            {mode === 'password' && (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">
                    Password Length: <span className="text-light-900 dark:text-dark-50">{passwordLength}</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                    className="w-full accent-accent-blue"
                  />
                  <div className="mt-1 flex justify-between text-xs text-light-500 dark:text-dark-200">
                    <span>4</span>
                    <span>64</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Character Types</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'uppercase', label: 'Uppercase (A-Z)' },
                      { key: 'lowercase', label: 'Lowercase (a-z)' },
                      { key: 'numbers', label: 'Numbers (0-9)' },
                      { key: 'symbols', label: 'Symbols (!@#$...)' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={passwordOptions[key as keyof typeof passwordOptions]}
                          onChange={() =>
                            setPasswordOptions((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
                          }
                          className="h-4 w-4 rounded border-gray-300 dark:border-dark-300 bg-gray-100 dark:bg-dark-600 text-accent-blue"
                        />
                        <span className="text-sm text-light-500 dark:text-dark-200">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 颜色模式设置 */}
            {mode === 'color' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Color Format</label>
                <div className="flex gap-2">
                  {(['hex', 'rgb', 'hsl'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setColorFormat(format)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        colorFormat === format
                          ? 'bg-accent-blue text-white'
                          : 'bg-gray-100 dark:bg-dark-600/50 text-light-500 dark:text-dark-200 hover:bg-gray-300 dark:hover:bg-dark-500'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 骰子和硬币模式不需要额外设置 */}
            {(mode === 'dice' || mode === 'coin' || mode === 'uuid') && (
              <p className="text-sm text-light-500 dark:text-dark-200">
                {mode === 'dice' && 'Generates a random number between 1 and 6.'}
                {mode === 'coin' && 'Generates Heads or Tails randomly.'}
                {mode === 'uuid' && 'Generates a standard UUID v4 identifier.'}
              </p>
            )}

            {/* 生成数量设置 */}
            <div className="mt-6 border-t border-black/[0.08] dark:border-white/[0.06] pt-6">
              <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">
                Generate Count: <span className="text-light-900 dark:text-dark-50">{count}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-light-500 dark:text-dark-200">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            {/* 生成按钮 */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={handleGenerate}
                className="btn-gradient flex-1 rounded-lg py-3 text-sm font-semibold"
              >
                Generate
              </button>
              <button
                onClick={copyAll}
                className="btn-ghost rounded-lg px-6 py-3 text-sm font-medium"
              >
                {copiedAll ? 'Copied!' : 'Copy All'}
              </button>
            </div>
          </div>
        </div>

        {/* 生成结果 */}
        {results.length > 0 && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-6">
              <h3 className="mb-4 text-sm font-medium text-light-700 dark:text-dark-100">
                Generated Results ({results.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3"
                  >
                    <span className="w-8 text-center text-xs text-light-500 dark:text-dark-200">{index + 1}</span>
                    
                    {/* 颜色预览 */}
                    {mode === 'color' && (
                      <div
                        className="h-8 w-8 rounded border border-gray-200 dark:border-white/10"
                        style={{ backgroundColor: result }}
                      />
                    )}
                    
                    <input
                      type="text"
                      readOnly
                      value={result}
                      className="input-dark flex-1 rounded bg-transparent p-2 font-mono text-sm text-light-900 dark:text-dark-50"
                    />
                    <button
                      onClick={() => copySingle(result, index)}
                      className="btn-gradient rounded px-3 py-1.5 text-xs font-medium"
                    >
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_RANDOM_2" />

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-light-700 dark:text-dark-100">
                  Generation History ({history.length})
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-light-500 dark:text-dark-200 hover:text-red-400 transition-colors"
                >
                  Clear History
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-dark-600/30 p-2"
                  >
                    <span className="rounded bg-gray-200 dark:bg-dark-500 px-2 py-1 text-xs text-light-500 dark:text-dark-200">
                      {getModeLabel(item.mode)}
                    </span>
                    
                    {/* 颜色预览 */}
                    {item.mode === 'color' && (
                      <div
                        className="h-6 w-6 rounded border border-gray-200 dark:border-white/10"
                        style={{ backgroundColor: item.value }}
                      />
                    )}
                    
                    <span className="flex-1 truncate font-mono text-sm text-light-700 dark:text-dark-100">
                      {item.value}
                    </span>
                    <span className="text-xs text-light-600 dark:text-dark-300">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => copySingle(item.value, -1)}
                      className="rounded p-1.5 text-light-500 dark:text-dark-200 hover:bg-gray-300 dark:hover:bg-dark-500 hover:text-light-900 dark:hover:text-dark-50"
                      title="Copy"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            About Random Generator
          </h2>
          <div className="space-y-2 text-sm text-light-500 dark:text-dark-200">
            <p>
              This tool provides various random generation capabilities for your daily needs:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong className="text-light-700 dark:text-dark-100">Random Number:</strong> Generate random integers within a specified range</li>
              <li><strong className="text-light-700 dark:text-dark-100">Random Password:</strong> Create secure passwords with customizable length and character types</li>
              <li><strong className="text-light-700 dark:text-dark-100">Random Dice:</strong> Simulate dice rolls (1-6)</li>
              <li><strong className="text-light-700 dark:text-dark-100">Random Coin:</strong> Flip a virtual coin for Heads or Tails</li>
              <li><strong className="text-light-700 dark:text-dark-100">Random UUID:</strong> Generate standard UUID v4 identifiers</li>
              <li><strong className="text-light-700 dark:text-dark-100">Random Color:</strong> Generate random colors in HEX, RGB, or HSL format</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
