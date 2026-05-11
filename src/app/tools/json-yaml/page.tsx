'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * JSON ↔ YAML 转换器工具页面
 * 支持 JSON 和 YAML 格式之间的相互转换
 */

/**
 * 将 JSON 字符串转换为 YAML 格式
 * @param json JSON 字符串
 * @returns YAML 格式字符串
 */
function jsonToYaml(json: string): string {
  try {
    const obj = JSON.parse(json);
    return convertToYaml(obj, 0);
  } catch (e: any) {
    throw new Error('Invalid JSON: ' + e.message);
  }
}

/**
 * 将对象转换为 YAML 格式
 * @param obj 要转换的对象
 * @param indent 缩进级别
 * @returns YAML 格式字符串
 */
function convertToYaml(obj: any, indent: number): string {
  const spaces = '  '.repeat(indent);

  if (obj === null) return 'null';
  if (obj === undefined) return '';
  if (typeof obj === 'boolean') return obj ? 'true' : 'false';
  if (typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') {
    // 如果字符串包含特殊字符，使用引号包裹
    if (/[:\-\[\]{}#&*!|>'"%@`]/.test(obj) || obj.includes('\n')) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => {
      const yamlItem = convertToYaml(item, indent + 1);
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        // 对象数组，第一行加 -，后续行保持缩进
        const lines = yamlItem.split('\n');
        return '- ' + lines[0] + '\n' + lines.slice(1).join('\n');
      }
      return '- ' + yamlItem;
    }).join('\n');
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    return entries.map(([key, value]) => {
      const yamlValue = convertToYaml(value, indent + 1);
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // 嵌套对象
        return `${spaces}${key}:\n${yamlValue}`;
      }
      if (Array.isArray(value)) {
        // 数组
        if (value.length === 0) {
          return `${spaces}${key}: []`;
        }
        return `${spaces}${key}:\n${yamlValue}`;
      }
      return `${spaces}${key}: ${yamlValue}`;
    }).join('\n');
  }

  return String(obj);
}

/**
 * 简单的 YAML 转 JSON 实现
 * @param yaml YAML 字符串
 * @returns JSON 字符串
 */
function yamlToJson(yaml: string): string {
  try {
    const obj = parseYaml(yaml);
    return JSON.stringify(obj, null, 2);
  } catch (e: any) {
    throw new Error('Invalid YAML: ' + e.message);
  }
}

/**
 * 解析 YAML 字符串为对象
 * 这是一个简化版实现，支持基本 YAML 语法
 */
function parseYaml(yaml: string): any {
  const lines = yaml.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('#');
  });

  if (lines.length === 0) return {};

  // 检测是否为数组
  if (lines[0].trim().startsWith('-')) {
    return parseYamlArray(lines, 0);
  }

  return parseYamlObject(lines, 0);
}

/**
 * 解析 YAML 对象
 */
function parseYamlObject(lines: string[], startIndent: number): Record<string, any> {
  const result: Record<string, any> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const indent = getIndentLevel(line);

    if (indent < startIndent) break;
    if (indent > startIndent) {
      i++;
      continue;
    }

    const trimmed = line.trim();
    const colonIndex = trimmed.indexOf(':');

    if (colonIndex === -1) {
      i++;
      continue;
    }

    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();

    // 检查下一行
    const nextLine = lines[i + 1];
    const nextIndent = nextLine ? getIndentLevel(nextLine) : 0;

    if (value === '' || value === '[]' || value === '{}') {
      if (nextIndent > indent) {
        // 有子内容
        const childLines = [];
        let j = i + 1;
        while (j < lines.length && getIndentLevel(lines[j]) >= nextIndent) {
          if (getIndentLevel(lines[j]) === nextIndent) {
            childLines.push(lines[j]);
          }
          j++;
        }

        if (childLines[0]?.trim().startsWith('-')) {
          result[key] = parseYamlArray(childLines, nextIndent);
        } else {
          result[key] = parseYamlObject(childLines, nextIndent);
        }
        i = j;
        continue;
      } else if (value === '[]') {
        result[key] = [];
      } else if (value === '{}') {
        result[key] = {};
      } else {
        result[key] = '';
      }
    } else {
      result[key] = parseYamlValue(value);
    }

    i++;
  }

  return result;
}

/**
 * 解析 YAML 数组
 */
