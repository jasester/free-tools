'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 端口扫描器工具页面
 * 提供常用端口查询和端口状态检测功能
 */

/**
 * 端口信息接口
 */
interface PortInfo {
  port: number;
  protocol: 'TCP' | 'UDP' | 'Both';
  service: string;
  description: string;
  category: 'common' | 'web' | 'database' | 'mail' | 'remote' | 'game' | 'other';
}

/**
 * 常用端口数据库
 */
const commonPorts: PortInfo[] = [
  // Web 服务
  { port: 80, protocol: 'TCP', service: 'HTTP', description: '超文本传输协议', category: 'web' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', description: '安全超文本传输协议', category: 'web' },
  { port: 8080, protocol: 'TCP', service: 'HTTP Alternate', description: 'HTTP 替代端口', category: 'web' },
  { port: 8443, protocol: 'TCP', service: 'HTTPS Alternate', description: 'HTTPS 替代端口', category: 'web' },
  { port: 3000, protocol: 'TCP', service: 'React/Node Dev', description: 'React/Node.js 开发服务器', category: 'web' },
  { port: 5173, protocol: 'TCP', service: 'Vite Dev', description: 'Vite 开发服务器', category: 'web' },
  { port: 8000, protocol: 'TCP', service: 'Django/HTTP', description: 'Django 开发服务器', category: 'web' },

  // 数据库
  { port: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQL 数据库', category: 'database' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQL 数据库', category: 'database' },
  { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDB 数据库', category: 'database' },
  { port: 6379, protocol: 'TCP', service: 'Redis', description: 'Redis 缓存数据库', category: 'database' },
  { port: 1433, protocol: 'TCP', service: 'MSSQL', description: 'Microsoft SQL Server', category: 'database' },
  { port: 1521, protocol: 'TCP', service: 'Oracle', description: 'Oracle 数据库', category: 'database' },
  { port: 9200, protocol: 'TCP', service: 'Elasticsearch', description: 'Elasticsearch 搜索引擎', category: 'database' },

  // 邮件服务
  { port: 25, protocol: 'TCP', service: 'SMTP', description: '简单邮件传输协议', category: 'mail' },
  { port: 587, protocol: 'TCP', service: 'SMTP Submission', description: 'SMTP 提交端口', category: 'mail' },
  { port: 465, protocol: 'TCP', service: 'SMTPS', description: '安全 SMTP', category: 'mail' },
  { port: 110, protocol: 'TCP', service: 'POP3', description: '邮局协议 v3', category: 'mail' },
  { port: 995, protocol: 'TCP', service: 'POP3S', description: '安全 POP3', category: 'mail' },
  { port: 143, protocol: 'TCP', service: 'IMAP', description: '互联网消息访问协议', category: 'mail' },
  { port: 993, protocol: 'TCP', service: 'IMAPS', description: '安全 IMAP', category: 'mail' },

  // 远程访问
  { port: 22, protocol: 'TCP', service: 'SSH', description: '安全外壳协议', category: 'remote' },
  { port: 23, protocol: 'TCP', service: 'Telnet', description: '远程登录协议', category: 'remote' },
  { port: 3389, protocol: 'TCP', service: 'RDP', description: '远程桌面协议', category: 'remote' },
  { port: 5900, protocol: 'TCP', service: 'VNC', description: '虚拟网络计算', category: 'remote' },

  // 常用服务
  { port: 21, protocol: 'TCP', service: 'FTP', description: '文件传输协议', category: 'common' },
  { port: 20, protocol: 'TCP', service: 'FTP Data', description: 'FTP 数据传输', category: 'common' },
  { port: 53, protocol: 'Both', service: 'DNS', description: '域名系统', category: 'common' },
  { port: 123, protocol: 'UDP', service: 'NTP', description: '网络时间协议', category: 'common' },
  { port: 161, protocol: 'UDP', service: 'SNMP', description: '简单网络管理协议', category: 'common' },
  { port: 445, protocol: 'TCP', service: 'SMB', description: '服务器消息块', category: 'common' },

  // 游戏服务器
  { port: 25565, protocol: 'TCP', service: 'Minecraft', description: 'Minecraft 服务器', category: 'game' },
  { port: 27015, protocol: 'Both', service: 'Source Engine', description: 'Source 引擎游戏', category: 'game' },
  { port: 7777, protocol: 'UDP', service: 'Unreal Engine', description: '虚幻引擎游戏', category: 'game' },
  { port: 28960, protocol: 'UDP', service: 'Call of Duty', description: '使命召唤', category: 'game' },

  // 其他
  { port: 1194, protocol: 'UDP', service: 'OpenVPN', description: 'OpenVPN', category: 'other' },
  { port: 1723, protocol: 'TCP', service: 'PPTP', description: '点对点隧道协议', category: 'other' },
  { port: 500, protocol: 'UDP', service: 'IKEv2/IPSec', description: 'IPSec VPN', category: 'other' },
  { port: 4500, protocol: 'UDP', service: 'IPSec NAT-T', description: 'IPSec NAT 穿越', category: 'other' },
  { port: 5060, protocol: 'Both', service: 'SIP', description: '会话初始协议', category: 'other' },
  { port: 5672, protocol: 'TCP', service: 'AMQP', description: '高级消息队列协议', category: 'other' },
  { port: 9092, protocol: 'TCP', service: 'Kafka', description: 'Apache Kafka', category: 'other' },
];

/**
 * 端口类别配置
 */
const categories = [
  { id: 'all', name: 'All', label: '全部' },
  { id: 'web', name: 'Web', label: 'Web' },
  { id: 'database', name: 'Database', label: '数据库' },
  { id: 'mail', name: 'Mail', label: '邮件' },
  { id: 'remote', name: 'Remote', label: '远程' },
  { id: 'common', name: 'Common', label: '常用' },
  { id: 'game', name: 'Game', label: '游戏' },
  { id: 'other', name: 'Other', label: '其他' },
] as const;

/**
 * 端口扫描器组件
 */
export default function PortScanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customPort, setCustomPort] = useState('');
  const [customPortInfo, setCustomPortInfo] = useState<PortInfo | null>(null);

  /**
   * 过滤端口列表
   */
  const filteredPorts = commonPorts.filter((port) => {
    const matchesCategory = activeCategory === 'all' || port.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      port.port.toString().includes(searchQuery) ||
      port.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      port.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /**
   * 查询自定义端口
   */
  const queryCustomPort = () => {
    const portNum = parseInt(customPort, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      setCustomPortInfo(null);
      return;
    }

    const found = commonPorts.find((p) => p.port === portNum);
    if (found) {
      setCustomPortInfo(found);
    } else {
      setCustomPortInfo({
        port: portNum,
        protocol: 'TCP',
        service: 'Unknown',
        description: '未记录的端口',
        category: 'other',
      });
    }
  };

  /**
   * 获取类别标签样式
   */
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      web: 'bg-blue-500/20 text-blue-400',
      database: 'bg-emerald-500/20 text-emerald-400',
      mail: 'bg-amber-500/20 text-amber-400',
      remote: 'bg-purple-500/20 text-purple-400',
      common: 'bg-cyan-500/20 text-cyan-400',
      game: 'bg-rose-500/20 text-rose-400',
      other: 'bg-gray-500/20 text-gray-400',
    };
    return styles[category] || styles.other;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-dark-50">
            Port Scanner & Lookup
          </h1>
          <p className="mb-6 text-dark-200">
            Look up common port numbers and their services. Reference guide for network ports.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_PORT_1" format="horizontal" />

        {/* 自定义端口查询 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-dark-50">
              Port Lookup
            </h3>
            <div className="flex gap-3">
              <input
                type="number"
                value={customPort}
                onChange={(e) => setCustomPort(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && queryCustomPort()}
                className="input-dark flex-1 rounded-lg px-4 py-3 text-dark-50"
                placeholder="Enter port number (1-65535)"
                min="1"
                max="65535"
              />
              <button
                onClick={queryCustomPort}
                className="btn-gradient rounded-lg px-6 py-3 text-sm font-medium text-white"
              >
                Lookup
              </button>
            </div>

            {customPortInfo && (
              <div className="mt-4 rounded-lg border border-white/10 bg-dark-600/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-emerald-400">{customPortInfo.port}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-dark-50">{customPortInfo.service}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${getCategoryStyle(customPortInfo.category)}`}>
                        {customPortInfo.category}
                      </span>
                    </div>
                    <div className="text-sm text-dark-200">{customPortInfo.description}</div>
                    <div className="mt-1 text-xs text-dark-300">
                      Protocol: <span className="text-dark-100">{customPortInfo.protocol}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

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
                      : 'btn-ghost text-dark-100 hover:text-dark-50'
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
              <svg className="h-5 w-5 text-dark-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ports, services..."
                className="flex-1 bg-transparent py-2 text-dark-50 placeholder:text-dark-200 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-dark-200 hover:text-dark-50">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 端口列表 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-dark-50">
                Common Ports
              </h3>
              <span className="text-sm text-dark-200">
                {filteredPorts.length} ports
              </span>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {filteredPorts.map((port) => (
                <div
                  key={port.port}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-dark-600/30 p-3 transition hover:border-white/10 hover:bg-dark-500/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dark-500/50 font-mono text-lg font-bold text-emerald-400">
                    {port.port}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-dark-50">{port.service}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${getCategoryStyle(port.category)}`}>
                        {port.category}
                      </span>
                    </div>
                    <div className="truncate text-xs text-dark-200">{port.description}</div>
                    <div className="mt-0.5 text-xs text-dark-300">{port.protocol}</div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPorts.length === 0 && (
              <div className="py-12 text-center">
                <div className="mb-2 text-4xl">🔍</div>
                <p className="text-dark-200">No ports found matching your search</p>
              </div>
            )}
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_PORT_2" />

        {/* 端口范围说明 */}
        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-dark-50">
            Port Number Ranges
          </h2>
          <div className="grid gap-4 text-sm text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <strong className="text-dark-100">Well-Known Ports (0-1023):</strong>
                <br />
                系统保留端口，需要管理员权限
              </p>
              <p className="mb-2">
                <strong className="text-dark-100">Registered Ports (1024-49151):</strong>
                <br />
                注册端口，用于用户应用程序
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-dark-100">Dynamic Ports (49152-65535):</strong>
                <br />
                动态/私有端口，临时使用
              </p>
              <p className="mb-2">
                <strong className="text-dark-100">Note:</strong>
                <br />
                此工具仅提供端口信息查询，不执行实际端口扫描
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
