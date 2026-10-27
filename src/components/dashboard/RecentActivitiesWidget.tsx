import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { ActivityTypeBadge } from '../common/Badge';
import { PhoneCall, Calendar, Mail, FileText, ArrowRight, Plus } from 'lucide-react';
import { ActivityType } from '../../types/crm';

export const RecentActivitiesWidget: React.FC = () => {
  const { activities, setActiveTab, setSelectedClientId, setQuickActionModal } = useCrm();

  const getIcon = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="w-4 h-4 text-sky-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'note':
      case 'proposal':
        return <FileText className="w-4 h-4 text-emerald-500" />;
    }
  };

  const recent = activities.slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Ostatnie Interakcje z Klientami
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Telefony, notatki i spotkania handlowe
            </p>
          </div>
          <button
            onClick={() => setQuickActionModal('activity')}
            className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
            title="Dodaj interakcję"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {recent.map(act => (
            <div
              key={act.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {getIcon(act.type)}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {act.title}
                  </span>
                </div>
                <ActivityTypeBadge type={act.type} />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                {act.description}
              </p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400">
                {act.clientName && (
                  <button
                    onClick={() => {
                      setSelectedClientId(act.clientId);
                      setActiveTab('clients');
                    }}
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[180px]"
                  >
                    {act.clientName}
                  </button>
                )}
                <span>{new Date(act.date).toLocaleDateString('pl-PL')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('activities')}
          className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1"
        >
          <span>Zobacz całą historię kontaktów ({activities.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
