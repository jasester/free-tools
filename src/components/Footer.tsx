/**
 * 页脚组件
 * 简约风格，包含版权信息和链接
 */
export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/[0.06] bg-dark-800/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* 左侧 Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-accent-blue to-accent-purple">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-white">
                <path d="M2 4L8 1L14 4V12L8 15L2 12V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display text-sm font-semibold text-dark-100">
              FreeTools
            </span>
          </div>

          {/* 中间文案 */}
          <p className="text-xs text-dark-200">
            &copy; {new Date().getFullYear()} FreeOnlineTools. All rights reserved.
          </p>

          {/* 右侧链接 */}
          <div className="flex items-center gap-4 text-xs text-dark-200">
            <span className="transition-colors hover:text-dark-100 cursor-pointer">Privacy</span>
            <span className="transition-colors hover:text-dark-100 cursor-pointer">Terms</span>
            <span className="transition-colors hover:text-dark-100 cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
