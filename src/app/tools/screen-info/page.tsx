'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 屏幕分辨率检测工具页面
 * 实时显示屏幕、窗口和文档的尺寸信息，以及设备像素比和颜色信息
 */

/**
 * 屏幕信息接口
 */
interface ScreenInfo {
  /** 屏幕宽度 */
  screenWidth: number;
  /** 屏幕高度 */
  screenHeight: number;
  /** 屏幕可用宽度（减去任务栏等） */
  screenAvailWidth: number;
  /** 屏幕可用高度（减去任务栏等） */
  screenAvailHeight: number;
  /** 浏览器窗口内部宽度 */
  windowInnerWidth: number;
  /** 浏览器窗口内部高度 */
  windowInnerHeight: number;
  /** 浏览器窗口外部宽度 */
  windowOuterWidth: number;
  /** 浏览器窗口外部高度 */
  windowOuterHeight: number;
  /** 文档页面宽度 */
  documentWidth: number;
  /** 文档页面高度 */
  documentHeight: number;
  /** 文档可视区域宽度 */
  documentClientWidth: number;
  /** 文档可视区域高度 */
  documentClientHeight: number;
  /** 设备像素比 */
  devicePixelRatio: number;
  /** 屏幕颜色深度 */
  colorDepth: number;
  /** 屏幕像素深度 */
  pixelDepth: number;
  /** 屏幕方向 */
  screenOrientation: string;
  /** 屏幕色域信息 */
  colorGamut: string;
}

/**
 * 屏幕分辨率检测组件
 */
