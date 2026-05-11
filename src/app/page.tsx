'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';
import ToolCard from '@/components/ToolCard';

/**
 * 工具分类类型
 */
type ToolCategory = 'all' | 'developer' | 'converter' | 'security' | 'utility';

/**
 * 工具数据定义
 */
interface Tool {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  category: ToolCategory;
  tags: string[];
}

/**
 * 所有工具列表
 */
const tools: Tool[] = [
  // 开发者工具
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format, validate and beautify JSON data with syntax highlighting.',
    href: '/tools/json-formatter',
    icon: '📋',
    gradient: 'from-blue-500 to-indigo-600',
    category: 'developer',
    tags: ['json', 'format', 'validate', 'developer'],
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test and debug regular expressions online with match highlighting.',
    href: '/tools/regex-tester',
    icon: '🔍',
    gradient: 'from-cyan-500 to-blue-600',
    category: 'developer',
    tags: ['regex', 'regular expression', 'test', 'developer'],
  },
  {
    id: 'base64',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 to text instantly online.',
    href: '/tools/base64',
    icon: '🔐',
    gradient: 'from-fuchsia-500 to-violet-600',
    category: 'developer',
    tags: ['base64', 'encode', 'decode', 'developer'],
  },
  {
    id: 'html-entity',
    title: 'HTML Entity Encoder',
    description: 'Encode and decode HTML entities for special characters.',
    href: '/tools/html-entity',
    icon: '🔣',
    gradient: 'from-orange-400 to-amber-500',
    category: 'developer',
    tags: ['html', 'entity', 'encode', 'decode', 'developer'],
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 hashes from text input.',
    href: '/tools/hash-generator',
    icon: '#️⃣',
    gradient: 'from-gray-500 to-slate-600',
    category: 'developer',
    tags: ['hash', 'md5', 'sha', 'generator', 'developer'],
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode and verify JSON Web Tokens to view payload data.',
    href: '/tools/jwt-decoder',
    icon: '🎫',
    gradient: 'from-pink-500 to-rose-500',
    category: 'developer',
    tags: ['jwt', 'token', 'decode', 'developer'],
  },
  {
    id: 'markdown-preview',
    title: 'Markdown Preview',
    description: 'Live preview Markdown rendering with split-screen editor.',
    href: '/tools/markdown-preview',
    icon: '📝',
    gradient: 'from-slate-500 to-gray-600',
    category: 'developer',
    tags: ['markdown', 'preview', 'editor', 'developer'],
  },
  {
    id: 'text-diff',
    title: 'Text Diff',
    description: 'Compare two texts and highlight differences between them.',
    href: '/tools/text-diff',
    icon: '⚖️',
    gradient: 'from-cyan-500 to-teal-500',
    category: 'developer',
    tags: ['diff', 'compare', 'text', 'developer'],
  },
  // 转换工具
  {
    id: 'timestamp',
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates instantly.',
    href: '/tools/timestamp',
    icon: '⏱️',
    gradient: 'from-amber-500 to-orange-600',
    category: 'converter',
    tags: ['timestamp', 'date', 'time', 'converter'],
  },
  {
    id: 'csv-json',
    title: 'CSV to JSON',
    description: 'Convert between CSV and JSON formats easily.',
    href: '/tools/csv-json',
    icon: '📊',
    gradient: 'from-green-500 to-emerald-600',
    category: 'converter',
    tags: ['csv', 'json', 'convert', 'converter'],
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Convert text between camelCase, snake_case, PascalCase and more.',
    href: '/tools/case-converter',
    icon: 'Aa',
    gradient: 'from-yellow-500 to-amber-500',
    category: 'converter',
    tags: ['case', 'convert', 'camelCase', 'snake_case', 'converter'],
  },
  {
    id: 'number-base',
    title: 'Number Base Converter',
    description: 'Convert between binary, octal, decimal, and hexadecimal.',
    href: '/tools/number-base',
    icon: '🔢',
    gradient: 'from-indigo-400 to-purple-500',
    category: 'converter',
    tags: ['number', 'base', 'binary', 'hex', 'converter'],
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert between HEX, RGB and HSL color formats instantly.',
    href: '/tools/color-converter',
    icon: '🎨',
    gradient: 'from-pink-500 to-rose-600',
    category: 'converter',
    tags: ['color', 'hex', 'rgb', 'hsl', 'converter', 'design'],
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder/Decoder',
    description: 'Encode or decode URL strings instantly online.',
    href: '/tools/url-encoder',
    icon: '🔗',
    gradient: 'from-teal-500 to-emerald-600',
    category: 'converter',
    tags: ['url', 'encode', 'decode', 'converter'],
  },
  // 安全工具
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong, secure passwords with custom options.',
    href: '/tools/password-generator',
    icon: '🔑',
    gradient: 'from-red-500 to-pink-600',
    category: 'security',
    tags: ['password', 'security', 'generator', 'random'],
  },
  // 实用工具
  {
    id: 'image-compress',
    title: 'Image Compressor',
    description: 'Compress JPEG and PNG images online, reduce file size without losing quality.',
    href: '/tools/image-compress',
    icon: '🖼️',
    gradient: 'from-emerald-500 to-teal-600',
    category: 'utility',
    tags: ['image', 'compress', 'jpg', 'png', 'optimize'],
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs. Free online QR code maker.',
    href: '/tools/qr-generator',
    icon: '📱',
    gradient: 'from-violet-500 to-purple-600',
    category: 'utility',
    tags: ['qr', 'code', 'generator', 'scan'],
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index. Free online BMI checker for health.',
    href: '/tools/bmi-calculator',
    icon: '💪',
    gradient: 'from-rose-500 to-pink-600',
    category: 'utility',
    tags: ['bmi', 'health', 'calculator', 'fitness'],
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate random UUID/GUID identifiers for your applications.',
    href: '/tools/uuid-generator',
    icon: '🔮',
    gradient: 'from-purple-500 to-indigo-600',
    category: 'utility',
    tags: ['uuid', 'guid', 'generator', 'identifier'],
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum',
    description: 'Generate placeholder text for your designs and layouts.',
    href: '/tools/lorem-ipsum',
    icon: '📄',
    gradient: 'from-gray-400 to-slate-500',
    category: 'utility',
    tags: ['lorem', 'ipsum', 'text', 'placeholder', 'generator'],
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences and paragraphs in your text.',
    href: '/tools/word-counter',
    icon: '🔤',
    gradient: 'from-blue-400 to-indigo-500',
    category: 'utility',
    tags: ['word', 'count', 'character', 'text', 'statistics'],
  },
  {
    id: 'text-processor',
    title: 'Text Processor',
    description: 'Remove duplicates, sort lines, reverse text and more operations.',
    href: '/tools/text-processor',
    icon: '🔄',
    gradient: 'from-teal-400 to-cyan-500',
    category: 'utility',
    tags: ['text', 'process', 'sort', 'duplicate', 'reverse'],
  },
  // 新增工具
  {
    id: 'useragent-generator',
    title: 'UserAgent Generator',
    description: 'Generate random UserAgent strings for testing and development.',
    href: '/tools/useragent-generator',
    icon: '🌐',
    gradient: 'from-sky-500 to-blue-600',
    category: 'developer',
    tags: ['useragent', 'ua', 'browser', 'random', 'testing'],
  },
  {
    id: 'js-html-minifier',
    title: 'JS/HTML Minifier',
    description: 'Minify or format JavaScript and HTML code instantly.',
    href: '/tools/js-html-minifier',
    icon: '⚡',
    gradient: 'from-yellow-500 to-amber-600',
    category: 'developer',
    tags: ['javascript', 'html', 'minify', 'format', 'compress'],
  },
  {
    id: 'css-minifier',
    title: 'CSS Minifier',
    description: 'Minify or format CSS code instantly.',
    href: '/tools/css-minifier',
    icon: '🎨',
    gradient: 'from-indigo-500 to-violet-600',
    category: 'developer',
    tags: ['css', 'minify', 'format', 'beautify', 'stylesheet'],
  },
  {
    id: 'xml-formatter',
    title: 'XML Formatter',
    description: 'Format, minify and sort XML nodes alphabetically.',
    href: '/tools/xml-formatter',
    icon: '📄',
    gradient: 'from-lime-500 to-green-600',
    category: 'developer',
    tags: ['xml', 'format', 'sort', 'minify', 'beautify'],
  },
  {
    id: 'sql-formatter',
    title: 'SQL Formatter',
    description: 'Minify or format SQL queries with proper indentation.',
    href: '/tools/sql-formatter',
    icon: '🗃️',
    gradient: 'from-orange-500 to-red-600',
    category: 'developer',
    tags: ['sql', 'format', 'minify', 'beautify', 'query'],
  },
  // 新增工具
  {
    id: 'cron-parser',
    title: 'Cron Parser',
    description: 'Parse and generate Cron expressions for scheduled tasks.',
    href: '/tools/cron-parser',
    icon: '⏰',
    gradient: 'from-amber-500 to-orange-600',
    category: 'developer',
    tags: ['cron', 'schedule', 'parser', 'developer'],
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between length, weight, temperature, area, volume and more.',
    href: '/tools/unit-converter',
    icon: '📐',
    gradient: 'from-teal-500 to-cyan-600',
    category: 'converter',
    tags: ['unit', 'converter', 'length', 'weight', 'temperature'],
  },
  {
    id: 'port-scanner',
    title: 'Port Scanner',
    description: 'Look up common network ports and their services.',
    href: '/tools/port-scanner',
    icon: '🔌',
    gradient: 'from-indigo-500 to-blue-600',
    category: 'developer',
    tags: ['port', 'network', 'scanner', 'developer'],
  },
  {
    id: 'http-status',
    title: 'HTTP Status Codes',
    description: 'Look up HTTP status codes and their meanings.',
    href: '/tools/http-status',
    icon: '🌐',
    gradient: 'from-violet-500 to-purple-600',
    category: 'developer',
    tags: ['http', 'status', 'code', 'developer'],
  },
  // 新增工具
  {
    id: 'json-yaml',
    title: 'JSON ↔ YAML',
    description: 'Convert between JSON and YAML formats easily.',
    href: '/tools/json-yaml',
    icon: '📋',
    gradient: 'from-teal-500 to-cyan-600',
    category: 'developer',
    tags: ['json', 'yaml', 'convert', 'developer'],
  },
  {
    id: 'keyboard-tester',
    title: 'Keyboard Tester',
    description: 'Test keyboard keys and see their codes in real-time.',
    href: '/tools/keyboard-tester',
    icon: '⌨️',
    gradient: 'from-slate-500 to-gray-600',
    category: 'developer',
    tags: ['keyboard', 'test', 'keycode', 'developer'],
  },
  {
    id: 'mouse-tracker',
    title: 'Mouse Tracker',
    description: 'Track mouse coordinates and movement in real-time.',
    href: '/tools/mouse-tracker',
    icon: '🖱️',
    gradient: 'from-pink-500 to-rose-600',
    category: 'developer',
    tags: ['mouse', 'coordinates', 'tracker', 'developer'],
  },
  {
    id: 'box-shadow',
    title: 'Box Shadow Generator',
    description: 'Generate CSS box-shadow with live preview.',
    href: '/tools/box-shadow',
    icon: '🎨',
    gradient: 'from-amber-500 to-orange-600',
    category: 'developer',
    tags: ['css', 'shadow', 'generator', 'developer'],
  },
  {
    id: 'flexbox',
    title: 'Flexbox Generator',
    description: 'Visual Flexbox layout generator with CSS code.',
    href: '/tools/flexbox',
    icon: '📐',
    gradient: 'from-emerald-500 to-green-600',
    category: 'developer',
    tags: ['flexbox', 'css', 'layout', 'developer'],
  },
  {
    id: 'screen-info',
    title: 'Screen Info',
    description: 'Display screen resolution, window size and device info.',
    href: '/tools/screen-info',
    icon: '📺',
    gradient: 'from-blue-500 to-indigo-600',
    category: 'utility',
    tags: ['screen', 'resolution', 'display', 'utility'],
  },
  {
    id: 'random-generator',
    title: 'Random Generator',
    description: 'Generate random numbers, passwords, colors and more.',
    href: '/tools/random-generator',
    icon: '🎲',
    gradient: 'from-purple-500 to-violet-600',
    category: 'utility',
    tags: ['random', 'generator', 'password', 'utility'],
  },
  {
    id: 'date-calculator',
    title: 'Date Calculator',
    description: 'Calculate date differences and add/subtract time.',
    href: '/tools/date-calculator',
    icon: '📅',
    gradient: 'from-rose-500 to-pink-600',
    category: 'utility',
    tags: ['date', 'calculator', 'time', 'utility'],
  },
];

