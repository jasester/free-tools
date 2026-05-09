'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdCard from '@/components/AdCard';

/**
 * 单位换算器工具页面
 * 支持长度、重量、温度、面积、体积、速度、压力、能量等多种单位换算
 */

/**
 * 单位类别定义
 */
type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'pressure' | 'data';

/**
 * 单位定义接口
 */
interface Unit {
  id: string;
  name: string;
  symbol: string;
  toBase: number; // 转换到基准单位的系数
}

/**
 * 单位类别配置
 */
const unitCategories: Record<UnitCategory, { name: string; units: Unit[]; baseUnit: string }> = {
  length: {
    name: 'Length',
    baseUnit: 'm',
    units: [
      { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
      { id: 'm', name: 'Meter', symbol: 'm', toBase: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: 1000 },
      { id: 'in', name: 'Inch', symbol: 'in', toBase: 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', toBase: 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', toBase: 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', toBase: 1609.344 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', toBase: 1852 },
    ],
  },
  weight: {
    name: 'Weight',
    baseUnit: 'kg',
    units: [
      { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: 0.000001 },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: 0.001 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: 1 },
      { id: 't', name: 'Metric Ton', symbol: 't', toBase: 1000 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: 0.0283495 },
      { id: 'lb', name: 'Pound', symbol: 'lb', toBase: 0.453592 },
      { id: 'st', name: 'Stone', symbol: 'st', toBase: 6.35029 },
      { id: 'ton', name: 'US Ton', symbol: 'ton', toBase: 907.185 },
    ],
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'c',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: 1 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: 1 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: 1 },
    ],
  },
  area: {
    name: 'Area',
    baseUnit: 'm2',
    units: [
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', toBase: 0.0001 },
      { id: 'm2', name: 'Square Meter', symbol: 'm²', toBase: 1 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', toBase: 10000 },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', toBase: 1000000 },
      { id: 'in2', name: 'Square Inch', symbol: 'in²', toBase: 0.00064516 },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', toBase: 0.092903 },
      { id: 'ac', name: 'Acre', symbol: 'ac', toBase: 4046.86 },
      { id: 'mi2', name: 'Square Mile', symbol: 'mi²', toBase: 2589988 },
    ],
  },
  volume: {
    name: 'Volume',
    baseUnit: 'l',
    units: [
      { id: 'ml', name: 'Milliliter', symbol: 'ml', toBase: 0.001 },
      { id: 'l', name: 'Liter', symbol: 'L', toBase: 1 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', toBase: 1000 },
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal', toBase: 3.78541 },
      { id: 'qt', name: 'Quart (US)', symbol: 'qt', toBase: 0.946353 },
      { id: 'pt', name: 'Pint (US)', symbol: 'pt', toBase: 0.473176 },
      { id: 'cup', name: 'Cup (US)', symbol: 'cup', toBase: 0.236588 },
      { id: 'floz', name: 'Fluid Ounce (US)', symbol: 'fl oz', toBase: 0.0295735 },
    ],
  },
  speed: {
    name: 'Speed',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'Meter per Second', symbol: 'm/s', toBase: 1 },
      { id: 'kph', name: 'Kilometer per Hour', symbol: 'km/h', toBase: 0.277778 },
      { id: 'mph', name: 'Mile per Hour', symbol: 'mph', toBase: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', toBase: 0.514444 },
      { id: 'mach', name: 'Mach', symbol: 'Mach', toBase: 343 },
    ],
  },
  pressure: {
    name: 'Pressure',
    baseUnit: 'pa',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', toBase: 1 },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', toBase: 1000 },
      { id: 'mpa', name: 'Megapascal', symbol: 'MPa', toBase: 1000000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', toBase: 100000 },
      { id: 'mbar', name: 'Millibar', symbol: 'mbar', toBase: 100 },
      { id: 'psi', name: 'PSI', symbol: 'psi', toBase: 6894.76 },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', toBase: 101325 },
      { id: 'torr', name: 'Torr', symbol: 'Torr', toBase: 133.322 },
    ],
  },
  data: {
    name: 'Data',
    baseUnit: 'b',
    units: [
      { id: 'b', name: 'Byte', symbol: 'B', toBase: 1 },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', toBase: 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', toBase: 1048576 },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', toBase: 1073741824 },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', toBase: 1099511627776 },
      { id: 'pb', name: 'Petabyte', symbol: 'PB', toBase: 1125899906842624 },
    ],
  },
};

/**
 * 温度转换特殊处理
 * @param value 输入值
 * @param from 源单位
 * @param to 目标单位
 * @returns 转换后的值
 */
function convertTemperature(value: number, from: string, to: string): number {
  // 先转换为摄氏度
  let celsius: number;
  switch (from) {
    case 'c':
      celsius = value;
      break;
    case 'f':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'k':
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }

  // 再从摄氏度转换到目标单位
  switch (to) {
    case 'c':
      return celsius;
    case 'f':
      return celsius * 9 / 5 + 32;
    case 'k':
      return celsius + 273.15;
    default:
      return celsius;
  }
}

/**
 * 单位换算器组件
 */
