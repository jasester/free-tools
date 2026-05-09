'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 颜色转换器工具页面
 * 支持 HEX、RGB、HSL 颜色格式之间的相互转换
 */
export default function ColorConverter() {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const handleColorChange = (value: string, type: 'hex' | 'rgb' | 'hsl') => {
    if (type === 'hex') {
      setHex(value);
      const rgbVal = hexToRgb(value);
      if (rgbVal) {
        setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
        const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
        setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
      }
    } else if (type === 'rgb') {
      const match = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
        setRgb(value);
        setHex(rgbToHex(r, g, b));
        const hslVal = rgbToHsl(r, g, b);
        setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
      }
    } else if (type === 'hsl') {
      const match = value.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
      if (match) {
        const h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3]);
        setHsl(value);
        const rgbVal = hslToRgb(h, s, l);
        setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
        setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-dark-50">Color Converter</h1>
          <p className="mb-6 text-dark-200">Convert between HEX, RGB and HSL color formats instantly.</p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_COLOR_1" format="horizontal" />

        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card h-40 w-full rounded-xl border-2 border-dashed" style={{ backgroundColor: hex }} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <label className="mb-2 block text-sm font-medium text-dark-100">HEX</label>
            <input type="text" value={hex} onChange={(e) => handleColorChange(e.target.value, 'hex')} className="input-dark w-full rounded-lg p-3 font-mono text-sm text-dark-50" placeholder="#000000" />
            <button onClick={() => copyToClipboard(hex)} className="btn-ghost mt-2 w-full rounded-lg px-4 py-2 text-sm">Copy</button>
          </div>
          <div className="glass-card rounded-xl p-4">
            <label className="mb-2 block text-sm font-medium text-dark-100">RGB</label>
            <input type="text" value={rgb} onChange={(e) => handleColorChange(e.target.value, 'rgb')} className="input-dark w-full rounded-lg p-3 font-mono text-sm text-dark-50" placeholder="rgb(0, 0, 0)" />
            <button onClick={() => copyToClipboard(rgb)} className="btn-ghost mt-2 w-full rounded-lg px-4 py-2 text-sm">Copy</button>
          </div>
          <div className="glass-card rounded-xl p-4">
            <label className="mb-2 block text-sm font-medium text-dark-100">HSL</label>
            <input type="text" value={hsl} onChange={(e) => handleColorChange(e.target.value, 'hsl')} className="input-dark w-full rounded-lg p-3 font-mono text-sm text-dark-50" placeholder="hsl(0, 0%, 0%)" />
            <button onClick={() => copyToClipboard(hsl)} className="btn-ghost mt-2 w-full rounded-lg px-4 py-2 text-sm">Copy</button>
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_COLOR_2" />

        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-dark-50">About Color Converter</h2>
          <p className="text-sm leading-relaxed text-dark-200">Convert between HEX, RGB, and HSL color formats instantly in your browser. Perfect for web developers and designers.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
