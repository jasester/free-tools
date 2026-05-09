'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/** 支持的哈希算法类型 */
type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

/** 哈希结果数据结构 */
interface HashResult {
  algorithm: HashAlgorithm;
  value: string;
}

/**
 * 使用 Web Crypto API 计算指定算法的哈希值
 * @param algorithm - 哈希算法名称 (SHA-1 / SHA-256 / SHA-512)
 * @param data - 待计算的数据 (字符串)
 * @returns 哈希值的十六进制字符串
 */
async function computeHash(algorithm: HashAlgorithm, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 使用 Web Crypto API 计算文件的哈希值
 * @param algorithm - 哈希算法名称
 * @param file - 待计算的 File 对象
 * @returns 哈希值的十六进制字符串
 */
async function computeFileHash(algorithm: HashAlgorithm, file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** 所有支持的哈希算法列表 */
const ALGORITHMS: HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-512'];

/**
 * Hash 生成器工具页面组件
 * 支持文本和文件的 SHA-1、SHA-256、SHA-512 哈希计算
 */
export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isComputing, setIsComputing] = useState(false);

  /** 计算输入文本的所有哈希值 */
  const calculateHashes = useCallback(async () => {
    if (!input.trim()) return;
    setIsComputing(true);
    try {
      const results = await Promise.all(
        ALGORITHMS.map(async (algo) => ({
          algorithm: algo,
          value: await computeHash(algo, input),
        }))
      );
      setHashes(results);
    } catch {
      setHashes([]);
    } finally {
      setIsComputing(false);
    }
  }, [input]);

  /** 处理文件选择并计算文件哈希 */
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(2)} KB`);
    setIsComputing(true);
    setHashes([]);

    try {
      const results = await Promise.all(
        ALGORITHMS.map(async (algo) => ({
          algorithm: algo,
          value: await computeFileHash(algo, file),
        }))
      );
      setHashes(results);
    } catch {
      setHashes([]);
    } finally {
      setIsComputing(false);
    }
  }, []);

  /** 清空所有输入和结果 */
  const clear = () => {
    setInput('');
    setHashes([]);
    setFileName('');
    setFileSize('');
  };

  /** 复制哈希值到剪贴板 */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="font-display mb-2 text-2xl font-bold text-dark-50">
            Hash Generator
          </h1>
          <p className="mb-6 text-sm text-dark-200">
            Generate SHA-1, SHA-256, and SHA-512 hashes from text or files instantly.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_19" format="horizontal" />

        {/* 文本哈希区域 */}
        <div className="glass-card mt-6 animate-fade-in-up rounded-xl p-6">
          <h2 className="font-display mb-3 font-semibold text-dark-50">
            Text Hash
          </h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-dark h-32 w-full rounded-lg p-3 font-mono text-sm"
            placeholder="Enter text to hash..."
          />
          <div className="mt-3 flex gap-3">
            <button
              onClick={calculateHashes}
              disabled={isComputing || !input.trim()}
              className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
            >
              {isComputing ? 'Computing...' : 'Generate Hashes'}
            </button>
            <button
              onClick={clear}
              className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-medium text-dark-100 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* 文件哈希区域 */}
        <div className="glass-card mt-4 animate-fade-in-up rounded-xl p-6">
          <h2 className="font-display mb-3 font-semibold text-dark-50">
            File Hash
          </h2>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-dark-300 bg-dark-600/30 p-8 transition hover:border-blue-400/50">
            <svg className="mb-2 h-8 w-8 text-dark-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-dark-200">
              {fileName ? fileName : 'Click to select a file'}
            </span>
            {fileSize && (
              <span className="mt-1 text-xs text-dark-300">{fileSize}</span>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* 哈希结果展示 */}
        {hashes.length > 0 && (
          <div className="mt-6 space-y-3 animate-fade-in-up">
            <h2 className="font-display font-semibold text-dark-50">
              Results
            </h2>
            {hashes.map((hash) => (
              <div key={hash.algorithm} className="glass-card rounded-xl p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-dark-100">
                    {hash.algorithm}
                  </span>
                  <button
                    onClick={() => copyToClipboard(hash.value)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <div className="overflow-auto rounded-lg bg-dark-600/50 p-3 font-mono text-xs text-dark-100 break-all">
                  {hash.value}
                </div>
              </div>
            ))}
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_20" />

        {/* 说明区域 */}
        <section className="mt-10 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-display mb-2 text-lg font-semibold text-dark-50">
              About Hash Generator
            </h2>
            <p className="text-sm leading-relaxed text-dark-200">
              A hash function maps data of arbitrary size to fixed-size values. SHA-256
              and SHA-512 are part of the SHA-2 family and are widely used in cryptography,
              data integrity verification, and password hashing. All computation is performed
              locally using the Web Crypto API — no data leaves your browser.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
