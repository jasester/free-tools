'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * SQL 压缩格式化工具页面
 */
export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  /**
   * SQL 关键字列表
   */
  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'DROP', 'ALTER', 'ADD', 'COLUMN', 'INDEX', 'VIEW', 'JOIN', 'LEFT', 'RIGHT',
    'INNER', 'OUTER', 'FULL', 'CROSS', 'ON', 'GROUP', 'BY', 'ORDER', 'ASC',
    'DESC', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'AS', 'DISTINCT',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'IS', 'NULL', 'COUNT',
    'SUM', 'AVG', 'MIN', 'MAX', 'IF', 'IFNULL', 'COALESCE', 'CAST', 'CONVERT',
    'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'DEFAULT',
    'NOT NULL', 'AUTO_INCREMENT', 'UNIQUE', 'CHECK', 'WITH', 'RECURSIVE',
  ];

  /**
   * 压缩 SQL
   */
  const minifySQL = (sql: string): string => {
    return sql
      .replace(/--.*$/gm, '')              // 移除单行注释
      .replace(/\/\*[\s\S]*?\*\//g, '')    // 移除多行注释
      .replace(/\s+/g, ' ')                // 合并空格
      .replace(/\s*([,\(\)\;])\s*/g, '$1') // 移除符号周围空格
      .trim();
  };

  /**
   * 格式化 SQL
   */
  const formatSQL = (sql: string): string => {
    // 先压缩
    let formatted = minifySQL(sql);

    // 主要关键字换行
    const mainKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE'];

    for (const kw of mainKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${kw}`);
    }

    // 子句关键字缩进
    const subKeywords = ['AND', 'OR', 'ON', 'SET'];
    for (const kw of subKeywords) {
      const regex = new RegExp(`^\\s*(${kw})\\b`, 'gim');
      formatted = formatted.replace(regex, '  $1');
    }

    // 逗号后换行（SELECT 列）
    formatted = formatted.replace(/,\s*/g, ',\n  ');

    // 清理多余空行
    formatted = formatted.replace(/\n\s*\n/g, '\n').trim();

    return formatted;
  };

  const handleAction = (action: 'format' | 'minify') => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      setOutput(action === 'minify' ? minifySQL(input) : formatSQL(input));
    } catch (e) {
      setError('Error processing SQL.');
      setOutput('');
    }
  };

  const copyToClipboard = () => { if (output) navigator.clipboard.writeText(output); };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-light-900 dark:text-dark-50">SQL Formatter</h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">Minify or format SQL queries instantly.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_SQL_1" format="horizontal" />

        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Input SQL</label>
              <button onClick={() => setInput('')} className="text-xs text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100">Clear</button>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="input-dark h-64 w-full resize-none rounded-lg p-3 font-mono text-sm text-light-900 dark:text-dark-50" placeholder="Paste your SQL query here..." />
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">Output</label>
              <button onClick={copyToClipboard} disabled={!output} className="text-xs text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100 disabled:opacity-50">Copy</button>
            </div>
            <textarea value={output} readOnly className="input-dark h-64 w-full resize-none rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 font-mono text-sm text-light-900 dark:text-dark-50" placeholder="Result will appear here..." />
          </div>
        </div>

        {error && <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

        <div className="mt-6 flex gap-3 animate-fade-in-up">
          <button onClick={() => handleAction('format')} className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium">Format</button>
          <button onClick={() => handleAction('minify')} className="btn-ghost rounded-lg px-6 py-2.5 text-sm font-medium">Minify</button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_SQL_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-light-900 dark:text-dark-50">About SQL Formatter</h2>
          <p className="text-sm leading-relaxed text-light-500 dark:text-dark-200">Format SQL queries with proper indentation and line breaks. Minify SQL to reduce file size. Supports SELECT, INSERT, UPDATE, DELETE, CREATE and more.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
