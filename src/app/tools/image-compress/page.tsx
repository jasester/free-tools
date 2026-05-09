'use client';

import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 图片压缩工具页面
 * 提供在线压缩 JPEG 和 PNG 图片的功能，所有处理在浏览器本地完成
 */
export default function ImageCompress() {
  const [original, setOriginal] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState('');
  const [compressedSize, setCompressedSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 格式化文件大小显示 */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  /** 处理文件上传并执行压缩 */
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginal(file);
    setOriginalSize(formatSize(file.size));
    setLoading(true);

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      });

      const reader = new FileReader();
      reader.onload = () => {
        setCompressed(reader.result as string);
        setCompressedSize(formatSize(compressedFile.size));
        setLoading(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch {
      setLoading(false);
    }
  };

  /** 下载压缩后的图片 */
  const download = () => {
    if (!compressed) return;
    const a = document.createElement('a');
    a.href = compressed;
    a.download = 'compressed.' + (original?.type === 'image/png' ? 'png' : 'jpg');
    a.click();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 text-3xl font-bold font-display text-dark-50">
            Image Compressor
          </h1>
          <p className="mb-6 text-dark-200">
            Compress JPEG and PNG images online. Reduce file size without losing quality.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_5" format="horizontal" />

        {/* 压缩控制区域 */}
        <div className="mt-6 animate-fade-in-up">
          {/* 质量滑块 */}
          <div className="glass-card mb-4 rounded-lg p-4">
            <label className="mb-2 block text-sm font-medium text-dark-100">
              Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full max-w-md accent-blue-500"
            />
          </div>

          {/* 文件上传 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFile}
            className="mb-4 block w-full max-w-md text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 file:transition text-dark-200 file:cursor-pointer cursor-pointer"
          />

          {/* 文件大小信息 */}
          {original && (
            <div className="glass-card rounded-lg p-4">
              <p className="text-sm text-dark-100">
                Original: {originalSize} → Compressed: {compressedSize}
                {originalSize && compressedSize && (
                  <span className="ml-2 font-medium text-green-400">
                    (Saved {((1 - parseFloat(compressedSize) / parseFloat(originalSize)) * 100).toFixed(1)}%)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* 加载状态 */}
          {loading && (
            <p className="mt-4 text-sm text-blue-400 animate-pulse">Compressing...</p>
          )}

          {/* 压缩预览和下载 */}
          {compressed && (
            <div className="mt-4">
              <img
                src={compressed}
                alt="Compressed preview"
                className="max-h-96 rounded-lg border border-dark-600"
              />
              <button
                onClick={download}
                className="btn-gradient mt-4 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition"
              >
                Download Compressed Image
              </button>
            </div>
          )}
        </div>

        <AdCard slot="YOUR_AD_SLOT_6" />

        {/* 关于说明卡片 */}
        <section className="glass-card mt-10 rounded-xl p-6 animate-fade-in-up">
          <h2 className="mb-2 text-lg font-semibold font-display text-dark-50">
            About Image Compressor
          </h2>
          <p className="text-sm leading-relaxed text-dark-200">
            This free online image compressor uses browser-based compression.
            Your images never leave your device. Supports JPEG and PNG formats.
            Adjust the quality slider to balance between file size and image quality.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
