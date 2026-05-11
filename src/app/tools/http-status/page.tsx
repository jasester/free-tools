'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * HTTP 状态码查询工具页面
 * 提供 HTTP 状态码查询和详细信息展示
 */

/**
 * HTTP 状态码信息接口
 */
interface HttpStatusInfo {
  code: number;
  name: string;
  description: string;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  details: string;
}

/**
 * HTTP 状态码数据库
 */
const httpStatuses: HttpStatusInfo[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: '继续', category: '1xx', details: '服务器已收到请求头，客户端应继续发送请求体' },
  { code: 101, name: 'Switching Protocols', description: '切换协议', category: '1xx', details: '服务器同意切换协议，如从 HTTP 升级到 WebSocket' },
  { code: 102, name: 'Processing', description: '处理中', category: '1xx', details: '服务器正在处理请求，用于 WebDAV' },
  { code: 103, name: 'Early Hints', description: '早期提示', category: '1xx', details: '用于在最终响应之前返回一些响应头' },

  // 2xx Success
  { code: 200, name: 'OK', description: '成功', category: '2xx', details: '请求已成功处理' },
  { code: 201, name: 'Created', description: '已创建', category: '2xx', details: '请求已成功处理，并创建了新的资源' },
  { code: 202, name: 'Accepted', description: '已接受', category: '2xx', details: '请求已被接受，但尚未处理完成' },
  { code: 203, name: 'Non-Authoritative Information', description: '非授权信息', category: '2xx', details: '服务器成功处理了请求，但返回的信息来自其他来源' },
  { code: 204, name: 'No Content', description: '无内容', category: '2xx', details: '服务器成功处理了请求，但没有返回内容' },
  { code: 205, name: 'Reset Content', description: '重置内容', category: '2xx', details: '服务器成功处理了请求，要求客户端重置文档视图' },
  { code: 206, name: 'Partial Content', description: '部分内容', category: '2xx', details: '服务器成功处理了部分 GET 请求' },
  { code: 207, name: 'Multi-Status', description: '多状态', category: '2xx', details: '响应包含多个状态代码，用于 WebDAV' },
  { code: 208, name: 'Already Reported', description: '已报告', category: '2xx', details: '避免在 WebDAV 响应中重复枚举内部成员' },
  { code: 226, name: 'IM Used', description: 'IM 已使用', category: '2xx', details: '服务器已完成对资源的 GET 请求，响应是实例操作的表示' },

  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', description: '多种选择', category: '3xx', details: '请求的资源有多种表示形式' },
  { code: 301, name: 'Moved Permanently', description: '永久移动', category: '3xx', details: '请求的资源已被永久移动到新的 URL' },
  { code: 302, name: 'Found', description: '临时移动', category: '3xx', details: '请求的资源临时位于不同的 URL' },
  { code: 303, name: 'See Other', description: '查看其他', category: '3xx', details: '客户端应使用 GET 方法访问另一个 URL' },
  { code: 304, name: 'Not Modified', description: '未修改', category: '3xx', details: '资源自上次请求以来未被修改' },
  { code: 305, name: 'Use Proxy', description: '使用代理', category: '3xx', details: '请求的资源必须通过代理访问（已弃用）' },
  { code: 307, name: 'Temporary Redirect', description: '临时重定向', category: '3xx', details: '请求的资源临时位于不同的 URL，应使用相同的方法' },
  { code: 308, name: 'Permanent Redirect', description: '永久重定向', category: '3xx', details: '请求的资源永久位于不同的 URL，应使用相同的方法' },

  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: '错误请求', category: '4xx', details: '服务器无法理解请求的语法' },
  { code: 401, name: 'Unauthorized', description: '未授权', category: '4xx', details: '请求需要用户身份验证' },
  { code: 402, name: 'Payment Required', description: '需要付款', category: '4xx', details: '保留供将来使用' },
  { code: 403, name: 'Forbidden', description: '禁止访问', category: '4xx', details: '服务器拒绝执行请求' },
  { code: 404, name: 'Not Found', description: '未找到', category: '4xx', details: '服务器找不到请求的资源' },
  { code: 405, name: 'Method Not Allowed', description: '方法不允许', category: '4xx', details: '请求方法被禁用' },
  { code: 406, name: 'Not Acceptable', description: '不可接受', category: '4xx', details: '服务器无法根据请求的内容特性完成请求' },
  { code: 407, name: 'Proxy Authentication Required', description: '需要代理认证', category: '4xx', details: '客户端必须先使用代理进行身份验证' },
  { code: 408, name: 'Request Timeout', description: '请求超时', category: '4xx', details: '服务器等待客户端发送请求的时间过长' },
  { code: 409, name: 'Conflict', description: '冲突', category: '4xx', details: '请求与服务器当前状态冲突' },
  { code: 410, name: 'Gone', description: '已删除', category: '4xx', details: '请求的资源已永久删除' },
  { code: 411, name: 'Length Required', description: '需要长度', category: '4xx', details: '服务器拒绝接受没有 Content-Length 头的请求' },
  { code: 412, name: 'Precondition Failed', description: '前提条件失败', category: '4xx', details: '服务器未满足请求中设置的其中一个前提条件' },
  { code: 413, name: 'Payload Too Large', description: '请求实体过大', category: '4xx', details: '请求的数据量超过服务器处理能力' },
  { code: 414, name: 'URI Too Long', description: 'URI 过长', category: '4xx', details: '请求的 URI 过长，服务器无法处理' },
  { code: 415, name: 'Unsupported Media Type', description: '不支持的媒体类型', category: '4xx', details: '请求的媒体格式不受支持' },
  { code: 416, name: 'Range Not Satisfiable', description: '范围不满足', category: '4xx', details: '请求的范围无法满足' },
  { code: 417, name: 'Expectation Failed', description: '期望失败', category: '4xx', details: '服务器无法满足 Expect 请求头的要求' },
  { code: 418, name: "I'm a teapot", description: '我是茶壶', category: '4xx', details: 'RFC 2324 定义的彩蛋状态码' },
  { code: 421, name: 'Misdirected Request', description: '错误定向请求', category: '4xx', details: '请求被定向到无法生成响应的服务器' },
  { code: 422, name: 'Unprocessable Entity', description: '不可处理的实体', category: '4xx', details: '请求格式正确但包含语义错误' },
  { code: 423, name: 'Locked', description: '已锁定', category: '4xx', details: '正在访问的资源被锁定' },
  { code: 424, name: 'Failed Dependency', description: '依赖失败', category: '4xx', details: '由于前一个请求失败，当前请求也失败' },
  { code: 425, name: 'Too Early', description: '太早', category: '4xx', details: '服务器不愿意冒险处理可能被重播的请求' },
  { code: 426, name: 'Upgrade Required', description: '需要升级', category: '4xx', details: '客户端应切换到升级后的协议' },
  { code: 428, name: 'Precondition Required', description: '需要前提条件', category: '4xx', details: '服务器要求请求必须是条件性的' },
  { code: 429, name: 'Too Many Requests', description: '请求过多', category: '4xx', details: '客户端发送了太多请求，被限流' },
  { code: 431, name: 'Request Header Fields Too Large', description: '请求头字段过大', category: '4xx', details: '请求头字段过大，服务器无法处理' },
  { code: 451, name: 'Unavailable For Legal Reasons', description: '因法律原因不可用', category: '4xx', details: '由于法律原因无法提供资源' },

  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: '服务器内部错误', category: '5xx', details: '服务器遇到错误，无法完成请求' },
  { code: 501, name: 'Not Implemented', description: '尚未实现', category: '5xx', details: '服务器不具备完成请求的功能' },
  { code: 502, name: 'Bad Gateway', description: '错误网关', category: '5xx', details: '网关或代理从上游服务器收到无效响应' },
  { code: 503, name: 'Service Unavailable', description: '服务不可用', category: '5xx', details: '服务器暂时无法处理请求' },
  { code: 504, name: 'Gateway Timeout', description: '网关超时', category: '5xx', details: '网关或代理未及时从上游服务器收到响应' },
  { code: 505, name: 'HTTP Version Not Supported', description: '不支持的 HTTP 版本', category: '5xx', details: '服务器不支持请求中使用的 HTTP 版本' },
  { code: 506, name: 'Variant Also Negotiates', description: '变体也协商', category: '5xx', details: '服务器存在内部配置错误' },
  { code: 507, name: 'Insufficient Storage', description: '存储空间不足', category: '5xx', details: '服务器无法存储完成请求所需的内容' },
  { code: 508, name: 'Loop Detected', description: '检测到循环', category: '5xx', details: '服务器检测到无限循环' },
  { code: 510, name: 'Not Extended', description: '未扩展', category: '5xx', details: '服务器需要对请求进行进一步扩展' },
  { code: 511, name: 'Network Authentication Required', description: '需要网络认证', category: '5xx', details: '客户端需要进行网络认证才能获得网络访问权限' },
];

