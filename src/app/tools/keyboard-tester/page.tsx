'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 键盘按键检测器工具页面
 * 实时显示用户按下的键盘按键信息
 */

/**
 * 按键信息接口
 */
interface KeyInfo {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  location: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  repeat: boolean;
}

/**
 * 键盘按键检测器组件
 */
export default function KeyboardTester() {
  const [lastKey, setLastKey] = useState<KeyInfo | null>(null);
  const [history, setHistory] = useState<KeyInfo[]>([]);
  const [isListening, setIsListening] = useState(true);

  /**
   * 处理键盘按下事件
   * @param event 键盘事件
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isListening) return;

    // 防止默认行为（如 F5 刷新、Ctrl+S 保存等）
    if (event.key !== 'F5' && event.key !== 'F12') {
      event.preventDefault();
    }

    const keyInfo: KeyInfo = {
      key: event.key,
      code: event.code,
      keyCode: event.keyCode,
      which: event.which,
      location: event.location,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      repeat: event.repeat,
    };

    setLastKey(keyInfo);
    setHistory((prev) => [keyInfo, ...prev.slice(0, 19)]);
  };

  /**
   * 添加和移除键盘事件监听
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListening]);

  /**
   * 清空历史记录
   */
  const clearHistory = () => {
    setHistory([]);
    setLastKey(null);
  };

  /**
   * 切换监听状态
   */
  const toggleListening = () => {
    setIsListening(!isListening);
  };

  /**
   * 获取按键位置的描述
   * @param location 位置代码
   * @returns 位置描述
   */
  const getLocationText = (location: number): string => {
    const locations: Record<number, string> = {
      0: 'Standard',
      1: 'Left',
      2: 'Right',
      3: 'Numpad',
    };
    return locations[location] || 'Unknown';
  };

  /**
   * 获取按键的显示样式
   * @param key 按键值
   * @returns CSS 类名
   */
  const getKeyStyle = (key: string): string => {
    if (key === ' ') return 'min-w-[200px]';
    if (key.length === 1) return 'min-w-[80px]';
    return 'min-w-[120px]';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            Keyboard Tester
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Press any key to see its key code, location, and modifier states.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_KEYBOARD_1" format="horizontal" />

        {/* 控制按钮 */}
        <div className="mt-6 flex gap-3 animate-fade-in-up">
          <button
            onClick={toggleListening}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isListening
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isListening ? '🟢 Listening' : '🔴 Paused'}
          </button>
          <button
            onClick={clearHistory}
            className="btn-ghost rounded-lg px-4 py-2 text-sm font-medium"
          >
            Clear History
          </button>
        </div>

        {/* 当前按键显示 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-8 text-center">
            {lastKey ? (
              <div className="animate-fade-in">
                <div
                  className={`mx-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 px-8 py-6 text-4xl font-bold text-white shadow-lg ${getKeyStyle(
                    lastKey.key
                  )}`}
                >
                  {lastKey.key === ' ' ? 'Space' : lastKey.key}
                </div>

                {/* 按键详情 */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                    <div className="text-xs text-light-500 dark:text-dark-200">Code</div>
                    <div className="font-mono text-lg text-light-900 dark:text-dark-50">{lastKey.code}</div>
                  </div>
                  <div className="rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                    <div className="text-xs text-light-500 dark:text-dark-200">KeyCode</div>
                    <div className="font-mono text-lg text-light-900 dark:text-dark-50">{lastKey.keyCode}</div>
                  </div>
                  <div className="rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                    <div className="text-xs text-light-500 dark:text-dark-200">Location</div>
                    <div className="font-mono text-lg text-light-900 dark:text-dark-50">
                      {getLocationText(lastKey.location)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                    <div className="text-xs text-light-500 dark:text-dark-200">Which</div>
                    <div className="font-mono text-lg text-light-900 dark:text-dark-50">{lastKey.which}</div>
                  </div>
                </div>

                {/* 修饰键状态 */}
                <div className="mt-4 flex justify-center gap-2">
                  {[
                    { key: 'Ctrl', active: lastKey.ctrlKey },
                    { key: 'Shift', active: lastKey.shiftKey },
                    { key: 'Alt', active: lastKey.altKey },
                    { key: 'Meta', active: lastKey.metaKey },
                  ].map((mod) => (
                    <div
                      key={mod.key}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                        mod.active
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-gray-100 dark:bg-dark-600/50 text-light-600 dark:text-dark-300'
                      }`}
                    >
                      {mod.key}
                    </div>
                  ))}
                </div>

                {lastKey.repeat && (
                  <div className="mt-3 text-sm text-amber-400">🔁 Key Repeat</div>
                )}
              </div>
            ) : (
              <div className="py-12 text-light-500 dark:text-dark-200">
                <div className="mb-4 text-6xl">⌨️</div>
                <p>Press any key to start testing</p>
              </div>
            )}
          </div>
        </div>

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
                Key History
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {history.map((key, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-dark-600/30 p-2"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200/50 dark:bg-dark-500/50 font-mono text-sm text-light-900 dark:text-dark-50">
                      {key.key === ' ' ? '␣' : key.key.length > 1 ? key.key.slice(0, 2) : key.key}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs text-light-700 dark:text-dark-100">{key.code}</div>
                      <div className="text-xs text-light-600 dark:text-dark-300">{key.keyCode}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_KEYBOARD_2" />

        {/* 使用说明 */}
        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            Keyboard Event Properties
          </h2>
          <div className="grid gap-4 text-sm text-light-500 dark:text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">key:</strong> The value of the key pressed
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">code:</strong> Physical key on the keyboard
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">keyCode/which:</strong> Deprecated but still
                used numeric code
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">location:</strong> Position of the key
                (Standard/Left/Right/Numpad)
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Modifier Keys:</strong> Ctrl, Shift, Alt, Meta
                (Cmd/Win) states
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">repeat:</strong> Indicates if key is being held
                down
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
