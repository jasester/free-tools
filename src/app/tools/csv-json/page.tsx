'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * CSV/JSON 互转工具页面
 * 支持 CSV 转 JSON 和 JSON 转 CSV，可配置表头处理选项
 */
export default function CsvJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [hasHeader, setHasHeader] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  /**
   * 解析 CSV 文本为二维数组
   * @param csv - CSV 文本
   * @returns 解析后的二维数组
   */
  const parseCSV = (csv: string): string[][] => {
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      const nextChar = csv[i + 1];

      if (insideQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            currentCell += '"';
            i++;
          } else {
            insideQuotes = false;
          }
        } else {
          currentCell += char;
        }
      } else {
        if (char === '"') {
          insideQuotes = true;
        } else if (char === ',') {
          currentLine.push(currentCell);
          currentCell = '';
        } else if (char === '\n') {
          currentLine.push(currentCell);
          lines.push(currentLine);
          currentLine = [];
          currentCell = '';
        } else if (char !== '\r') {
          currentCell += char;
        }
      }
    }

    currentLine.push(currentCell);
    if (currentLine.length > 0 && currentLine.some((cell) => cell.trim() !== '')) {
      lines.push(currentLine);
    }

    return lines;
  };

  /**
   * 将二维数组转换为 CSV 文本
   * @param data - 二维数组数据
   * @returns CSV 文本
   */
  const arrayToCSV = (data: string[][]): string => {
    return data
      .map((row) =>
        row
          .map((cell) => {
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
              return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
          })
          .join(',')
      )
      .join('\n');
  };

  /**
   * CSV 转 JSON
   */
  const convertCsvToJson = () => {
    setError('');
    try {
      const lines = parseCSV(input);
      if (lines.length === 0) {
        setOutput('[]');
        return;
      }

      let headers: string[];
      let dataRows: string[][];

      if (hasHeader) {
        headers = lines[0];
        dataRows = lines.slice(1);
      } else {
        headers = lines[0].map((_, index) => `column${index + 1}`);
        dataRows = lines;
      }

      const result = dataRows.map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setError('Failed to parse CSV: ' + (err as Error).message);
    }
  };

  /**
   * JSON 转 CSV
   */
  const convertJsonToCsv = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        setError('JSON must be an array of objects');
        return;
      }

      if (parsed.length === 0) {
        setOutput('');
        return;
      }

      const headers = Object.keys(parsed[0]);
      const rows = parsed.map((obj) =>
        headers.map((header) => String(obj[header] || ''))
      );

      const csvData = hasHeader ? [headers, ...rows] : rows;
      setOutput(arrayToCSV(csvData));
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
    }
  };

  /**
   * 执行转换
   */
  const convert = () => {
    if (mode === 'csv-to-json') {
      convertCsvToJson();
    } else {
      convertJsonToCsv();
    }
  };

  /**
   * 复制输出到剪贴板
   */
  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * 清空所有内容
   */
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  /**
   * 交换输入输出
   */
  const swap = () => {
    setInput(output);
    setOutput('');
    setError('');
    setMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            CSV / JSON Converter
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Convert between CSV and JSON formats with customizable header options.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_CSV_1" format="horizontal" />

        {/* 模式选择 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex rounded-lg bg-gray-100 dark:bg-dark-600 p-1">
                <button
                  onClick={() => setMode('csv-to-json')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    mode === 'csv-to-json'
                      ? 'bg-accent-blue text-white'
                      : 'text-light-500 dark:text-dark-200 hover:text-light-900 dark:hover:text-dark-50'
                  }`}
                >
                  CSV to JSON
                </button>
                <button
                  onClick={() => setMode('json-to-csv')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    mode === 'json-to-csv'
                      ? 'bg-accent-blue text-white'
                      : 'text-light-500 dark:text-dark-200 hover:text-light-900 dark:hover:text-dark-50'
                  }`}
                >
                  JSON to CSV
                </button>
              </div>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-dark-300 bg-gray-100 dark:bg-dark-600 text-accent-blue"
                />
                <span className="text-sm text-light-500 dark:text-dark-200">Include Header Row</span>
              </label>
            </div>
          </div>
        </div>

        {/* 输入输出区域 */}
        <div className="mt-6 grid animate-fade-in-up gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">
                {mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}
              </label>
              <button
                onClick={swap}
                className="text-xs text-blue-400 hover:underline"
              >
                Swap &harr;
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-dark h-72 w-full rounded-lg p-4 font-mono text-sm text-light-900 dark:text-dark-50"
              placeholder={
                mode === 'csv-to-json'
                  ? 'name,age,city\nJohn,30,New York\nJane,25,London'
                  : '[\n  {\n    "name": "John",\n    "age": 30\n  }\n]'
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
              {mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}
            </label>
            {error ? (
              <div className="input-dark h-72 w-full rounded-lg border border-red-500/20 bg-red-500/10 p-4 font-mono text-sm text-red-400">
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                className="input-dark h-72 w-full rounded-lg bg-gray-100 dark:bg-dark-600 p-4 font-mono text-sm text-light-900 dark:text-dark-50"
                placeholder="Result will appear here..."
              />
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 flex flex-wrap gap-3 animate-fade-in-up">
          <button
            onClick={convert}
            className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium"
          >
            Convert
          </button>
          <button
            onClick={copyOutput}
            className="btn-ghost rounded-lg px-6 py-2.5 text-sm font-medium"
          >
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button
            onClick={clearAll}
            className="btn-ghost rounded-lg px-6 py-2.5 text-sm font-medium"
          >
            Clear
          </button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_CSV_2" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            About CSV / JSON Converter
          </h2>
          <div className="space-y-2 text-sm text-light-500 dark:text-dark-200">
            <p>
              <strong className="text-light-700 dark:text-dark-100">CSV (Comma-Separated Values):</strong> A simple text format for tabular data where each line represents a row and values are separated by commas.
            </p>
            <p>
              <strong className="text-light-700 dark:text-dark-100">JSON (JavaScript Object Notation):</strong> A lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate.
            </p>
            <p>
              This tool supports quoted fields, escaped quotes, and custom header handling. All processing happens in your browser.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
