'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * GitHub 仓库配置
 */
const GITHUB_REPO = 'jasester/free-tools';

/**
 * ErrorBoundary 组件的 Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * ErrorBoundary 组件的 State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 生成 GitHub Issue 反馈链接
 * 将错误信息预填充到新 Issue 的标题和正文中
 * @param error 错误对象
 * @param errorInfo React 错误信息
 * @returns GitHub 新建 Issue 的 URL
 */
function buildIssueUrl(error: Error | null, errorInfo: ErrorInfo | null): string {
  const timestamp = new Date().toISOString();
  const url = typeof window !== 'undefined' ? window.location.href : 'unknown';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';

  const title = `[Bug Report] ${error?.message || 'Unknown error'}`;

  const body = [
    '## Bug Description',
    '',
    'An error occurred while using the tool.',
    '',
    '## Error Details',
    '',
    `- **Message**: \`${error?.message || 'N/A'}\``,
    `- **URL**: ${url}`,
    `- **Time**: ${timestamp}`,
    `- **User Agent**: ${userAgent}`,
    '',
    '## Stack Trace',
    '',
    '```',
    error?.stack || 'No stack trace available',
    '```',
    '',
    '## Component Stack',
    '',
    '```',
    errorInfo?.componentStack || 'No component stack available',
    '```',
  ].join('\n');

  return `https://github.com/${GITHUB_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=bug`;
}

/**
 * 全局错误捕获组件
 * 捕获 React 渲染错误，显示友好的错误提示页面
 * 提供「Report Issue」按钮，一键跳转到 GitHub Issues 提交 bug
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * 捕获子组件渲染抛出的错误
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * 记录错误详细信息
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // 可在此处扩展：发送错误日志到第三方服务
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  /**
   * 重置错误状态，重新渲染子组件
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  /**
   * 跳转到 GitHub Issues 提交 bug
   */
  handleReport = () => {
    const url = buildIssueUrl(this.state.error, this.state.errorInfo);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg text-center">
            {/* 错误图标 */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* 标题 */}
            <h1 className="mb-3 font-display text-2xl font-bold text-light-900 dark:text-dark-50">
              Oops! Something went wrong
            </h1>

            {/* 说明 */}
            <p className="mb-6 text-sm leading-relaxed text-light-600 dark:text-dark-100">
              An unexpected error occurred. You can try reloading the page, or help us fix it by reporting this issue.
            </p>

            {/* 错误信息（可折叠） */}
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-xs font-medium text-light-500 dark:text-dark-200 hover:text-light-700 dark:hover:text-dark-100">
                  View error details
                </summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-light-200/80 p-3 text-xs text-light-800 dark:bg-dark-900/80 dark:text-dark-100">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {/* 重新加载按钮 */}
              <button
                onClick={this.handleReset}
                className="rounded-lg bg-light-200 px-5 py-2.5 text-sm font-medium text-light-900 transition-all hover:bg-light-300 dark:bg-dark-600 dark:text-dark-50 dark:hover:bg-dark-500"
              >
                Try Again
              </button>

              {/* 回到首页按钮 */}
              <a
                href="/"
                className="rounded-lg bg-light-200 px-5 py-2.5 text-sm font-medium text-light-900 no-underline transition-all hover:bg-light-300 dark:bg-dark-600 dark:text-dark-50 dark:hover:bg-dark-500"
              >
                Go Home
              </a>

              {/* 报告问题按钮 */}
              <button
                onClick={this.handleReport}
                className="btn-gradient flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Report Issue
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
