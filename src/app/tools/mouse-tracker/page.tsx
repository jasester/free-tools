'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 鼠标坐标检测器工具页面
 * 实时显示鼠标在屏幕、窗口和页面中的坐标位置，记录点击事件和移动轨迹
 */

/**
 * 鼠标坐标信息接口
 */
interface MousePosition {
  /** 相对于屏幕的X坐标 */
  screenX: number;
  /** 相对于屏幕的Y坐标 */
  screenY: number;
  /** 相对于浏览器窗口的X坐标 */
  clientX: number;
  /** 相对于浏览器窗口的Y坐标 */
  clientY: number;
  /** 相对于文档的X坐标 */
  pageX: number;
  /** 相对于文档的Y坐标 */
  pageY: number;
  /** 相对于目标元素的X坐标 */
  offsetX: number;
  /** 相对于目标元素的Y坐标 */
  offsetY: number;
}

/**
 * 鼠标点击事件信息接口
 */
interface ClickEvent {
  /** 点击类型 */
  button: number;
  /** 点击的按钮名称 */
  buttonName: string;
  /** 点击时间戳 */
  timestamp: number;
  /** 点击时的坐标信息 */
  position: MousePosition;
}

/**
 * 鼠标轨迹点接口
 */
interface TrailPoint {
  /** X坐标 */
  x: number;
  /** Y坐标 */
  y: number;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 鼠标坐标检测器组件
 */
export default function MouseTracker() {
  // 当前鼠标位置状态
  const [position, setPosition] = useState<MousePosition>({
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  // 是否正在追踪鼠标
  const [isTracking, setIsTracking] = useState(true);
  // 点击事件历史
  const [clickHistory, setClickHistory] = useState<ClickEvent[]>([]);
  // 鼠标移动轨迹
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  // 显示轨迹开关
  const [showTrail, setShowTrail] = useState(true);
  // 轨迹点数量限制
  const [trailLimit, setTrailLimit] = useState(50);

  /**
   * 处理鼠标移动事件
   * @param event 鼠标事件对象
   */
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isTracking) return;

    const newPosition: MousePosition = {
      screenX: event.screenX,
      screenY: event.screenY,
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    };

    setPosition(newPosition);

    // 添加轨迹点
    if (showTrail) {
      setTrail((prev) => {
        const newTrail = [...prev, { x: event.clientX, y: event.clientY, timestamp: Date.now() }];
        // 限制轨迹点数量
        if (newTrail.length > trailLimit) {
          return newTrail.slice(newTrail.length - trailLimit);
        }
        return newTrail;
      });
    }
  }, [isTracking, showTrail, trailLimit]);

  /**
   * 处理鼠标点击事件
   * @param event 鼠标事件对象
   */
  const handleMouseClick = useCallback((event: MouseEvent) => {
    if (!isTracking) return;

    const buttonNames: Record<number, string> = {
      0: 'Left Click',
      1: 'Middle Click',
      2: 'Right Click',
    };

    const clickEvent: ClickEvent = {
      button: event.button,
      buttonName: buttonNames[event.button] || 'Unknown',
      timestamp: Date.now(),
      position: {
        screenX: event.screenX,
        screenY: event.screenY,
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        offsetX: event.offsetX,
        offsetY: event.offsetY,
      },
    };

    setClickHistory((prev) => [clickEvent, ...prev.slice(0, 19)]);
  }, [isTracking]);

