'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * Cron 表达式解析器工具页面
 * 支持解析 Cron 表达式并生成人类可读的描述，以及生成常用 Cron 表达式
 */

/**
 * 解析 Cron 表达式的各个字段
 * @param expression Cron 表达式 (如: "0 0 * * *")
 * @returns 解析结果对象
 */
function parseCronExpression(expression: string): {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  isValid: boolean;
  error?: string;
} {
  const parts = expression.trim().split(/\s+/);

  if (parts.length !== 5 && parts.length !== 6) {
    return {
      minute: '',
      hour: '',
      dayOfMonth: '',
      month: '',
      dayOfWeek: '',
      isValid: false,
      error: 'Cron 表达式必须包含 5 或 6 个字段',
    };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts.slice(0, 5);

  return {
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
    isValid: true,
  };
}

/**
 * 将 Cron 字段转换为人类可读的描述
 * @param value 字段值
 * @param type 字段类型
 * @returns 可读描述
 */
function getFieldDescription(value: string, type: 'minute' | 'hour' | 'day' | 'month' | 'weekday'): string {
  if (value === '*') {
    const map = {
      minute: '每分钟',
      hour: '每小时',
      day: '每天',
      month: '每月',
      weekday: '每周每天',
    };
    return map[type];
  }

  if (value === '*/') return '每';

  if (value.startsWith('*/')) {
    const num = value.slice(2);
    const map: Record<string, string> = {
      minute: `每 ${num} 分钟`,
      hour: `每 ${num} 小时`,
      day: `每 ${num} 天`,
      month: `每 ${num} 个月`,
      weekday: `每 ${num} 天`,
    };
    return map[type];
  }

  if (value.includes(',')) {
    return `在 ${value} ${type === 'minute' ? '分' : type === 'hour' ? '时' : type === 'day' ? '日' : type === 'month' ? '月' : ''}`;
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-');
    return `从 ${start} 到 ${end} ${type === 'minute' ? '分' : type === 'hour' ? '时' : type === 'day' ? '日' : type === 'month' ? '月' : ''}`;
  }

  if (type === 'weekday') {
    const weekdays: Record<string, string> = {
      '0': '周日',
      '1': '周一',
      '2': '周二',
      '3': '周三',
      '4': '周四',
      '5': '周五',
      '6': '周六',
      '7': '周日',
    };
    return weekdays[value] || `周${value}`;
  }

  if (type === 'month') {
    const months: Record<string, string> = {
      '1': '一月',
      '2': '二月',
      '3': '三月',
      '4': '四月',
      '5': '五月',
      '6': '六月',
      '7': '七月',
      '8': '八月',
      '9': '九月',
      '10': '十月',
      '11': '十一月',
      '12': '十二月',
    };
    return months[value] || `${value}月`;
  }

  return value;
}

/**
 * 生成 Cron 表达式的完整描述
 * @param expression Cron 表达式
 * @returns 人类可读的描述
 */
function generateDescription(expression: string): string {
  const parsed = parseCronExpression(expression);

  if (!parsed.isValid) {
    return parsed.error || '无效的 Cron 表达式';
  }

  const { minute, hour, dayOfMonth, month, dayOfWeek } = parsed;

  // 常见模式匹配
  if (expression === '0 0 * * *') return '每天午夜执行';
  if (expression === '0 12 * * *') return '每天中午执行';
  if (expression === '0 0 * * 0') return '每周日午夜执行';
  if (expression === '0 0 1 * *') return '每月1日午夜执行';
  if (expression === '0 0 1 1 *') return '每年1月1日午夜执行';
  if (expression === '*/5 * * * *') return '每5分钟执行一次';
  if (expression === '0 */1 * * *') return '每小时执行一次';
  if (expression === '0 9-17 * * 1-5') return '工作日的9点到17点每小时执行';

  const parts: string[] = [];

  if (minute !== '*') {
    parts.push(getFieldDescription(minute, 'minute'));
  }
  if (hour !== '*') {
    parts.push(getFieldDescription(hour, 'hour'));
  }
  if (dayOfMonth !== '*') {
    parts.push(getFieldDescription(dayOfMonth, 'day'));
  }
  if (month !== '*') {
    parts.push(getFieldDescription(month, 'month'));
  }
  if (dayOfWeek !== '*') {
    parts.push(getFieldDescription(dayOfWeek, 'weekday'));
  }

  if (parts.length === 0) {
    return '每分钟执行一次';
  }

  return parts.join('，');
}

/**
 * 预设的常用 Cron 表达式
 */
const presets = [
  { name: '每分钟', expression: '* * * * *', description: '每分钟执行一次' },
  { name: '每5分钟', expression: '*/5 * * * *', description: '每5分钟执行一次' },
  { name: '每15分钟', expression: '*/15 * * * *', description: '每15分钟执行一次' },
  { name: '每30分钟', expression: '*/30 * * * *', description: '每30分钟执行一次' },
  { name: '每小时', expression: '0 * * * *', description: '每小时的整点执行' },
  { name: '每天午夜', expression: '0 0 * * *', description: '每天00:00执行' },
  { name: '每天中午', expression: '0 12 * * *', description: '每天12:00执行' },
  { name: '每周日', expression: '0 0 * * 0', description: '每周日午夜执行' },
  { name: '每周一', expression: '0 0 * * 1', description: '每周一午夜执行' },
  { name: '每月1日', expression: '0 0 1 * *', description: '每月1日午夜执行' },
  { name: '每年1月1日', expression: '0 0 1 1 *', description: '每年1月1日午夜执行' },
  { name: '工作日9-17点', expression: '0 9-17 * * 1-5', description: '工作日每小时执行' },
  { name: '每2小时', expression: '0 */2 * * *', description: '每2小时执行一次' },
  { name: '每6小时', expression: '0 */6 * * *', description: '每6小时执行一次' },
];

/**
 * Cron 解析器组件
 */
export default function CronParser() {
  const [expression, setExpression] = useState('0 0 * * *');
  const [description, setDescription] = useState('每天午夜执行');
  const [error, setError] = useState('');

  /**
   * 解析当前表达式
   */
  const handleParse = () => {
    const parsed = parseCronExpression(expression);
    if (parsed.isValid) {
      setError('');
      setDescription(generateDescription(expression));
    } else {
      setError(parsed.error || '无效的表达式');
      setDescription('');
    }
  };

  /**
   * 应用预设表达式
   * @param preset 预设对象
   */
  const applyPreset = (preset: typeof presets[0]) => {
    setExpression(preset.expression);
    setDescription(preset.description);
    setError('');
  };

  /**
   * 复制表达式到剪贴板
   */
  const copyExpression = () => {
    navigator.clipboard.writeText(expression);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            Cron Expression Parser
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Parse and generate Cron expressions. Understand when your scheduled tasks will run.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_CRON_1" format="horizontal" />

        {/* 输入区域 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">
              Cron Expression (5 fields: minute hour day month weekday)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="input-dark flex-1 rounded-lg px-4 py-3 font-mono text-lg text-light-900 dark:text-dark-50"
                placeholder="0 0 * * *"
              />
              <button
                onClick={handleParse}
                className="btn-gradient rounded-lg px-6 py-3 text-sm font-medium text-white"
              >
                Parse
              </button>
              <button
                onClick={copyExpression}
                className="btn-ghost rounded-lg px-4 py-3 text-sm font-medium"
              >
                Copy
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            {description && !error && (
              <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <p className="text-sm text-emerald-400">
                  <span className="font-medium">Description: </span>
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 字段说明 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Field Reference
            </h3>
            <div className="grid gap-4 md:grid-cols-5">
              {[
                { field: 'Minute', range: '0-59', example: '0, 30, */5' },
                { field: 'Hour', range: '0-23', example: '0, 12, */2' },
                { field: 'Day', range: '1-31', example: '1, 15, *' },
                { field: 'Month', range: '1-12', example: '1, 6, *' },
                { field: 'Weekday', range: '0-6', example: '0, 1-5, *' },
              ].map((item) => (
                <div key={item.field} className="text-center">
                  <div className="mb-1 font-medium text-light-900 dark:text-dark-50">{item.field}</div>
                  <div className="text-xs text-light-500 dark:text-dark-200">Range: {item.range}</div>
                  <div className="text-xs text-light-600 dark:text-dark-300">Ex: {item.example}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 预设表达式 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Common Presets
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {presets.map((preset) => (
                <button
                  key={preset.expression}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-dark-600/50 px-4 py-3 text-left transition hover:border-gray-200 dark:border-white/10 hover:bg-gray-300/50 dark:hover:bg-dark-500/50"
                >
                  <div>
                    <div className="font-medium text-light-900 dark:text-dark-50">{preset.name}</div>
                    <div className="font-mono text-xs text-light-600 dark:text-dark-300">{preset.expression}</div>
                  </div>
                  <div className="text-xs text-light-500 dark:text-dark-200">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_CRON_2" />

        {/* 使用说明 */}
        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            Cron Expression Guide
          </h2>
          <div className="grid gap-4 text-sm text-light-500 dark:text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">* (Asterisk):</strong> 匹配任意值
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">, (Comma):</strong> 列出多个值，如 1,3,5
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">- (Hyphen):</strong> 范围，如 1-5
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">/ (Slash):</strong> 步长，如 */5 表示每5个单位
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Weekday:</strong> 0=周日, 1=周一, ..., 6=周六
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Month:</strong> 1=一月, ..., 12=十二月
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