function parseYamlArray(lines: string[], startIndent: number): any[] {
  const result: any[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const indent = getIndentLevel(line);

    if (indent < startIndent) break;

    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) {
      i++;
      continue;
    }

    const value = trimmed.substring(1).trim();

    // 检查是否有子内容
    const nextLine = lines[i + 1];
    const nextIndent = nextLine ? getIndentLevel(nextLine) : 0;

    if (value === '' && nextIndent > indent) {
      // 对象数组
      const childLines = [];
      let j = i + 1;
      while (j < lines.length && getIndentLevel(lines[j]) >= nextIndent) {
        if (getIndentLevel(lines[j]) === nextIndent) {
          childLines.push(lines[j]);
        }
        j++;
      }
      result.push(parseYamlObject(childLines, nextIndent));
      i = j;
    } else if (value === '') {
      result.push(null);
      i++;
    } else {
      result.push(parseYamlValue(value));
      i++;
    }
  }

  return result;
}

/**
 * 获取行的缩进级别
 */
function getIndentLevel(line: string): number {
  let count = 0;
  for (const char of line) {
    if (char === ' ') count++;
    else if (char === '\t') count += 2;
    else break;
  }
  return Math.floor(count / 2);
}

/**
 * 解析 YAML 值
 */
function parseYamlValue(value: string): any {
  value = value.trim();

  if (value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '[]') return [];
  if (value === '{}') return {};

  // 数字
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);

  // 字符串（去除引号）
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}

/**
 * JSON ↔ YAML 转换器组件
 */
export default function JsonYamlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
  const [error, setError] = useState('');

  /**
   * 执行转换
   */
  const convert = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'json-to-yaml') {
        const yaml = jsonToYaml(input);
        setOutput(yaml);
      } else {
        const json = yamlToJson(input);
        setOutput(json);
      }
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  /**
   * 复制输出到剪贴板
   */
  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  /**
   * 清空输入输出
   */
  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            JSON ↔ YAML Converter
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Convert between JSON and YAML formats easily. All processing happens in your browser.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_JSONYAML_1" format="horizontal" />

        {/* 模式选择 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMode('json-to-yaml')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  mode === 'json-to-yaml'
                    ? 'btn-gradient text-white'
                    : 'btn-ghost text-light-700 dark:text-dark-100 hover:text-light-900 dark:hover:text-dark-50'
                }`}
              >
                JSON → YAML
              </button>
              <button
                onClick={() => setMode('yaml-to-json')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  mode === 'yaml-to-json'
                    ? 'btn-gradient text-white'
                    : 'btn-ghost text-light-700 dark:text-dark-100 hover:text-light-900 dark:hover:text-dark-50'
                }`}
              >
                YAML → JSON
              </button>
            </div>
          </div>
        </div>

        {/* 输入输出区域 */}
        <div className="mt-6 grid animate-fade-in-up gap-4 lg:grid-cols-2">
          {/* 输入区域 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">
                {mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
              </label>
              <button
                onClick={clearAll}
                className="text-xs text-light-500 dark:text-dark-200 hover:text-light-900 dark:hover:text-dark-50"
              >
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-dark h-80 w-full rounded-lg p-4 font-mono text-sm text-light-900 dark:text-dark-50"
              placeholder={mode === 'json-to-yaml' ? '{\n  "key": "value"\n}' : 'key: value'}
            />
          </div>

          {/* 输出区域 */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-light-700 dark:text-dark-100">
                {mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
              </label>
              <button
                onClick={copyOutput}
                className="text-xs text-blue-400 hover:underline"
              >
                Copy
              </button>
            </div>
            {error ? (
              <div className="h-80 w-full rounded-lg border border-red-500/20 bg-red-500/10 p-4 font-mono text-sm text-red-400">
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                className="input-dark h-80 w-full rounded-lg bg-gray-100 dark:bg-dark-600 p-4 font-mono text-sm text-light-900 dark:text-dark-50"
                placeholder={`${mode === 'json-to-yaml' ? 'YAML' : 'JSON'} output will appear here...`}
              />
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 flex gap-3 animate-fade-in-up">
          <button
            onClick={convert}
            className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-medium text-white"
          >
            Convert
          </button>
        </div>

        <AdCard slot="YOUR_AD_SLOT_JSONYAML_2" />

        {/* 使用说明 */}
        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            About JSON ↔ YAML Converter
          </h2>
          <div className="grid gap-4 text-sm text-light-500 dark:text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">JSON:</strong> JavaScript Object Notation,
                a lightweight data-interchange format
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">YAML:</strong> YAML Ain&apos;t Markup Language,
                a human-readable data serialization standard
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Features:</strong> Supports nested objects,
                arrays, strings, numbers, booleans, and null values
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Privacy:</strong> All conversion happens
                locally in your browser - no data is sent to servers
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
