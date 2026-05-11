import Link from 'next/link';

/**
 * 工具卡片组件属性
 */
interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  /** 渐变颜色主题 */
  gradient?: string;
}

/**
 * 工具卡片组件
 * 玻璃拟态风格，带有渐变图标背景和 hover 动效
 * 支持深色/浅色模式
 */
export default function ToolCard({ title, description, href, icon, gradient = 'from-accent-blue to-accent-purple' }: ToolCardProps) {
  return (
    <Link href={href} className="group block no-underline">
      <div className="glass-card relative overflow-hidden p-6">
        {/* hover 时的渐变光效 */}
        <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />

        {/* 图标区域 */}
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-xl shadow-lg`}>
          {icon}
        </div>

        {/* 标题 */}
        <h3 className="mb-1.5 font-display text-base font-semibold text-light-900 dark:text-dark-50 transition-colors group-hover:text-accent-blue dark:group-hover:text-white">
          {title}
        </h3>

        {/* 描述 */}
        <p className="text-sm leading-relaxed text-light-600 dark:text-dark-100">
          {description}
        </p>

        {/* 底部箭头 */}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-light-500 dark:text-dark-200 transition-all group-hover:text-accent-blue group-hover:gap-2.5">
          <span>Open tool</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-0.5">
            <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}
