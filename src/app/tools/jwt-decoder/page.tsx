'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/** JWT 各部分解码后的数据结构 */
interface JwtPart {
  label: string;
  raw: string;
  decoded: string;
}

/**
 * 将 Base64URL 编码的字符串解码为 UTF-8 文本
 * @param str - Base64URL 编码的字符串
 * @returns 解码后的 UTF-8 文本
 */
function base64UrlDecode(str: string): string {
  // 将 Base64URL 替换为标准 Base64 字符
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // 补齐 padding
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * 检查 JWT 的 exp 字段是否已过期
 * @param payload - 解码后的 Payload 对象
 * @returns 过期状态信息字符串
 */
function checkExpiration(payload: Record<string, unknown>): string {
  if (payload.exp === undefined) {
    return '';
  }
  const expMs = (payload.exp as number) * 1000;
  const now = Date.now();
  const expDate = new Date(expMs);
  const isExpired = now > expMs;
  const diffMs = expMs - now;
  const diffDays = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const diffHours = Math.abs(Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  if (isExpired) {
    return `Expired ${diffDays}d ${diffHours}h ago (${expDate.toLocaleString()})`;
  }
  return `Expires in ${diffDays}d ${diffHours}h (${expDate.toLocaleString()})`;
}

/**
 * JWT 解码器工具页面组件
 * 支持解析 JWT Token 的 Header、Payload、Signature 三部分
 * 并验证 Token 是否过期
 */
export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [parts, setParts] = useState<JwtPart[]>([]);
  const [error, setError] = useState('');
  const [expStatus, setExpStatus] = useState('');

  /** 解析 JWT Token 并展示 Header、Payload、Signature */
  const decodeJwt = () => {
    setError('');
    setParts([]);
    setExpStatus('');

    const trimmed = token.trim();
    if (!trimmed) {
      setError('Please enter a JWT token');
      return;
    }

    const segments = trimmed.split('.');
    if (segments.length !== 3) {
      setError('Invalid JWT format. A JWT must have 3 parts separated by dots (Header.Payload.Signature)');
      return;
    }

    try {
      const headerJson = base64UrlDecode(segments[0]);
      const payloadJson = base64UrlDecode(segments[1]);

      // 验证 JSON 格式
      const parsedHeader = JSON.parse(headerJson);
      JSON.parse(payloadJson); // 验证 payload 也是合法 JSON

      // 检查过期时间
      const expiration = checkExpiration(parsedHeader);
      setExpStatus(expiration);

      // 格式化 JSON 输出
      const formattedHeader = JSON.stringify(parsedHeader, null, 2);
      const formattedPayload = JSON.stringify(JSON.parse(payloadJson), null, 2);

      setParts([
        { label: 'Header', raw: segments[0], decoded: formattedHeader },
        { label: 'Payload', raw: segments[1], decoded: formattedPayload },
        { label: 'Signature', raw: segments[2], decoded: '(Signature cannot be decoded — it verifies the token integrity)' },
      ]);
    } catch {
      setError('Failed to decode JWT. Please check the token format.');
    }
  };

  /** 清空输入和输出 */
  const clear = () => {
    setToken('');
    setParts([]);
    setError('');
    setExpStatus('');
  };

  /** 复制指定文本到剪贴板 */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="font-display mb-2 text-2xl font-bold text-light-900 dark:text-dark-50">
            JWT Decoder
          </h1>
          <p className="mb-6 text-sm text-light-500 dark:text-dark-200">
            Decode and inspect JSON Web Tokens. View Header, Payload, and check expiration.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_17" format="horizontal" />

        {/* 输入区域 */}
        <div className="mt-6 animate-fade-in-up">
          <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
            JWT Token
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="input-dark h-32 w-full rounded-lg p-3 font-mono text-sm"
            placeholder="Paste your JWT token here (e.g. eyJhbGciOiJIUzI1NiIs...)"
          />
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={decodeJwt}
            className="btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
          >
            Decode
          </button>
          <button
            onClick={clear}
            className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-medium text-light-700 dark:text-dark-100 transition"
          >
            Clear
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* 过期状态 */}
        {expStatus && (
          <div className={`mt-4 rounded-lg p-3 text-sm font-medium ${
            expStatus.startsWith('Expired')
              ? 'border border-red-500/20 bg-red-500/10 text-red-400'
              : 'border border-green-500/20 bg-green-500/10 text-green-400'
          }`}>
            {expStatus}
          </div>
        )}

        {/* 解码结果 */}
        {parts.length > 0 && (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {parts.map((part) => (
              <div key={part.label} className="glass-card animate-fade-in-up rounded-xl p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-light-900 dark:text-dark-50">
                    {part.label}
                  </h3>
                  {part.label !== 'Signature' && (
                    <button
                      onClick={() => copyToClipboard(part.decoded)}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Copy
                    </button>
                  )}
                </div>
                {/* 原始 Base64URL */}
                <div className="mb-3">
                  <p className="mb-1 text-xs text-light-500 dark:text-dark-200">Base64URL</p>
                  <div className="rounded-lg bg-gray-100 dark:bg-dark-600/50 p-2 font-mono text-xs text-light-500 dark:text-dark-200 break-all">
                    {part.raw}
                  </div>
                </div>
                {/* 解码后内容 */}
                <div>
                  <p className="mb-1 text-xs text-light-500 dark:text-dark-200">Decoded</p>
                  <pre className="overflow-auto rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 font-mono text-xs text-light-700 dark:text-dark-100 whitespace-pre-wrap">
                    {part.decoded}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_18" />

        {/* 说明区域 */}
        <section className="mt-10 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-display mb-2 text-lg font-semibold text-light-900 dark:text-dark-50">
              About JWT
            </h2>
            <p className="text-sm leading-relaxed text-light-500 dark:text-dark-200">
              A JSON Web Token (JWT) is a compact, URL-safe means of representing claims
              to be transferred between two parties. It consists of three parts: a Header
              (algorithm and token type), a Payload (claims such as user ID, roles, and
              expiration), and a Signature (used to verify the token). All decoding happens
              locally in your browser — no data is sent to any server.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