export default function ScreenInfo() {
  // 屏幕信息状态
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    screenWidth: 0,
    screenHeight: 0,
    screenAvailWidth: 0,
    screenAvailHeight: 0,
    windowInnerWidth: 0,
    windowInnerHeight: 0,
    windowOuterWidth: 0,
    windowOuterHeight: 0,
    documentWidth: 0,
    documentHeight: 0,
    documentClientWidth: 0,
    documentClientHeight: 0,
    devicePixelRatio: 1,
    colorDepth: 24,
    pixelDepth: 24,
    screenOrientation: 'landscape-primary',
    colorGamut: 'unknown',
  });

  // 是否正在实时更新
  const [isUpdating, setIsUpdating] = useState(true);

  /**
   * 获取屏幕色域信息
   * @returns 色域类型字符串
   */
  const getColorGamut = useCallback((): string => {
    if (typeof window === 'undefined') return 'unknown';
    
    // 使用 matchMedia 检测色域支持
    if (window.matchMedia('(color-gamut: rec2020)').matches) {
      return 'Rec. 2020';
    }
    if (window.matchMedia('(color-gamut: p3)').matches) {
      return 'DCI-P3';
    }
    if (window.matchMedia('(color-gamut: srgb)').matches) {
      return 'sRGB';
    }
    return 'Standard';
  }, []);

  /**
   * 获取屏幕方向信息
   * @returns 屏幕方向字符串
   */
  const getScreenOrientation = useCallback((): string => {
    if (typeof window === 'undefined') return 'unknown';
    
    const orientation = screen.orientation;
    if (orientation) {
      return orientation.type || 'unknown';
    }
    // 备用方案：根据宽高判断
    return screen.width > screen.height ? 'landscape-primary' : 'portrait-primary';
  }, []);

  /**
   * 更新屏幕信息
   */
  const updateScreenInfo = useCallback(() => {
    if (typeof window === 'undefined') return;

    setScreenInfo({
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenAvailWidth: screen.availWidth,
      screenAvailHeight: screen.availHeight,
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight,
      windowOuterWidth: window.outerWidth,
      windowOuterHeight: window.outerHeight,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      documentClientWidth: document.documentElement.clientWidth,
      documentClientHeight: document.documentElement.clientHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      colorDepth: screen.colorDepth || 24,
      pixelDepth: screen.pixelDepth || 24,
      screenOrientation: getScreenOrientation(),
      colorGamut: getColorGamut(),
    });
  }, [getScreenOrientation, getColorGamut]);

  /**
   * 切换实时更新状态
   */
  const toggleUpdating = () => {
    setIsUpdating(!isUpdating);
  };

  /**
   * 复制信息到剪贴板
   * @param label 标签
   * @param value 值
   */
  const copyToClipboard = (label: string, value: string | number) => {
    navigator.clipboard.writeText(`${label}: ${value}`);
  };

  /**
   * 初始化并设置事件监听
   */
  useEffect(() => {
    // 初始更新
    updateScreenInfo();

    // 窗口大小变化监听
    const handleResize = () => {
      if (isUpdating) {
        updateScreenInfo();
      }
    };

    // 屏幕方向变化监听
    const handleOrientationChange = () => {
      if (isUpdating) {
        updateScreenInfo();
      }
    };

    window.addEventListener('resize', handleResize);
    
    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    }

    // 定时更新（用于捕获某些动态变化）
    const intervalId = setInterval(() => {
      if (isUpdating) {
        updateScreenInfo();
      }
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange);
      }
      clearInterval(intervalId);
    };
  }, [isUpdating, updateScreenInfo]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            Screen Resolution Detector
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Real-time display of screen, window, and document dimensions with device pixel ratio and color information.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_SCREEN_1" format="horizontal" />

        {/* 控制按钮 */}
        <div className="mt-6 flex flex-wrap gap-3 animate-fade-in-up">
          <button
            onClick={toggleUpdating}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isUpdating
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isUpdating ? '🟢 Live Update' : '🔴 Paused'}
          </button>
          <button
            onClick={updateScreenInfo}
            className="btn-ghost rounded-lg px-4 py-2 text-sm font-medium"
          >
            Refresh Now
          </button>
        </div>

        {/* 屏幕分辨率信息 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Screen Resolution
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Screen Width', screenInfo.screenWidth)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Width</span>
                <span className="font-mono text-lg text-emerald-400">{screenInfo.screenWidth}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Screen Height', screenInfo.screenHeight)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Height</span>
                <span className="font-mono text-lg text-emerald-400">{screenInfo.screenHeight}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Available Width', screenInfo.screenAvailWidth)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Avail Width</span>
                <span className="font-mono text-lg text-blue-400">{screenInfo.screenAvailWidth}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Available Height', screenInfo.screenAvailHeight)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Avail Height</span>
                <span className="font-mono text-lg text-blue-400">{screenInfo.screenAvailHeight}px</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Screen resolution represents your monitor&apos;s physical pixel dimensions. Available dimensions exclude system UI elements like taskbars.
            </p>
          </div>
        </div>

        {/* 浏览器窗口大小 */}
        <div className="mt-4 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Browser Window Size
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Inner Width', screenInfo.windowInnerWidth)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Inner Width</span>
                <span className="font-mono text-lg text-purple-400">{screenInfo.windowInnerWidth}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Inner Height', screenInfo.windowInnerHeight)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Inner Height</span>
                <span className="font-mono text-lg text-purple-400">{screenInfo.windowInnerHeight}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Outer Width', screenInfo.windowOuterWidth)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Outer Width</span>
                <span className="font-mono text-lg text-amber-400">{screenInfo.windowOuterWidth}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Outer Height', screenInfo.windowOuterHeight)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Outer Height</span>
                <span className="font-mono text-lg text-amber-400">{screenInfo.windowOuterHeight}px</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Inner dimensions represent the viewport (content area). Outer dimensions include browser chrome (toolbars, scrollbars).
            </p>
          </div>
        </div>

        {/* 文档页面尺寸 */}
        <div className="mt-4 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Document Page Dimensions
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Document Width', screenInfo.documentWidth)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Scroll Width</span>
                <span className="font-mono text-lg text-cyan-400">{screenInfo.documentWidth}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Document Height', screenInfo.documentHeight)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Scroll Height</span>
                <span className="font-mono text-lg text-cyan-400">{screenInfo.documentHeight}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Client Width', screenInfo.documentClientWidth)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Client Width</span>
                <span className="font-mono text-lg text-pink-400">{screenInfo.documentClientWidth}px</span>
              </div>
              <div 
                className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600/70 transition"
                onClick={() => copyToClipboard('Client Height', screenInfo.documentClientHeight)}
              >
                <span className="text-sm text-light-500 dark:text-dark-200">Client Height</span>
                <span className="font-mono text-lg text-pink-400">{screenInfo.documentClientHeight}px</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Scroll dimensions include the entire document including overflow. Client dimensions represent the visible viewport area.
            </p>
          </div>
        </div>

        {/* 设备像素比和颜色信息 */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2 animate-fade-in-up">
          {/* 设备像素比 */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Device Pixel Ratio
            </h3>
            <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-4">
              <span className="text-sm text-light-500 dark:text-dark-200">Pixel Ratio (DPR)</span>
              <span className="font-mono text-2xl text-rose-400">{screenInfo.devicePixelRatio}x</span>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Device Pixel Ratio indicates how many physical pixels correspond to one CSS pixel. 
              Higher values (2x, 3x) are common on Retina/HiDPI displays for sharper rendering.
            </p>
          </div>

          {/* 颜色信息 */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Color Information
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">Color Depth</span>
                <span className="font-mono text-lg text-indigo-400">{screenInfo.colorDepth}-bit</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">Pixel Depth</span>
                <span className="font-mono text-lg text-indigo-400">{screenInfo.pixelDepth}-bit</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">Color Gamut</span>
                <span className="font-mono text-lg text-teal-400">{screenInfo.colorGamut}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Color depth indicates bits per pixel. Color gamut shows the range of colors your display can reproduce.
            </p>
          </div>
        </div>

        {/* 屏幕方向 */}
        <div className="mt-4 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Screen Orientation
            </h3>
            <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-4">
              <span className="text-sm text-light-500 dark:text-dark-200">Current Orientation</span>
              <span className="font-mono text-lg text-orange-400">{screenInfo.screenOrientation}</span>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Screen orientation changes when you rotate your device or resize the browser window across aspect ratio thresholds.
            </p>
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_SCREEN_2" />

        {/* 使用说明 */}
        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            About Screen Resolution
          </h2>
          <div className="grid gap-4 text-sm text-light-500 dark:text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Screen Resolution:</strong> The physical pixel dimensions of your monitor or display device.
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Window Size:</strong> The dimensions of the browser window, including or excluding UI elements.
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Document Size:</strong> The dimensions of the web page content, including scrolled areas.
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Device Pixel Ratio:</strong> Scale factor between CSS pixels and physical device pixels.
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Color Depth:</strong> Number of bits used to represent the color of a single pixel.
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Color Gamut:</strong> The range of colors that can be displayed (sRGB, P3, Rec. 2020).
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
