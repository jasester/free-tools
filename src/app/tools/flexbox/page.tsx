'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * Flexbox 布局生成器工具页面
 * 可视化配置和预览 Flexbox 布局属性，生成对应的 CSS 代码
 * 支持深色/浅色模式
 */
export default function FlexboxGenerator() {
  // Flexbox 属性状态
  const [flexDirection, setFlexDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('flex-start');
  const [alignItems, setAlignItems] = useState<'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'>('stretch');
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('nowrap');
  const [alignContent, setAlignContent] = useState<'stretch' | 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('stretch');
  const [gap, setGap] = useState<number>(16);
  const [itemCount, setItemCount] = useState<number>(5);

  // 预设颜色数组，用于示例方块
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  /**
   * 生成 CSS 代码字符串
   * @returns 格式化的 CSS 代码
   */
  const generateCSS = (): string => {
    let css = '.container {\n';
    css += `  display: flex;\n`;
    css += `  flex-direction: ${flexDirection};\n`;
    css += `  justify-content: ${justifyContent};\n`;
    css += `  align-items: ${alignItems};\n`;
    if (flexWrap !== 'nowrap') {
      css += `  flex-wrap: ${flexWrap};\n`;
    }
    if (flexWrap !== 'nowrap' && alignContent !== 'stretch') {
      css += `  align-content: ${alignContent};\n`;
    }
    if (gap > 0) {
      css += `  gap: ${gap}px;\n`;
    }
    css += '}';
    return css;
  };

  /**
   * 复制 CSS 代码到剪贴板
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  /**
   * 获取 Flex 容器样式对象
   * @returns React CSS 属性对象
   */
  const getContainerStyle = (): React.CSSProperties => ({
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    alignContent: flexWrap !== 'nowrap' ? alignContent : undefined,
    gap: `${gap}px`,
    minHeight: '300px',
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-light-900 dark:text-dark-50">Flexbox Generator</h1>
          <p className="mb-6 text-light-600 dark:text-dark-200">可视化配置 Flexbox 布局，生成对应的 CSS 代码。</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_FLEXBOX_1" format="horizontal" />

        {/* 控制面板和预览区域 */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2 animate-fade-in-up">
          {/* 左侧：属性控制面板 */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold font-display text-light-900 dark:text-dark-50">布局属性</h2>

            {/* flex-direction 控制 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Flex Direction</label>
              <select
                value={flexDirection}
                onChange={(e) => setFlexDirection(e.target.value as typeof flexDirection)}
                className="input-dark w-full rounded-lg p-3 text-sm"
              >
                <option value="row">row (水平排列)</option>
                <option value="row-reverse">row-reverse (水平反向)</option>
                <option value="column">column (垂直排列)</option>
                <option value="column-reverse">column-reverse (垂直反向)</option>
              </select>
            </div>

            {/* justify-content 控制 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Justify Content</label>
              <select
                value={justifyContent}
                onChange={(e) => setJustifyContent(e.target.value as typeof justifyContent)}
                className="input-dark w-full rounded-lg p-3 text-sm"
              >
                <option value="flex-start">flex-start (起始对齐)</option>
                <option value="center">center (居中对齐)</option>
                <option value="flex-end">flex-end (末尾对齐)</option>
                <option value="space-between">space-between (两端对齐)</option>
                <option value="space-around">space-around (均匀分布)</option>
                <option value="space-evenly">space-evenly (等间距分布)</option>
              </select>
            </div>

            {/* align-items 控制 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Align Items</label>
              <select
                value={alignItems}
                onChange={(e) => setAlignItems(e.target.value as typeof alignItems)}
                className="input-dark w-full rounded-lg p-3 text-sm"
              >
                <option value="stretch">stretch (拉伸填充)</option>
                <option value="flex-start">flex-start (起始对齐)</option>
                <option value="center">center (居中对齐)</option>
                <option value="flex-end">flex-end (末尾对齐)</option>
                <option value="baseline">baseline (基线对齐)</option>
              </select>
            </div>

            {/* flex-wrap 控制 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Flex Wrap</label>
              <select
                value={flexWrap}
                onChange={(e) => setFlexWrap(e.target.value as typeof flexWrap)}
                className="input-dark w-full rounded-lg p-3 text-sm"
              >
                <option value="nowrap">nowrap (不换行)</option>
                <option value="wrap">wrap (换行)</option>
                <option value="wrap-reverse">wrap-reverse (反向换行)</option>
              </select>
            </div>

            {/* align-content 控制（仅在 wrap 模式下有效） */}
            {flexWrap !== 'nowrap' && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Align Content</label>
                <select
                  value={alignContent}
                  onChange={(e) => setAlignContent(e.target.value as typeof alignContent)}
                  className="input-dark w-full rounded-lg p-3 text-sm"
                >
                  <option value="stretch">stretch (拉伸填充)</option>
                  <option value="flex-start">flex-start (起始对齐)</option>
                  <option value="center">center (居中对齐)</option>
                  <option value="flex-end">flex-end (末尾对齐)</option>
                  <option value="space-between">space-between (两端对齐)</option>
                  <option value="space-around">space-around (均匀分布)</option>
                  <option value="space-evenly">space-evenly (等间距分布)</option>
                </select>
              </div>
            )}

            {/* gap 控制 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Gap (px)</label>
              <input
                type="range"
                min="0"
                max="64"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 text-right text-sm text-light-500 dark:text-dark-200">{gap}px</div>
            </div>

            {/* 项目数量控制 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-light-700 dark:text-dark-100">Item Count</label>
              <input
                type="range"
                min="1"
                max="8"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="mt-1 text-right text-sm text-light-500 dark:text-dark-200">{itemCount} items</div>
            </div>
          </div>

          {/* 右侧：预览区域 */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold font-display text-light-900 dark:text-dark-50">预览效果</h2>
            <div
              className="rounded-lg border-2 border-dashed border-black/20 dark:border-white/20 bg-light-200/50 dark:bg-dark-700/50 p-4"
              style={getContainerStyle()}
            >
              {Array.from({ length: itemCount }, (_, i) => (
                <div
                  key={i}
                  className={`flex h-16 w-16 items-center justify-center rounded-lg ${colors[i % colors.length]} text-white font-bold text-lg shadow-lg`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CSS 代码生成区域 */}
        <div className="mt-6 glass-card rounded-xl p-6 animate-fade-in-up">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold font-display text-light-900 dark:text-dark-50">生成的 CSS 代码</h2>
            <button
              onClick={copyToClipboard}
              className="btn-gradient rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              复制代码
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-light-200/80 dark:bg-dark-900/80 p-4 font-mono text-sm text-light-800 dark:text-dark-100">
            <code>{generateCSS()}</code>
          </pre>
        </div>

        <AdCard slot="YOUR_AD_SLOT_FLEXBOX_2" />

        {/* 说明文档区域 */}
        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-4 text-lg font-semibold font-display text-light-900 dark:text-dark-50">关于 Flexbox Generator</h2>
          <div className="space-y-3 text-sm leading-relaxed text-light-600 dark:text-dark-200">
            <p>
              <strong className="text-light-800 dark:text-dark-100">Flex Direction</strong> - 定义主轴方向，决定子元素的排列方向。
            </p>
            <p>
              <strong className="text-light-800 dark:text-dark-100">Justify Content</strong> - 定义子元素在主轴上的对齐方式。
            </p>
            <p>
              <strong className="text-light-800 dark:text-dark-100">Align Items</strong> - 定义子元素在交叉轴上的对齐方式。
            </p>
            <p>
              <strong className="text-light-800 dark:text-dark-100">Flex Wrap</strong> - 定义子元素是否换行。
            </p>
            <p>
              <strong className="text-light-800 dark:text-dark-100">Align Content</strong> - 定义多行子元素在交叉轴上的对齐方式（仅在换行时有效）。
            </p>
            <p>
              <strong className="text-light-800 dark:text-dark-100">Gap</strong> - 定义子元素之间的间距。
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