/**
 * 分类配置
 */
const categories: { id: ToolCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Tools', icon: '📦' },
  { id: 'developer', label: 'Developer', icon: '💻' },
  { id: 'converter', label: 'Converter', icon: '🔄' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'utility', label: 'Utility', icon: '🛠️' },
];

/**
 * 首页组件
 * 支持深色/浅色模式
 */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * 根据分类和搜索词过滤工具
   */
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 分类过滤
      const categoryMatch = activeCategory === 'all' || tool.category === activeCategory;

      // 搜索过滤
      const searchLower = searchQuery.toLowerCase().trim();
      const searchMatch = !searchLower ||
        tool.title.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchLower));

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="tool-container mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        {/* Hero 区域 */}
        <section className="mb-12 text-center">
          {/* 标签 */}
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] px-4 py-1.5 text-xs font-medium text-light-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-dark-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {tools.length} Free Tools &middot; No Registration &middot; Browser-Based
          </div>

          {/* 主标题 */}
          <h1 className="animate-fade-in-up font-display text-4xl font-extrabold leading-tight tracking-tight text-light-900 dark:text-white sm:text-5xl md:text-6xl" style={{ animationDelay: '0.1s' }}>
            Free Online{' '}
            <span className="gradient-text">Developer Tools</span>
          </h1>

          {/* 副标题 */}
          <p className="animate-fade-in-up mx-auto mt-5 max-w-xl text-base leading-relaxed text-light-600 dark:text-dark-100 sm:text-lg" style={{ animationDelay: '0.2s' }}>
            A curated collection of essential web tools. JSON formatting, image compression,
            QR code generation and more — all running locally in your browser.
          </p>
        </section>

        {/* 广告位 */}
        <AdCard slot="YOUR_AD_SLOT_1" format="horizontal" />

        {/* 搜索框 */}
        <section className="mb-8 animate-fade-in-up">
          <div className="glass-card rounded-xl p-2">
            <div className="flex items-center gap-3 px-4">
              <svg className="h-5 w-5 text-light-400 dark:text-dark-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools... (e.g., json, password, color)"
                className="flex-1 bg-transparent py-3 text-light-900 dark:text-dark-50 placeholder:text-light-400 dark:placeholder:text-dark-200 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-light-400 dark:text-dark-200 hover:text-light-600 dark:hover:text-dark-100"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 分类标签 */}
        <section className="mb-8 animate-fade-in-up">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'btn-gradient text-white'
                    : 'btn-ghost text-light-600 dark:text-dark-100 hover:text-light-900 dark:hover:text-dark-50'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
                <span className="ml-1 rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5 text-xs">
                  {category.id === 'all'
                    ? tools.length
                    : tools.filter(t => t.category === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 工具列表 */}
        <section className="my-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              {activeCategory === 'all' ? 'All Tools' : categories.find(c => c.id === activeCategory)?.label}
            </h2>
            <span className="text-sm text-light-500 dark:text-dark-200">
              {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </span>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ToolCard
                    title={tool.title}
                    description={tool.description}
                    href={tool.href}
                    icon={tool.icon}
                    gradient={tool.gradient}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="mb-2 text-lg font-semibold text-light-900 dark:text-dark-50">No tools found</h3>
              <p className="text-light-500 dark:text-dark-200">Try adjusting your search or category filter</p>
            </div>
          )}
        </section>

        {/* 广告位 */}
        <AdCard slot="YOUR_AD_SLOT_2" format="horizontal" />

        {/* 特性介绍 */}
        <section className="mt-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="mb-8 text-center font-display text-xl font-semibold text-light-900 dark:text-dark-50">
              Why FreeOnlineTools?
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="group text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-2xl transition-transform group-hover:scale-110">
                  🚀
                </div>
                <h3 className="mb-1.5 font-display font-semibold text-light-900 dark:text-dark-50">Fast & Free</h3>
                <p className="text-sm leading-relaxed text-light-600 dark:text-dark-100">
                  All tools are completely free with zero hidden fees. Instant results.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-2xl transition-transform group-hover:scale-110">
                  🔒
                </div>
                <h3 className="mb-1.5 font-display font-semibold text-light-900 dark:text-dark-50">Privacy First</h3>
                <p className="text-sm leading-relaxed text-light-600 dark:text-dark-100">
                  All processing happens in your browser. Your data never leaves your device.
                </p>
              </div>

              <div className="group text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-2xl transition-transform group-hover:scale-110">
                  📱
                </div>
                <h3 className="mb-1.5 font-display font-semibold text-light-900 dark:text-dark-50">Works Anywhere</h3>
                <p className="text-sm leading-relaxed text-light-600 dark:text-dark-100">
                  Use on desktop, tablet, or mobile. Fully responsive design.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
