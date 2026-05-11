'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 日期计算器页面组件
 * 提供两种计算模式：
 * 1. 计算两个日期之间的差值（天数、月数、年数、工作日）
 * 2. 给指定日期加减天数/月数/年数，计算目标日期
 */
export default function DateCalculator() {
  // 当前选中的计算模式：'diff' 表示日期差值计算，'add' 表示日期加减计算
  const [mode, setMode] = useState<'diff' | 'add'>('diff');

  // 日期差值计算相关状态
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diffResult, setDiffResult] = useState<{
    days: number;
    months: number;
    years: number;
    workdays: number;
    weeks: number;
    hours: number;
    minutes: number;
  } | null>(null);

  // 日期加减计算相关状态
  const [baseDate, setBaseDate] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<'days' | 'months' | 'years'>('days');
  const [addResult, setAddResult] = useState<Date | null>(null);

  /**
   * 判断指定日期是否为周末（周六或周日）
   * @param date - 需要判断的日期对象
   * @returns 如果是周末返回 true，否则返回 false
   */
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  /**
   * 计算两个日期之间的工作日天数（排除周六和周日）
   * @param start - 开始日期
   * @param end - 结束日期
   * @returns 工作日天数
   */
  const calculateWorkdays = (start: Date, end: Date): number => {
    let workdays = 0;
    const current = new Date(start);
    const endTime = end.getTime();

    while (current.getTime() <= endTime) {
      if (!isWeekend(current)) {
        workdays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return workdays;
  };

  /**
   * 计算两个日期之间的差值
   * 包括总天数、月数、年数、工作日、小时数和分钟数
   */
  const calculateDifference = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    // 确保开始日期早于结束日期
    const earlier = start < end ? start : end;
    const later = start < end ? end : start;

    // 计算总天数差
    const diffTime = Math.abs(later.getTime() - earlier.getTime());
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 计算年月差
    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    // 计算工作日
    const workdays = calculateWorkdays(earlier, later);

    // 计算小时和分钟
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    const minutes = Math.floor(diffTime / (1000 * 60));

    setDiffResult({
      days,
      months: years * 12 + months,
      years,
      workdays,
      weeks: Math.floor(days / 7),
      hours,
      minutes,
    });
  };

  /**
   * 给指定日期加减时间，计算目标日期
   * 支持加减天数、月数、年数
   */
  const calculateAddSubtract = () => {
    if (!baseDate || !amount) return;

    const base = new Date(baseDate);
    if (isNaN(base.getTime())) return;

    const value = parseInt(amount);
    if (isNaN(value)) return;

    const result = new Date(base);
    const multiplier = operation === 'add' ? 1 : -1;

    switch (unit) {
      case 'days':
        result.setDate(result.getDate() + value * multiplier);
        break;
      case 'months':
        result.setMonth(result.getMonth() + value * multiplier);
        break;
      case 'years':
        result.setFullYear(result.getFullYear() + value * multiplier);
        break;
    }

    setAddResult(result);
  };

  /**
   * 格式化日期为本地字符串
   * @param date - 需要格式化的日期对象
   * @returns 格式化后的日期字符串
   */
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  /**
   * 获取今天的日期字符串（用于设置默认值）
   * @returns YYYY-MM-DD 格式的日期字符串
   */
  const getTodayString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题区域 */}
        <div className="animate-fade-in-up">
          <h1 className="font-display mb-2 text-2xl font-bold text-light-900 dark:text-dark-50">
            Date Calculator
          </h1>
          <p className="mb-6 text-sm text-light-500 dark:text-dark-200">
            Calculate the difference between two dates or add/subtract time from a date.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_DATE_1" format="horizontal" />

        {/* 模式切换标签 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card inline-flex rounded-lg p-1">
            <button
              onClick={() => setMode('diff')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                mode === 'diff'
                  ? 'bg-primary-500 text-white'
                  : 'text-light-500 dark:text-dark-200 hover:text-light-900 dark:hover:text-dark-50'
              }`}
            >
              Date Difference
            </button>
            <button
              onClick={() => setMode('add')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                mode === 'add'
                  ? 'bg-primary-500 text-white'
                  : 'text-light-500 dark:text-dark-200 hover:text-light-900 dark:hover:text-dark-50'
              }`}
            >
              Add/Subtract Date
            </button>
          </div>
        </div>

        {/* 日期差值计算模式 */}
        {mode === 'diff' && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-6">
              <h2 className="font-display mb-4 font-semibold text-light-900 dark:text-dark-50">
                Calculate Date Difference
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {/* 开始日期 */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-dark w-full rounded-lg p-3 text-sm"
                  />
                </div>

                {/* 结束日期 */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-dark w-full rounded-lg p-3 text-sm"
                  />
                </div>
              </div>

              {/* 快捷设置按钮 */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const today = getTodayString();
                    setStartDate(today);
                    setEndDate(today);
                  }}
                  className="rounded-md bg-gray-100 dark:bg-dark-600/50 px-3 py-1 text-xs text-light-500 dark:text-dark-200 transition hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setStartDate(today.toISOString().split('T')[0]);
                    setEndDate(tomorrow.toISOString().split('T')[0]);
                  }}
                  className="rounded-md bg-gray-100 dark:bg-dark-600/50 px-3 py-1 text-xs text-light-500 dark:text-dark-200 transition hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const nextWeek = new Date(today);
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setStartDate(today.toISOString().split('T')[0]);
                    setEndDate(nextWeek.toISOString().split('T')[0]);
                  }}
                  className="rounded-md bg-gray-100 dark:bg-dark-600/50 px-3 py-1 text-xs text-light-500 dark:text-dark-200 transition hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  Next Week
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const nextMonth = new Date(today);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setStartDate(today.toISOString().split('T')[0]);
                    setEndDate(nextMonth.toISOString().split('T')[0]);
                  }}
                  className="rounded-md bg-gray-100 dark:bg-dark-600/50 px-3 py-1 text-xs text-light-500 dark:text-dark-200 transition hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  Next Month
                </button>
              </div>

              <button
                onClick={calculateDifference}
                disabled={!startDate || !endDate}
                className="btn-gradient mt-4 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
              >
                Calculate Difference
              </button>

              {/* 差值结果展示 */}
              {diffResult && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 dark:bg-dark-600/30 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-400">
                      {diffResult.days}
                    </p>
                    <p className="text-xs text-light-500 dark:text-dark-200">Days</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-dark-600/30 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-400">
                      {diffResult.workdays}
                    </p>
                    <p className="text-xs text-light-500 dark:text-dark-200">Workdays</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-dark-600/30 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-400">
                      {diffResult.weeks}
                    </p>
                    <p className="text-xs text-light-500 dark:text-dark-200">Weeks</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-dark-600/30 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-400">
                      {diffResult.months}
                    </p>
                    <p className="text-xs text-light-500 dark:text-dark-200">Months</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-dark-600/30 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-400">
                      {diffResult.years}
                    </p>
                    <p className="text-xs text-light-500 dark:text-dark-200">Years</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-dark-600/30 p-4 text-center">
                    <p className="text-2xl font-bold text-primary-400">
                      {diffResult.hours.toLocaleString()}
                    </p>
                    <p className="text-xs text-light-500 dark:text-dark-200">Hours</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 日期加减计算模式 */}
        {mode === 'add' && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-6">
              <h2 className="font-display mb-4 font-semibold text-light-900 dark:text-dark-50">
                Add or Subtract from Date
              </h2>

              {/* 基础日期 */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
                  Base Date
                </label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="input-dark w-full rounded-lg p-3 text-sm"
                />
              </div>

              {/* 操作类型和数值 */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* 加减操作 */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
                    Operation
                  </label>
                  <select
                    value={operation}
                    onChange={(e) =>
                      setOperation(e.target.value as 'add' | 'subtract')
                    }
                    className="input-dark w-full rounded-lg p-3 text-sm"
                  >
                    <option value="add">Add (+)</option>
                    <option value="subtract">Subtract (-)</option>
                  </select>
                </div>

                {/* 数值 */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 30"
                    min="0"
                    className="input-dark w-full rounded-lg p-3 text-sm"
                  />
                </div>

                {/* 单位 */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-light-700 dark:text-dark-100">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) =>
                      setUnit(e.target.value as 'days' | 'months' | 'years')
                    }
                    className="input-dark w-full rounded-lg p-3 text-sm"
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              {/* 快捷设置按钮 */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setBaseDate(getTodayString())}
                  className="rounded-md bg-gray-100 dark:bg-dark-600/50 px-3 py-1 text-xs text-light-500 dark:text-dark-200 transition hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    setAmount('30');
                    setUnit('days');
                  }}
                  className="rounded-md bg-gray-100 dark:bg-dark-600/50 px-3 py-1 text-xs text-light-500 dark:text-dark-200 transition hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  30 Days
                </button>
                <button
                  onClick={() => {
                    setAmount('1');
                    setUnit('months');
                  }}
                  className="rounded-md bg-gray-100 dark:bg-dark-600/50 px-3 py-1 text-xs text-light-500 dark:text-dark-200 transition hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  1 Month
                </button>
                <button
                  onClick={() => {
                    setAmount('1');
                    setUnit('years');
                  }}
                  className="rounded-md bg-gray-100 dark:bg-dark-600/50 px-3 py-1 text-xs text-light-500 dark:text-dark-200 transition hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  1 Year
                </button>
              </div>

              <button
                onClick={calculateAddSubtract}
                disabled={!baseDate || !amount}
                className="btn-gradient mt-4 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
              >
                Calculate Result
              </button>

              {/* 加减结果展示 */}
              {addResult && (
                <div className="mt-6 rounded-lg bg-primary-500/10 p-6 text-center">
                  <p className="text-sm text-light-500 dark:text-dark-200">Result Date</p>
                  <p className="mt-2 text-2xl font-bold text-primary-400">
                    {formatDate(addResult)}
                  </p>
                  <p className="mt-1 font-mono text-sm text-light-500 dark:text-dark-200">
                    {addResult.toISOString().split('T')[0]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_DATE_2" />

        {/* 关于说明区域 */}
        <section className="mt-10 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-display mb-2 text-lg font-semibold text-light-900 dark:text-dark-50">
              About Date Calculator
            </h2>
            <p className="text-sm leading-relaxed text-light-500 dark:text-dark-200">
              This date calculator helps you quickly find the duration between two dates
              or calculate a future/past date by adding or subtracting time. It provides
              detailed results including total days, workdays (excluding weekends),
              weeks, months, and years. Useful for project planning, deadline tracking,
              and age calculations.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
