'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * BMI 计算器页面组件
 * 提供身高体重输入，计算并展示 BMI 值及分类
 */
export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  /** 根据 BMI 值计算并返回分类信息 */
  const calculate = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;
    setBmi(Math.round((w / (h * h)) * 10) / 10);
  };

  /** 根据 BMI 数值返回对应的分类标签和颜色样式 */
  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (bmi < 25) return { label: 'Normal weight', color: 'text-green-400', bg: 'bg-green-500/10' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    return { label: 'Obese', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const category = bmi ? getCategory(bmi) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-2 animate-fade-in-up font-display text-2xl font-bold text-dark-50">
          BMI Calculator
        </h1>
        <p className="mb-6 animate-fade-in-up text-dark-200">
          Calculate your Body Mass Index (BMI) online for free.
        </p>

        <AdCard slot="YOUR_AD_SLOT_11" format="horizontal" />

        <div className="mt-6 max-w-md animate-fade-in-up">
          <div className="glass-card rounded-lg p-6">
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-dark-100">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 170"
                className="input-dark w-full rounded-lg p-3 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-dark-100">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 65"
                className="input-dark w-full rounded-lg p-3 text-sm"
              />
            </div>
            <button
              onClick={calculate}
              className="btn-gradient w-full rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
            >
              Calculate BMI
            </button>

            {bmi !== null && category && (
              <div className={`mt-4 rounded-lg ${category.bg} p-4 text-center`}>
                <p className={`text-3xl font-bold ${category.color}`}>{bmi}</p>
                <p className={`mt-1 font-medium ${category.color}`}>{category.label}</p>
              </div>
            )}
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_12" />

        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-2 font-display text-lg font-semibold text-dark-50">
            BMI Categories
          </h2>
          <div className="mt-3 space-y-2 text-sm text-dark-100">
            <div className="flex justify-between rounded bg-blue-500/10 px-3 py-2">
              <span>Underweight</span><span>&lt; 18.5</span>
            </div>
            <div className="flex justify-between rounded bg-green-500/10 px-3 py-2">
              <span>Normal weight</span><span>18.5 - 24.9</span>
            </div>
            <div className="flex justify-between rounded bg-yellow-500/10 px-3 py-2">
              <span>Overweight</span><span>25 - 29.9</span>
            </div>
            <div className="flex justify-between rounded bg-red-500/10 px-3 py-2">
              <span>Obese</span><span>&ge; 30</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