/**
 * 状态码类别配置
 */
const categories = [
  { id: 'all', name: 'All', label: '全部', color: 'bg-gray-200/50 dark:bg-dark-500/50 text-light-700 dark:text-dark-100' },
  { id: '1xx', name: '1xx Info', label: '信息', color: 'bg-blue-500/20 text-blue-400' },
  { id: '2xx', name: '2xx Success', label: '成功', color: 'bg-emerald-500/20 text-emerald-400' },
  { id: '3xx', name: '3xx Redirect', label: '重定向', color: 'bg-amber-500/20 text-amber-400' },
  { id: '4xx', name: '4xx Client', label: '客户端错误', color: 'bg-rose-500/20 text-rose-400' },
  { id: '5xx', name: '5xx Server', label: '服务器错误', color: 'bg-purple-500/20 text-purple-400' },
] as const;

/**
 * HTTP 状态码查询组件
 */
export default function HttpStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<HttpStatusInfo | null>(null);

  /**
   * 过滤状态码列表
   */
  const filteredStatuses = httpStatuses.filter((status) => {
    const matchesCategory = activeCategory === 'all' || status.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      status.code.toString().includes(searchQuery) ||
      status.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      status.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  /**
   * 获取状态码样式
   */
  const getStatusStyle = (category: string) => {
    const styles: Record<string, string> = {
      '1xx': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      '2xx': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      '3xx': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      '4xx': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      '5xx': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return styles[category] || styles['5xx'];
  };

  /**
   * 获取类别颜色
   */
  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || 'bg-gray-200/50 dark:bg-dark-500/50 text-light-700 dark:text-dark-100';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            HTTP Status Code Lookup
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Look up HTTP status codes and their meanings. Complete reference for all standard HTTP response codes.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_HTTP_1" format="horizontal" />

        {/* 选中的状态码详情 */}
        {selectedStatus && (
          <div className="mt-6 animate-fade-in-up">
            <div className={`glass-card rounded-xl border-2 p-6 ${getStatusStyle(selectedStatus.category)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold">{selectedStatus.code}</span>
                    <span className={`rounded-full px-3 py-1 text-xs ${getCategoryColor(selectedStatus.category)}`}>
                      {selectedStatus.category}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-semibold">{selectedStatus.name}</h2>
                  <p className="text-lg opacity-90">{selectedStatus.description}</p>
                </div>
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="rounded-full p-2 hover:bg-white/10"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 rounded-lg bg-gray-100/50 dark:bg-dark-900/30 p-4">
                <p className="text-sm opacity-80">{selectedStatus.details}</p>
              </div>
            </div>
          </div>
        )}

        {/* 分类筛选 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeCategory === cat.id
                      ? 'btn-gradient text-white'
                      : 'btn-ghost text-light-700 dark:text-dark-100 hover:text-light-900 dark:hover:text-dark-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mt-4 animate-fade-in-up">
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-3 px-3">
              <svg className="h-5 w-5 text-light-500 dark:text-dark-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search status codes (e.g., 404, not found)..."
                className="flex-1 bg-transparent py-2 text-light-900 dark:text-dark-50 placeholder:text-light-400 dark:placeholder:text-dark-200 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-light-500 dark:text-dark-200 hover:text-light-900 dark:hover:text-dark-50">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 状态码列表 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-light-900 dark:text-dark-50">
                HTTP Status Codes
              </h3>
              <span className="text-sm text-light-500 dark:text-dark-200">
                {filteredStatuses.length} codes
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStatuses.map((status) => (
                <button
                  key={status.code}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition hover:opacity-80 ${getStatusStyle(status.category)}`}
                >
                  <span className="text-2xl font-bold">{status.code}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{status.name}</div>
                    <div className="truncate text-xs opacity-80">{status.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {filteredStatuses.length === 0 && (
              <div className="py-12 text-center">
                <div className="mb-2 text-4xl">🔍</div>
                <p className="text-light-500 dark:text-dark-200">No status codes found matching your search</p>
              </div>
            )}
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_HTTP_2" />

        {/* 状态码类别说明 */}
        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            HTTP Status Code Classes
          </h2>
          <div className="grid gap-4 text-sm text-light-500 dark:text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <span className="inline-block w-12 rounded bg-blue-500/20 px-2 py-0.5 text-center text-blue-400">1xx</span>
                <strong className="ml-2 text-light-700 dark:text-dark-100">Informational:</strong>
                <br />
                请求已被接收，继续处理
              </p>
              <p className="mb-2">
                <span className="inline-block w-12 rounded bg-emerald-500/20 px-2 py-0.5 text-center text-emerald-400">2xx</span>
                <strong className="ml-2 text-light-700 dark:text-dark-100">Success:</strong>
                <br />
                请求已成功被服务器接收、理解并接受
              </p>
              <p className="mb-2">
                <span className="inline-block w-12 rounded bg-amber-500/20 px-2 py-0.5 text-center text-amber-400">3xx</span>
                <strong className="ml-2 text-light-700 dark:text-dark-100">Redirection:</strong>
                <br />
                需要客户端采取进一步操作才能完成请求
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="inline-block w-12 rounded bg-rose-500/20 px-2 py-0.5 text-center text-rose-400">4xx</span>
                <strong className="ml-2 text-light-700 dark:text-dark-100">Client Error:</strong>
                <br />
                请求包含语法错误或无法完成请求
              </p>
              <p className="mb-2">
                <span className="inline-block w-12 rounded bg-purple-500/20 px-2 py-0.5 text-center text-purple-400">5xx</span>
                <strong className="ml-2 text-light-700 dark:text-dark-100">Server Error:</strong>
                <br />
                服务器在处理请求时发生错误
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">RFC Reference:</strong>
                <br />
                HTTP/1.1: RFC 7231, HTTP/2: RFC 7540
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
