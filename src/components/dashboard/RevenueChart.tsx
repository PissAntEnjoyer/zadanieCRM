import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const monthlySalesData = [
  { month: 'Maj', przychod: 145000, pipeline: 220000 },
  { month: 'Cze', przychod: 180000, pipeline: 310000 },
  { month: 'Lip', przychod: 195000, pipeline: 290000 },
  { month: 'Sie', przychod: 260000, pipeline: 380000 },
  { month: 'Wrz', przychod: 310000, pipeline: 460000 },
  { month: 'Paź', przychod: 490000, pipeline: 580000 },
];

export const RevenueChart: React.FC = () => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 text-white p-3 rounded-xl shadow-xl backdrop-blur-md border border-slate-700 text-xs space-y-1">
          <p className="font-bold text-slate-300">{label} 2024</p>
          <p className="text-emerald-400 font-semibold">
            Zrealizowany: {payload[0]?.value?.toLocaleString('pl-PL')} zł
          </p>
          {payload[1] && (
            <p className="text-indigo-400 font-semibold">
              Wartość w lejku: {payload[1]?.value?.toLocaleString('pl-PL')} zł
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Dynamika Przychodu i Lejka (PLN)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Wzrost sprzedaży B2B w ostatnich 6 miesiącach
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setChartType('area')}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
              chartType === 'area'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Wykres liniowy
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Słupkowy
          </button>
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={val => `${Math.round(val / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="przychod"
                name="Przychód"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="pipeline"
                name="Lejek"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorPipeline)"
              />
            </AreaChart>
          ) : (
            <BarChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={val => `${Math.round(val / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="przychod" name="Przychód" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pipeline" name="Lejek" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Faktyczny przychód zamknięty</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500" />
          <span>Potencjał w procesie negocjacji</span>
        </div>
      </div>
    </div>
  );
};
