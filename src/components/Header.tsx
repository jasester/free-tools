'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

/**
 * 顶部导航栏组件
 * 采用玻璃拟态风格，固定在页面顶部
 * 支持深色/浅色模式
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-white/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-dark-800/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 no-underline">
          {/* Logo 图标 */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
              <path d="M2 4L8 1L14 4V12L8 15L2 12V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 1V8M8 8L14 4M8 8L2 4M8 8V15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display text-lg font-bold text-light-900 dark:text-dark-50 transition-colors group-hover:text-accent-blue dark:group-hover:text-white">
            Free<span className="gradient-text">Tools</span>
          </span>
        </Link>

        {/* 导航链接 + 主题切换 */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-light-700 dark:text-dark-100 no-underline transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-light-900 dark:hover:text-dark-50"
          >
            Home
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-4 py-2 text-sm font-medium text-light-700 dark:text-dark-100 no-underline transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-light-900 dark:hover:text-dark-50"
          >
            GitHub
          </a>
          {/* 主题切换按钮 */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
