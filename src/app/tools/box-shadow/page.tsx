'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 预设阴影样式配置
 * 包含常用的阴影效果预设
 */
interface ShadowPreset {
  name: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

/**
 * 预设阴影样式列表
 */
const SHADOW_PRESETS: ShadowPreset[] = [
  { name: 'Subtle', x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 10 },
  { name: 'Soft', x: 0, y: 2, blur: 8, spread: 0, color: '#000000', opacity: 15 },
  { name: 'Medium', x: 0, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 20 },
  { name: 'Hard', x: 3, y: 3, blur: 0, spread: 0, color: '#000000', opacity: 30 },
  { name: 'Layered', x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 10 },
  { name: 'Glow', x: 0, y: 0, blur: 20, spread: 5, color: '#6366f1', opacity: 50 },
  { name: 'Neon', x: 0, y: 0, blur: 15, spread: 3, color: '#22d3ee', opacity: 80 },
  { name: 'Elevated', x: 10, y: 10, blur: 30, spread: -5, color: '#000000', opacity: 25 },
  { name: 'Inset', x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 10 },
  { name: 'Long', x: 0, y: 20, blur: 40, spread: 0, color: '#000000', opacity: 15 },
  { name: 'Dramatic', x: 20, y: 20, blur: 40, spread: 0, color: '#000000', opacity: 40 },
  { name: 'Floating', x: 0, y: 15, blur: 25, spread: 5, color: '#000000', opacity: 20 },
];

/**
 * CSS阴影生成器工具页面
 * 提供滑块控制阴影参数，实时预览并生成CSS代码
 */
export default function BoxShadowGenerator() {
  // 阴影参数状态
  const [horizontal, setHorizontal] = useState(10);
  const [vertical, setVertical] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  /**
   * 将不透明度转换为十六进制值
   * @param opacity 百分比不透明度 (0-100)
   * @returns 十六进制颜色值字符串
   */
  const getOpacityHex = (opacity: number): string => {
    const hex = Math.round((opacity / 100) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  /**
   * 生成CSS阴影字符串
   * @returns 完整的CSS box-shadow属性值
   */
  const getBoxShadow = (): string => {
    const opacityHex = getOpacityHex(opacity);
    const shadowColor = color + opacityHex;
    const insetStr = inset ? 'inset ' : '';
    return `${insetStr}${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColor}`;
  };

  /**
   * 复制CSS代码到剪贴板
   */
  const copyToClipboard = () => {
    const cssCode = `box-shadow: ${getBoxShadow()};`;
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * 应用预设阴影样式
   * @param preset 要应用的预设配置
   */
  const applyPreset = (preset: ShadowPreset) => {
    setHorizontal(preset.x);
    setVertical(preset.y);
    setBlur(preset.blur);
    setSpread(preset.spread);
    setColor(preset.color);
    setOpacity(preset.opacity);
  };

  // 预览容器样式
  const previewStyle = {
    boxShadow: getBoxShadow(),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-light-900 dark:text-dark-50">CSS Box Shadow Generator</h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">Create beautiful box shadows with real-time preview.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_SHADOW_1" format="horizontal" />

        {/* 实时预览区域 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-8">
            <div className="flex items-center justify-center">
              {/* 阴影预览容器 */}
              <div className="flex h-40 w-64 items-center justify-center rounded-xl bg-gray-200 dark:bg-dark-500 transition-all duration-200" style={previewStyle}>
                <span className="text-light-700 dark:text-dark-100 text-sm font-medium">Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          {/* 滑块控制区域 */}
          <div className="glass-card rounded-xl p-4 space-y-5">
            <h2 className="text-lg font-semibold font-display text-light-900 dark:text-dark-50">Shadow Controls</h2>

            {/* 水平偏移 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-light-700 dark:text-dark-100">Horizontal Offset</label>
                <span className="text-sm text-light-900 dark:text-dark-50">{horizontal}px</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={horizontal}
                onChange={(e) => setHorizontal(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-light-500 dark:text-dark-200">
                <span>-50px</span>
                <span>50px</span>
              </div>
            </div>

            {/* 垂直偏移 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-light-700 dark:text-dark-100">Vertical Offset</label>
                <span className="text-sm text-light-900 dark:text-dark-50">{vertical}px</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={vertical}
                onChange={(e) => setVertical(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-light-500 dark:text-dark-200">
                <span>-50px</span>
                <span>50px</span>
              </div>
            </div>

            {/* 模糊半径 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-light-700 dark:text-dark-100">Blur Radius</label>
                <span className="text-sm text-light-900 dark:text-dark-50">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-light-500 dark:text-dark-200">
                <span>0px</span>
                <span>100px</span>
              </div>
            </div>

            {/* 扩散半径 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-light-700 dark:text-dark-100">Spread Radius</label>
                <span className="text-sm text-light-900 dark:text-dark-50">{spread}px</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={spread}
                onChange={(e) => setSpread(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-light-500 dark:text-dark-200">
                <span>-50px</span>
                <span>50px</span>
              </div>
            </div>

            {/* 阴影颜色 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-light-700 dark:text-dark-100">Shadow Color</label>
                <span className="text-sm text-light-900 dark:text-dark-50">{color}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border-none bg-transparent"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="input-dark flex-1 rounded-lg p-2 font-mono text-sm text-light-900 dark:text-dark-50"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* 不透明度 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-light-700 dark:text-dark-100">Opacity</label>
                <span className="text-sm text-light-900 dark:text-dark-50">{opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 flex justify-between text-xs text-light-500 dark:text-dark-200">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* 内阴影选项 */}
            <div>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={inset}
                  onChange={(e) => setInset(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-dark-300 bg-gray-100 dark:bg-dark-600 text-accent-blue focus:ring-accent-blue"
                />
                <span className="text-sm text-light-700 dark:text-dark-100">Inset Shadow (inner shadow)</span>
              </label>
            </div>
          </div>

          {/* CSS代码输出区域 */}
          <div className="glass-card rounded-xl p-4 space-y-4">
            <h2 className="text-lg font-semibold font-display text-light-900 dark:text-dark-50">CSS Output</h2>

            {/* CSS代码显示 */}
            <div className="relative">
              <pre className="input-dark overflow-x-auto rounded-lg p-4 font-mono text-sm text-light-900 dark:text-dark-50 whitespace-pre-wrap break-all">
                <code>{`box-shadow: ${getBoxShadow()};`}</code>
              </pre>
            </div>

            {/* 复制按钮 */}
            <button
              onClick={copyToClipboard}
              className="btn-gradient w-full rounded-lg px-4 py-3 text-sm font-medium"
            >
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>

            {/* 完整CSS块 */}
            <div className="border-t border-gray-400 dark:border-dark-600 pt-4">
              <h3 className="mb-2 text-sm font-medium text-light-700 dark:text-dark-100">Complete CSS</h3>
              <pre className="input-dark overflow-x-auto rounded-lg p-4 font-mono text-xs text-light-900 dark:text-dark-50 whitespace-pre-wrap">
                <code>{`.element {
  box-shadow: ${getBoxShadow()};
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* 预设阴影样式 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <h2 className="mb-4 text-lg font-semibold font-display text-light-900 dark:text-dark-50">Shadow Presets</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {SHADOW_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="glass-card-hover rounded-lg p-3 text-center transition-all hover:scale-105"
                >
                  {/* 预设预览 */}
                  <div
                    className="mx-auto mb-2 h-10 w-10 rounded-lg bg-gray-200 dark:bg-dark-500"
                    style={{
                      boxShadow: `${preset.color}${getOpacityHex(preset.opacity)} ${preset.x}px ${preset.y}px ${preset.blur}px ${preset.spread}px`,
                    }}
                  />
                  <span className="text-xs text-light-500 dark:text-dark-200">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_SHADOW_2" />

        {/* 使用说明 */}
        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-light-900 dark:text-dark-50">How to Use</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-light-500 dark:text-dark-200">
            <li>Use the sliders to adjust shadow parameters in real-time</li>
            <li>Horizontal and Vertical offset control the shadow direction</li>
            <li>Blur radius makes the shadow softer (higher = more blurry)</li>
            <li>Spread radius expands or shrinks the shadow size</li>
            <li>Check &quot;Inset&quot; to create an inner shadow effect</li>
            <li>Click any preset to quickly apply a shadow style</li>
            <li>Copy the generated CSS code and use it in your stylesheets</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
