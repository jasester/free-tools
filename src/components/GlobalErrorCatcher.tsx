'use client';

import { useEffect, useState } from 'react';

/**
 * GitHub 仓库配置
 */
const GITHUB_REPO = 'jasester/free-tools';

/**
 * 收集的环境信息
 */
interface ErrorContext {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
}

/**
 * 全局错误捕获组件
 * 监听 window.onerror 和 unhandledrejection 事件
 * 捕获非 React 渲染错误（如资源加载失败、异步 Promise 错误等）
 * 在页面右下角显示浮动反馈按钮，点击可跳转 GitHub Issues
 */
export default function GlobalErrorCatcher() {
  const [lastError, setLastError] = useState<ErrorContext | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    /**
     * 捕获同步错误（如脚本错误、资源加载失败）
     */
    const handleError = (
      message: string | Event,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error,
    ) => {
      const errorMsg = typeof message === 'string' ? message : (message as ErrorEvent).message || 'Unknown error';
      const errCtx: ErrorContext = {
        message: errorMsg,
        source: source || '',
        lineno: lineno || 0,
        colno: colno || 0,
        stack: error?.stack || '',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      setLastError(errCtx);
      console.error('[GlobalErrorCatcher]', errCtx);
    };

    /**
     * 捕获未处理的 Promise rejection
     */
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const errCtx: ErrorContext = {
        message: reason?.message || String(reason) || 'Unhandled Promise Rejection',
        stack: reason?.stack || '',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      setLastError(errCtx);
      console.error('[GlobalErrorCatcher] Unhandled rejection:', errCtx);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  /**
   * 生成 GitHub Issue URL
   */
  const buildIssueUrl = (): string => {
    if (!lastError) return `https://github.com/${GITHUB_REPO}/issues/new?labels=bug`;

    const title = `[Bug Report] ${lastError.message.slice(0, 80)}`;
    const body = [
      '## Bug Description',
      '',
      'An error occurred while using the tool.',
      '',
      '## Error Details',
      '',
      `- **Message**: \`${lastError.message}\``,
      `- **Source**: ${lastError.source || 'N/A'}:${lastError.lineno}:${lastError.colno}`,
      `- **URL**: ${lastError.url}`,
      `- **Time**: ${lastError.timestamp}`,
      `- **User Agent**: ${lastError.userAgent}`,
      '',
      '## Stack Trace',
      '',
      '```',
      lastError.stack || 'No stack trace available',
      '```',
    ].join('\n');

    return `https://github.com/${GITHUB_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=bug`;
  };

  /**
   * 忽略当前错误
   */
  const handleDismiss = () => {
    setLastError(null);
    setShowPanel(false);
  };

  // 没有错误时不渲染
  if (!lastError) return null;

  return (
    <>
      {/* 浮动错误提示按钮 */}
      {!showPanel && (
        <button
          onClick={() => setShowPanel(true)}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-red-600 hover:shadow-xl"
          title="An error occurred - Click to view details"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Error Detected
        </button>
      )}

      {/* 错误详情面板 */}
      {showPanel && (
        <div className="fixed bottom-6 right-6 z-[100] w-80 rounded-xl border border-black/[0.08] bg-white p-4 shadow-2xl dark:border-white/[0.06] dark:bg-dark-600">
          {/* 面板标题 */}
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-light-900 dark:text-dark-50">
              Error Detected
            </h3>
            <button
              onClick={handleDismiss}
              className="text-light-400 hover:text-light-600 dark:text-dark-200 dark:hover:text-dark-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 错误信息 */}
          <p className="mb-3 text-xs leading-relaxed text-light-600 dark:text-dark-100 break-all">
            {lastError.message}
          </p>

          {/* 环境信息 */}
          <div className="mb-4 space-y-1 text-xs text-light-400 dark:text-dark-200">
            <p>Page: {lastError.url}</p>
            <p>Time: {lastError.timestamp}</p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 rounded-lg bg-light-200 px-3 py-2 text-xs font-medium text-light-700 transition-all hover:bg-light-300 dark:bg-dark-500 dark:text-dark-100 dark:hover:bg-dark-400"
            >
              Dismiss
            </button>
            <a
              href={buildIssueUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white no-underline"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Report
            </a>
          </div>
        </div>
      )}
    </>
  );
}
