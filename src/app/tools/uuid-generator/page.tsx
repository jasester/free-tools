'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * UUID/GUID 生成器工具页面
 * 生成 UUID v4，支持批量生成，带连字符/无连字符选项
 */
export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [withHyphens, setWithHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  /**
   * 生成单个 UUID v4
   * @returns UUID 字符串
   */
  const generateUUID = (): string => {
    // 使用 crypto.randomUUID() 如果可用，否则使用 polyfill
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Polyfill for UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  /**
   * 格式化 UUID
   * @param uuid - 原始 UUID
   * @returns 格式化后的 UUID
   */
  const formatUUID = (uuid: string): string => {
    let formatted = uuid;

    // 移除或添加连字符
    if (!withHyphens) {
      formatted = formatted.replace(/-/g, '');
    }

    // 转换大小写
    if (uppercase) {
      formatted = formatted.toUpperCase();
    } else {
      formatted = formatted.toLowerCase();
    }

    return formatted;
  };

  /**
   * 生成指定数量的 UUID
   */
  const generateUUIDs = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(formatUUID(generateUUID()));
    }
    setUuids(newUuids);
    setCopiedAll(false);
  };

  // 初始生成
  useEffect(() => {
    generateUUIDs();
  }, []);

  // 当格式选项改变时重新生成
  useEffect(() => {
    if (uuids.length > 0) {
      const newUuids = uuids.map((uuid) => {
        // 先获取原始 UUID（移除格式）
        const rawUuid = uuid.replace(/-/g, '').toLowerCase();
        // 重新添加连字符到标准位置
        const standardUuid = `${rawUuid.slice(0, 8)}-${rawUuid.slice(8, 12)}-${rawUuid.slice(12, 16)}-${rawUuid.slice(16, 20)}-${rawUuid.slice(20)}`;
        return formatUUID(standardUuid);
      });
      setUuids(newUuids);
    }
  }, [withHyphens, uppercase]);

  /**
   * 复制单个 UUID
   * @param uuid - UUID 字符串
   * @param index - 索引
   */
  const copySingle = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  /**
   * 复制所有 UUID
   */
  const copyAll = () => {
    if (uuids.length > 0) {
      navigator.clipboard.writeText(uuids.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  /**
   * 刷新单个 UUID
   * @param index - 索引
   */
  const refreshSingle = (index: number) => {
    const newUuids = [...uuids];
    newUuids[index] = formatUUID(generateUUID());
    setUuids(newUuids);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            UUID / GUID Generator
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Generate random UUID v4 identifiers for your applications.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_UUID_1" format="horizontal" />

        {/* 设置区域 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* 数量设置 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">
                  Number of UUIDs: <span className="text-light-900 dark:text-dark-50">{count}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-accent-blue"
                />
                <div className="mt-1 flex justify-between text-xs text-light-500 dark:text-dark-200">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>

              {/* 格式选项 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Format Options</label>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={withHyphens}
                      onChange={(e) => setWithHyphens(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-dark-300 bg-gray-100 dark:bg-dark-600 text-accent-blue"
                    />
                    <span className="text-sm text-light-500 dark:text-dark-200">Include hyphens</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={uppercase}
                      onChange={(e) => setUppercase(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-dark-300 bg-gray-100 dark:bg-dark-600 text-accent-blue"
                    />
                    <span className="text-sm text-light-500 dark:text-dark-200">Uppercase</span>
                  </label>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-end">
                <div className="flex w-full gap-2">
                  <button
                    onClick={generateUUIDs}
                    className="btn-gradient flex-1 rounded-lg py-2.5 text-sm font-semibold"
                  >
                    Generate New
                  </button>
                  <button
                    onClick={copyAll}
                    className="btn-ghost rounded-lg px-4 py-2.5 text-sm font-medium"
                  >
                    {copiedAll ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UUID 列表 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-light-700 dark:text-dark-100">
                Generated UUIDs ({uuids.length})
              </h3>
              <span className="text-xs text-light-500 dark:text-dark-200">
                {withHyphens ? '8-4-4-4-12 format' : '32 characters'}
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3"
                >
                  <span className="w-8 text-center text-xs text-light-500 dark:text-dark-200">{index + 1}</span>
                  <input
                    type="text"
                    readOnly
                    value={uuid}
                    className="input-dark flex-1 rounded bg-transparent p-2 font-mono text-sm text-light-900 dark:text-dark-50"
                  />
                  <button
                    onClick={() => refreshSingle(index)}
                    className="rounded p-2 text-light-500 dark:text-dark-200 hover:bg-gray-300 dark:hover:bg-dark-500 hover:text-light-900 dark:hover:text-dark-50"
                    title="Refresh"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => copySingle(uuid, index)}
                    className="btn-gradient rounded px-3 py-1.5 text-xs font-medium"
                  >
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_UUID_2" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            About UUID
          </h2>
          <div className="space-y-2 text-sm text-light-500 dark:text-dark-200">
            <p>
              <strong className="text-light-700 dark:text-dark-100">UUID (Universally Unique Identifier)</strong> or <strong className="text-light-700 dark:text-dark-100">GUID (Globally Unique Identifier)</strong> is a 128-bit number used to identify information in computer systems.
            </p>
            <p>
              <strong className="text-light-700 dark:text-dark-100">UUID v4</strong> is randomly generated and has 2^122 possible combinations, making collisions extremely unlikely.
            </p>
            <p>
              UUIDs are widely used in databases, distributed systems, and software development for unique identification without central coordination.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-1 font-medium text-light-700 dark:text-dark-100">Standard Format</h3>
                <code className="rounded bg-gray-100 dark:bg-dark-600 px-2 py-1 text-xs">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>
              </div>
              <div>
                <h3 className="mb-1 font-medium text-light-700 dark:text-dark-100">Without Hyphens</h3>
                <code className="rounded bg-gray-100 dark:bg-dark-600 px-2 py-1 text-xs">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
