import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { DealStage } from '../../types/crm';
import { ArrowRight } from 'lucide-react';

export const PipelineFunnelWidget: React.FC = () => {
  const { deals, setActiveTab } = useCrm();

  const stages: { stage: DealStage; label: string; color: string; barColor: string }[] = [
    { stage: 'lead', label: 'Nowy Lead', color: 'text-amber-600 dark:text-amber-400', barColor: 'bg-amber-500' },
    { stage: 'qualification', label: 'Kwalifikacja', color: 'text-sky-600 dark:text-sky-400', barColor: 'bg-sky-500' },
    { stage: 'proposal', label: 'Oferta', color: 'text-indigo-600 dark:text-indigo-400', barColor: 'bg-indigo-500' },
    { stage: 'negotiation', label: 'Negocjacje', color: 'text-purple-600 dark:text-purple-400', barColor: 'bg-purple-500' },
    { stage: 'won', label: 'Wygrane', color: 'text-emerald-600 dark:text-emerald-400', barColor: 'bg-emerald-500' },
  ];

  const totalDeals = deals.length || 1;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Lejek Sprzedaży (Etapy)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rozkład wartości szans wg kroków
            </p>
          </div>
          <button
            onClick={() => setActiveTab('pipeline')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>Otwórz Kanban</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="space-y-3.5 mt-4">
          {stages.map(s => {
            const stageDeals = deals.filter(d => d.stage === s.stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const percentage = Math.round((stageDeals.length / totalDeals) * 100);

            return (
              <div key={s.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {s.label}{' '}
                    <span className="text-slate-400 font-normal">({stageDeals.length})</span>
                  </span>
                  <span className={`font-bold ${s.color}`}>
                    {stageValue.toLocaleString('pl-PL')} zł
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.barColor} transition-all duration-500`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>Suma wszystkich szans:</span>
        <span className="font-extrabold text-slate-900 dark:text-white">
          {deals.reduce((sum, d) => sum + d.value, 0).toLocaleString('pl-PL')} zł
        </span>
      </div>
    </div>
  );
};
