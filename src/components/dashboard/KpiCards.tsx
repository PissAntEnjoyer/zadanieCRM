import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight } from 'lucide-react';

export const KpiCards: React.FC = () => {
  const { clients, deals } = useCrm();

  // Calculations
  const wonDeals = deals.filter(d => d.stage === 'won');
  const totalRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  const openDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);

  const closedDealsCount = deals.filter(d => d.stage === 'won' || d.stage === 'lost').length;
  const winRate = closedDealsCount > 0
    ? Math.round((wonDeals.length / closedDealsCount) * 100)
    : 75;

  const activeClientsCount = clients.filter(c => c.status === 'active' || c.status === 'vip').length;

  const kpis = [
    {
      title: 'Przychód zrealizowany',
      value: `${totalRevenue.toLocaleString('pl-PL')} zł`,
      change: '+24.5% m/m',
      icon: <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800/40',
      badgeBg: 'text-emerald-700 bg-emerald-100/70 dark:bg-emerald-900/60 dark:text-emerald-300'
    },
    {
      title: 'Wartość lejka (otwarte)',
      value: `${pipelineValue.toLocaleString('pl-PL')} zł`,
      change: `${openDeals.length} aktywnych szans`,
      icon: <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-800/40',
      badgeBg: 'text-indigo-700 bg-indigo-100/70 dark:bg-indigo-900/60 dark:text-indigo-300'
    },
    {
      title: 'Wskaźnik wygranych (Win Rate)',
      value: `${winRate}%`,
      change: '+5.2% vs Q3',
      icon: <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-800/40',
      badgeBg: 'text-purple-700 bg-purple-100/70 dark:bg-purple-900/60 dark:text-purple-300'
    },
    {
      title: 'Kluczowi i aktywni klienci',
      value: activeClientsCount.toString(),
      change: `z ${clients.length} w bazie`,
      icon: <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-800/40',
      badgeBg: 'text-sky-700 bg-sky-100/70 dark:bg-sky-900/60 dark:text-sky-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {kpi.title}
            </span>
            <div className={`p-2.5 rounded-xl border ${kpi.bg}`}>
              {kpi.icon}
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {kpi.value}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${kpi.badgeBg}`}>
              <ArrowUpRight className="w-3 h-3 mr-0.5 inline" />
              {kpi.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
