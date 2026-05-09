/**
 * SEO 配置
 * 为每个工具页面定义独立的 metadata
 */

export interface ToolSEO {
  title: string;
  description: string;
  keywords: string[];
}

/**
 * 所有工具的 SEO 配置
 */
export const toolsSEO: Record<string, ToolSEO> = {
  'json-formatter': {
    title: 'JSON Formatter - Free Online JSON Validator & Beautifier',
    description: 'Free online JSON formatter to beautify, validate and minify JSON data. Format JSON with syntax highlighting and error detection.',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'online json tool', 'json parser'],
  },
  'image-compress': {
    title: 'Image Compressor - Free Online Image Optimization Tool',
    description: 'Compress JPEG and PNG images online for free. Reduce image file size without losing quality. Fast browser-based compression.',
    keywords: ['image compressor', 'compress jpg', 'compress png', 'image optimizer', 'reduce image size'],
  },
  'qr-generator': {
    title: 'QR Code Generator - Free Online QR Code Maker',
    description: 'Generate QR codes from text or URLs for free. Customizable QR code generator with instant download. No registration required.',
    keywords: ['qr code generator', 'qr code maker', 'create qr code', 'free qr code', 'qr generator'],
  },
  'timestamp': {
    title: 'Timestamp Converter - Unix Timestamp to Date Converter',
    description: 'Convert between Unix timestamps and human-readable dates instantly. Free online timestamp converter with timezone support.',
    keywords: ['timestamp converter', 'unix timestamp', 'epoch converter', 'date to timestamp', 'timestamp to date'],
  },
  'bmi-calculator': {
    title: 'BMI Calculator - Free Body Mass Index Calculator',
    description: 'Calculate your Body Mass Index (BMI) for free. Online BMI calculator with health categories and weight recommendations.',
    keywords: ['bmi calculator', 'body mass index', 'bmi checker', 'calculate bmi', 'bmi chart'],
  },
  'regex-tester': {
    title: 'Regex Tester - Online Regular Expression Tester',
    description: 'Test and debug regular expressions online with real-time match highlighting. Free regex tester with common pattern library.',
    keywords: ['regex tester', 'regular expression', 'regex online', 'test regex', 'regex debugger'],
  },
  'base64': {
    title: 'Base64 Encoder/Decoder - Free Online Base64 Tool',
    description: 'Encode text to Base64 or decode Base64 to text instantly. Free online Base64 encoder and decoder tool.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 online', 'encode base64', 'decode base64'],
  },
  'color-converter': {
    title: 'Color Converter - HEX, RGB, HSL Color Converter',
    description: 'Convert between HEX, RGB and HSL color formats instantly. Free online color converter for web developers and designers.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'color picker', 'web colors'],
  },
  'url-encoder': {
    title: 'URL Encoder/Decoder - Free Online URL Encoding Tool',
    description: 'Encode or decode URL strings instantly. Free online URL encoder and decoder for web development.',
    keywords: ['url encoder', 'url decoder', 'url encoding', 'encode url', 'decode url'],
  },
  'password-generator': {
    title: 'Password Generator - Strong Secure Password Generator',
    description: 'Generate strong, secure passwords with custom options. Free password generator with strength indicator and copy feature.',
    keywords: ['password generator', 'strong password', 'secure password', 'random password', 'password maker'],
  },
};

/**
 * 获取工具的 SEO 配置
 */
export function getToolSEO(toolId: string): ToolSEO {
  return toolsSEO[toolId] || {
    title: 'Free Online Tool - FreeOnlineTools',
    description: 'Free online tool for developers and everyday use. Browser-based, no registration required.',
    keywords: ['free online tool', 'developer tool', 'web tool'],
  };
}
