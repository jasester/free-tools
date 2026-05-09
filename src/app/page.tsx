import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';
import ToolCard from '@/components/ToolCard';

/**
 * 工具列表数据
 * 每个工具包含标题、描述、链接、图标和渐变色主题
 */
const tools = [
  {
    title: 'JSON Formatter',
    description: 'Format, validate and beautify JSON data with syntax highlighting.',
    href: '/tools/json-formatter',
    icon: '📋',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Image Compressor',
    description: 'Compress JPEG and PNG images online, reduce file size without losing quality.',
    href: '/tools/image-compress',
    icon: '🖼️',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs. Free online QR code maker.',
    href: '/tools/qr-generator',
    icon: '📱',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates instantly.',
    href: '/tools/timestamp',
    icon: '⏱️',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index. Free online BMI checker for health.',
    href: '/tools/bmi-calculator',
    icon: '💪',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    title: 'Regex Tester',
    description: 'Test and debug regular expressions online with match highlighting.',
    href: '/tools/regex-tester',
    icon: '🔍',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 to text instantly online.',
    href: '/tools/base64',
    icon: '🔐',
    gradient: 'from-fuchsia-500 to-violet-600',
  },
];

/**
 * 首页组件
 * 展示所有在线工具的入口卡片
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="tool-container mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        {/* Hero 区域 */}
        <section className="mb-16 text-center">
          {/* 标签 */}
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-dark-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            100% Free &middot; No Registration &middot; Browser-Based
          </div>

          {/* 主标题 */}
          <h1 className="animate-fade-in-up font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl" style={{ animationDelay: '0.1s' }}>
            Free Online{' '}
            <span className="gradient-text">Developer Tools</span>
          </h1>

          {/* 副标题 */}
          <p className="animate-fade-in-up mx-auto mt-5 max-w-xl text-base leading-relaxed text-dark-100 sm:text-lg" style={{ animationDelay: '0.2s' }}>
            A curated collection of essential web tools. JSON formatting, image compression,
            QR code generation and more — all running locally in your browser.
          </p>
        </section>

        {/* 广告位 */}
        <AdCard slot="YOUR_AD_SLOT_1" format="horizontal" />

        {/* 工具列表 */}
        <section className="my-12">
          <div className="mb-8 flex items-center gap-3">
            <h2 className="font-display text-lg font-semibold text-dark-50">All Tools</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
            <span className="text-xs text-dark-200">{tools.length} tools</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <div
                key={tool.href}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <ToolCard {...tool} />
              </div>
            ))}
          </div>
        </section>

        {/* 广告位 */}
        <AdCard slot="YOUR_AD_SLOT_2" format="horizontal" />

        {/* 特性介绍 */}
        <section className="mt-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="mb-8 text-center font-display text-xl font-semibold text-dark-50">
              Why FreeOnlineTools?
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {/* 特性1：快速免费 */}
              <div className="group text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-2xl transition-transform group-hover:scale-110">
                  🚀
                </div>
                <h3 className="mb-1.5 font-display font-semibold text-dark-50">Fast & Free</h3>
                <p className="text-sm leading-relaxed text-dark-100">
                  All tools are completely free with zero hidden fees. Instant results.
                </p>
              </div>

              {/* 特性2：隐私优先 */}
              <div className="group text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-2xl transition-transform group-hover:scale-110">
                  🔒
                </div>
                <h3 className="mb-1.5 font-display font-semibold text-dark-50">Privacy First</h3>
                <p className="text-sm leading-relaxed text-dark-100">
                  All processing happens in your browser. Your data never leaves your device.
                </p>
              </div>

              {/* 特性3：随处可用 */}
              <div className="group text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-2xl transition-transform group-hover:scale-110">
                  📱
                </div>
                <h3 className="mb-1.5 font-display font-semibold text-dark-50">Works Anywhere</h3>
                <p className="text-sm leading-relaxed text-dark-100">
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