export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  const currentCategory = unitCategories[category];

  // 当切换类别时，重置单位
  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    const firstUnit = unitCategories[newCategory].units[0].id;
    const secondUnit = unitCategories[newCategory].units[1]?.id || firstUnit;
    setFromUnit(firstUnit);
    setToUnit(secondUnit);
  };

  // 计算转换结果
  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return null;

    if (category === 'temperature') {
      return convertTemperature(value, fromUnit, toUnit);
    }

    const fromUnitData = currentCategory.units.find((u) => u.id === fromUnit);
    const toUnitData = currentCategory.units.find((u) => u.id === toUnit);

    if (!fromUnitData || !toUnitData) return null;

    // 转换为基准单位，再转换到目标单位
    const baseValue = value * fromUnitData.toBase;
    return baseValue / toUnitData.toBase;
  }, [inputValue, fromUnit, toUnit, category, currentCategory.units]);

  // 交换单位
  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* 页面标题 */}
        <div className="animate-fade-in-up">
          <h1 className="mb-2 font-display text-3xl font-bold text-dark-50">
            Unit Converter
          </h1>
          <p className="mb-6 text-dark-200">
            Convert between different units of measurement. Length, weight, temperature, and more.
          </p>
        </div>

        <AdCard slot="YOUR_AD_SLOT_UNIT_1" format="horizontal" />

        {/* 类别选择 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(unitCategories) as UnitCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    category === cat
                      ? 'btn-gradient text-white'
                      : 'btn-ghost text-dark-100 hover:text-dark-50'
                  }`}
                >
                  {unitCategories[cat].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 转换区域 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
              {/* 输入区域 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-dark-100">
                  From
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-dark mb-3 w-full rounded-lg px-4 py-3 text-lg text-dark-50"
                  placeholder="Enter value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="input-dark w-full rounded-lg px-4 py-2 text-dark-50"
                >
                  {currentCategory.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* 交换按钮 */}
              <div className="flex justify-center">
                <button
                  onClick={swapUnits}
                  className="rounded-full border border-white/10 bg-dark-600/50 p-3 transition hover:bg-dark-500/50"
                >
                  <svg className="h-5 w-5 text-dark-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              {/* 输出区域 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-dark-100">
                  To
                </label>
                <div className="mb-3 min-h-[54px] rounded-lg bg-dark-600/50 px-4 py-3 text-lg font-mono text-emerald-400">
                  {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 10 }) : '-'}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="input-dark w-full rounded-lg px-4 py-2 text-dark-50"
                >
                  {currentCategory.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 常用转换表 */}
        <div className="mt-6 animate-fade-in-up">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-dark-50">
              Common Conversions
            </h3>
            <div className="grid gap-2 text-sm md:grid-cols-2">
              {currentCategory.units.slice(0, 6).map((unit) => {
                if (unit.id === fromUnit) return null;
                let convertedValue: number;
                if (category === 'temperature') {
                  convertedValue = convertTemperature(parseFloat(inputValue) || 0, fromUnit, unit.id);
                } else {
                  const fromUnitData = currentCategory.units.find((u) => u.id === fromUnit);
                  if (!fromUnitData) return null;
                  const baseValue = (parseFloat(inputValue) || 0) * fromUnitData.toBase;
                  convertedValue = baseValue / unit.toBase;
                }
                const fromUnitSymbol = currentCategory.units.find((u) => u.id === fromUnit)?.symbol || '';
                return (
                  <div key={unit.id} className="flex justify-between rounded-lg bg-dark-600/30 px-4 py-2">
                    <span className="text-dark-200">
                      {inputValue || '0'} {fromUnitSymbol} =
                    </span>
                    <span className="font-mono text-dark-50">
                      {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} {unit.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <AdCard slot="YOUR_AD_SLOT_UNIT_2" />

        {/* 使用说明 */}
        <section className="glass-card mt-10 animate-fade-in-up rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-dark-50">
            About Unit Converter
          </h2>
          <div className="grid gap-4 text-sm text-dark-200 md:grid-cols-2">
            <div>
              <p className="mb-2">
                <strong className="text-dark-100">Length:</strong> Metric and imperial units including meters, feet, miles
              </p>
              <p className="mb-2">
                <strong className="text-dark-100">Weight:</strong> Grams, kilograms, pounds, ounces, and more
              </p>
              <p className="mb-2">
                <strong className="text-dark-100">Temperature:</strong> Celsius, Fahrenheit, and Kelvin conversions
              </p>
              <p className="mb-2">
                <strong className="text-dark-100">Area:</strong> Square meters, acres, hectares, square miles
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-dark-100">Volume:</strong> Liters, gallons, cups, fluid ounces
              </p>
              <p className="mb-2">
                <strong className="text-dark-100">Speed:</strong> m/s, km/h, mph, knots, and Mach
              </p>
              <p className="mb-2">
                <strong className="text-dark-100">Pressure:</strong> Pascal, bar, PSI, atmosphere
              </p>
              <p className="mb-2">
                <strong className="text-dark-100">Data:</strong> Bytes, KB, MB, GB, TB, PB
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