  /**
   * 处理上下文菜单事件（阻止右键菜单以便捕获右键点击）
   * @param event 鼠标事件对象
   */
  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    handleMouseClick(event);
  }, [handleMouseClick]);

  /**
   * 添加和移除鼠标事件监听
   */
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleMouseMove, handleMouseClick, handleContextMenu]);

  /**
   * 切换追踪状态
   */
  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  /**
   * 清空点击历史
   */
  const clearClickHistory = () => {
    setClickHistory([]);
  };

  /**
   * 清空轨迹
   */
  const clearTrail = () => {
    setTrail([]);
  };

  /**
   * 格式化时间戳为可读时间
   * @param timestamp 时间戳
   * @returns 格式化后的时间字符串
   */
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  /**
   * 获取按钮样式类名
   * @param button 按钮代码
   * @returns CSS类名
   */
  const getButtonStyle = (button: number): string => {
    switch (button) {
      case 0:
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 1:
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 2:
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-100 dark:bg-dark-600/50 text-light-600 dark:text-dark-300';
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-light-900 dark:text-dark-50">
            Mouse Tracker
          </h1>
          <p className="mb-6 text-light-500 dark:text-dark-200">
            Track mouse coordinates in real-time across screen, window, and page.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_MOUSE_1" format="horizontal" />

        {/* 控制按钮 */}
        <div className="mt-6 flex flex-wrap gap-3 animate-fade-in-up">
          <button
            onClick={toggleTracking}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isTracking
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isTracking ? '🟢 Tracking' : '🔴 Paused'}
          </button>
          <button
            onClick={clearClickHistory}
            className="btn-ghost rounded-lg px-4 py-2 text-sm font-medium"
          >
            Clear Clicks
          </button>
          <button
            onClick={clearTrail}
            className="btn-ghost rounded-lg px-4 py-2 text-sm font-medium"
          >
            Clear Trail
          </button>
          <button
            onClick={() => setShowTrail(!showTrail)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              showTrail
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-gray-100 dark:bg-dark-600/50 text-light-600 dark:text-dark-300 border border-gray-300/30 dark:border-dark-500/30'
            }`}
          >
            {showTrail ? 'Trail: ON' : 'Trail: OFF'}
          </button>
        </div>

        {/* 坐标显示区域 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3 animate-fade-in-up">
          {/* 屏幕坐标 */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Screen Coordinates
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">screenX</span>
                <span className="font-mono text-lg text-emerald-400">{position.screenX}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">screenY</span>
                <span className="font-mono text-lg text-emerald-400">{position.screenY}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Relative to the entire screen/monitor
            </p>
          </div>

          {/* 窗口坐标 */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Window Coordinates
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">clientX</span>
                <span className="font-mono text-lg text-blue-400">{position.clientX}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">clientY</span>
                <span className="font-mono text-lg text-blue-400">{position.clientY}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Relative to the browser viewport
            </p>
          </div>

          {/* 页面坐标 */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Page Coordinates
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">pageX</span>
                <span className="font-mono text-lg text-purple-400">{position.pageX}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">pageY</span>
                <span className="font-mono text-lg text-purple-400">{position.pageY}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Relative to the document (includes scroll)
            </p>
          </div>
        </div>

        {/* 元素偏移坐标 */}
        <div className="mt-4 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
              Element Offset
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">offsetX</span>
                <span className="font-mono text-lg text-amber-400">{position.offsetX}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-100 dark:bg-dark-600/50 p-3">
                <span className="text-sm text-light-500 dark:text-dark-200">offsetY</span>
                <span className="font-mono text-lg text-amber-400">{position.offsetY}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-light-600 dark:text-dark-300">
              Relative to the target element (when hovering over an element)
            </p>
          </div>
        </div>

        {/* 轨迹可视化区域 */}
        {showTrail && trail.length > 0 && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-light-900 dark:text-dark-50">
                  Mouse Trail
                </h3>
                <span className="text-sm text-light-600 dark:text-dark-300">{trail.length} points</span>
              </div>
              <div className="relative h-48 overflow-hidden rounded-lg bg-light-200/50 dark:bg-dark-700/50">
                {trail.map((point, index) => {
                  const opacity = (index + 1) / trail.length;
                  const size = Math.max(4, (index + 1) / trail.length * 8);
                  return (
                    <div
                      key={point.timestamp}
                      className="absolute rounded-full bg-purple-500"
                      style={{
                        left: `${Math.min(100, Math.max(0, (point.x / window.innerWidth) * 100))}%`,
                        top: `${Math.min(100, Math.max(0, (point.y / window.innerHeight) * 100))}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        opacity: opacity * 0.8,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 点击历史 */}
        {clickHistory.length > 0 && (
          <div className="mt-6 animate-fade-in-up">
            <div className="glass-card rounded-xl p-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
                Click History
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {clickHistory.map((click, index) => (
                  <div
                    key={click.timestamp}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-dark-600/30 p-3"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-medium ${getButtonStyle(click.button)}`}>
                      {click.button === 0 ? 'L' : click.button === 1 ? 'M' : 'R'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-light-700 dark:text-dark-100">
                        ({click.position.clientX}, {click.position.clientY})
                      </div>
                      <div className="text-xs text-light-600 dark:text-dark-300">
                        {formatTime(click.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AdCard slot="YOUR_AD_SLOT_MOUSE_2" />

        {/* 使用说明 */}
        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-light-900 dark:text-dark-50">
            Mouse Event Properties
          </h2>
          <div className="grid gap-4 text-sm text-light-500 dark:text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">screenX/Y:</strong> Coordinates relative to the user's screen/monitor
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">clientX/Y:</strong> Coordinates relative to the browser viewport (visible area)
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">pageX/Y:</strong> Coordinates relative to the document, including scrolled area
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">offsetX/Y:</strong> Coordinates relative to the target element
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Mouse Buttons:</strong> 0=Left, 1=Middle, 2=Right
              </p>
              <p className="mb-2">
                <strong className="text-light-700 dark:text-dark-100">Trail:</strong> Visual representation of recent mouse movements
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
