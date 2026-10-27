import React from 'react';
import { KpiCards } from './KpiCards';
import { RevenueChart } from './RevenueChart';
import { PipelineFunnelWidget } from './PipelineFunnelWidget';
import { RecentActivitiesWidget } from './RecentActivitiesWidget';
import { QuickTasksWidget } from './QuickTasksWidget';
import { useAuth } from '../../context/AuthContext';
import { useCrm } from '../../context/CrmContext';
import { Calendar, UserPlus, FileSpreadsheet, Sparkles } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const { setQuickActionModal, setActiveTab } = useCrm();

  const currentDate = new Date().toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="capitalize">{currentDate}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Dzień dobry, {currentUser?.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-indigo-200/80 text-xs sm:text-sm mt-1 max-w-xl">
              W tym miesiącu Twój zespół zrealizował 118% założonego celu sprzedaży. 
              Masz 3 zaplanowane follow-upy oraz 2 oferty oczekujące na akceptację klienta.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setQuickActionModal('client')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/15 transition-all shadow-sm active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-indigo-300" />
              <span>Dodaj firmę</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Generuj raport</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiCards />

      {/* Analytics & Pipeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <PipelineFunnelWidget />
        </div>
      </div>

      {/* Activities & Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivitiesWidget />
        <QuickTasksWidget />
      </div>
    </div>
  );
};
