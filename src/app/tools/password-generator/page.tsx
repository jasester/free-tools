'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 密码生成器工具页面
 * 支持生成随机密码，可自定义长度和字符类型
 */
export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
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

    if (validChars === '') {
      setPassword('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += validChars.charAt(Math.floor(Math.random() * validChars.length));
    }
    setPassword(result);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 计算密码强度
  const getStrength = () => {
    let score = 0;
    if (options.uppercase) score++;
    if (options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    if (length >= 12) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500', 'bg-green-400'];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-light-900 dark:text-dark-50">Password Generator</h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">Generate strong, secure passwords instantly.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_PWD_1" format="horizontal" />

        {/* 密码显示 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={password}
                readOnly
                className="input-dark flex-1 rounded-lg p-4 font-mono text-xl tracking-wider text-light-900 dark:text-dark-50"
              />
              <button
                onClick={copyToClipboard}
                className="btn-gradient rounded-lg px-6 py-4 text-sm font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* 密码强度条 */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-light-500 dark:text-dark-200">Strength</span>
                <span className={`text-xs font-medium ${strengthColors[strength].replace('bg-', 'text-')}`}>
                  {strengthLabels[strength]}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-dark-600/50">
                <div
                  className={`h-full rounded-full transition-all ${strengthColors[strength]}`}
                  style={{ width: `${((strength + 1) / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 设置选项 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          {/* 长度设置 */}
          <div className="glass-card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium text-light-700 dark:text-dark-100">
              Password Length: <span className="text-light-900 dark:text-dark-50">{length}</span>
            </label>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-accent-blue"
            />
            <div className="mt-2 flex justify-between text-xs text-light-500 dark:text-dark-200">
              <span>6</span>
              <span>64</span>
            </div>
          </div>

          {/* 字符选项 */}
          <div className="glass-card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium text-light-700 dark:text-dark-100">Character Types</label>
            <div className="space-y-2">
              {[
                { key: 'uppercase', label: 'Uppercase (A-Z)' },
                { key: 'lowercase', label: 'Lowercase (a-z)' },
                { key: 'numbers', label: 'Numbers (0-9)' },
                { key: 'symbols', label: 'Symbols (!@#$...)' },
              ].map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options[key as keyof typeof options]}
                    onChange={() => toggleOption(key as keyof typeof options)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-dark-300 bg-gray-100 dark:bg-dark-600 text-accent-blue focus:ring-accent-blue"
                  />
                  <span className="text-sm text-light-500 dark:text-dark-200">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 生成按钮 */}
        <div className="mt-6 animate-fade-in-up">
          <button
            onClick={generatePassword}
            className="btn-gradient w-full rounded-xl py-4 text-lg font-semibold"
          >
            Generate New Password
          </button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_PWD_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-light-900 dark:text-dark-50">Password Tips</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-light-500 dark:text-dark-200">
            <li>Use at least 12 characters for better security</li>
            <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>Avoid using personal information in passwords</li>
            <li>Use a unique password for each account</li>
            <li>Consider using a password manager</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
