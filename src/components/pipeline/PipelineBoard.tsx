import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Deal, DealStage } from '../../types/crm';
import { PriorityBadge } from '../common/Badge';
import { DealFormModal } from './DealFormModal';
import {
  TrendingUp,
  Plus,
  Building2,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Percent
} from 'lucide-react';

export const PipelineBoard: React.FC = () => {
  const { deals, moveDealStage, deleteDeal, setSelectedClientId, setActiveTab } = useCrm();

  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [targetStage, setTargetStage] = useState<DealStage>('lead');

  const stages: { id: DealStage; label: string; headerColor: string; dotColor: string }[] = [
    { id: 'lead', label: 'Nowy Lead', headerColor: 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20', dotColor: 'bg-amber-500' },
    { id: 'qualification', label: 'Kwalifikacja', headerColor: 'border-sky-400 bg-sky-50/50 dark:bg-sky-950/20', dotColor: 'bg-sky-500' },
    { id: 'proposal', label: 'Oferta', headerColor: 'border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', dotColor: 'bg-indigo-500' },
    { id: 'negotiation', label: 'Negocjacje', headerColor: 'border-purple-400 bg-purple-50/50 dark:bg-purple-950/20', dotColor: 'bg-purple-500' },
    { id: 'won', label: 'Wygrana 🎉', headerColor: 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', dotColor: 'bg-emerald-500' },
    { id: 'lost', label: 'Przegrana', headerColor: 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20', dotColor: 'bg-rose-500' }
  ];

  const stageOrder: DealStage[] = ['lead', 'qualification', 'proposal', 'negotiation', 'won'];

  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesAssignee = assigneeFilter === 'all' || deal.assignedTo === assigneeFilter;
    return matchesSearch && matchesAssignee;
  });

  // Calculations
  const totalPipeline = filteredDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = Math.round(
    filteredDeals.reduce((sum, d) => sum + (d.value * d.probability) / 100, 0)
  );
  const wonTotal = filteredDeals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.value, 0);

  const getNextStage = (current: DealStage): DealStage | null => {
    const idx = stageOrder.indexOf(current);
    if (idx !== -1 && idx < stageOrder.length - 1) {
      return stageOrder[idx + 1];
    }
    return null;
  };

  const getPrevStage = (current: DealStage): DealStage | null => {
    const idx = stageOrder.indexOf(current);
    if (idx > 0) {
      return stageOrder[idx - 1];
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Value Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Łączna wartość szans</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalPipeline.toLocaleString('pl-PL')} zł
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wartość ważona (Forecast)</p>
            <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
              {weightedPipeline.toLocaleString('pl-PL')} zł
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wygrane kontrakty</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {wonTotal.toLocaleString('pl-PL')} zł
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtruj po tytule szansy lub nazwie klienta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDealToEdit(null);
              setTargetStage('lead');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nowa szansa sprzedaży</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {stages.map(column => {
          const colDeals = filteredDeals.filter(d => d.stage === column.id);
          const colTotal = colDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={column.id}
              className="bg-slate-100/70 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-200/70 dark:border-slate-800/80 flex flex-col min-w-[240px] space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${column.dotColor}`} />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {column.label}
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {colDeals.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setDealToEdit(null);
                    setTargetStage(column.id);
                    setIsModalOpen(true);
                  }}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title={`Dodaj szansę do "${column.label}"`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Column Value Subtitle */}
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {colTotal.toLocaleString('pl-PL')} zł
              </p>

              {/* Deal Cards Container */}
              <div className="space-y-3 min-h-[160px]">
                {colDeals.map(deal => {
                  const prev = getPrevStage(deal.stage);
                  const next = getNextStage(deal.stage);

                  return (
                    <div
                      key={deal.id}
                      className="bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all group space-y-2.5"
                    >
                      {/* Priority & Actions */}
                      <div className="flex items-center justify-between">
                        <PriorityBadge priority={deal.priority} />
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setDealToEdit(deal);
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Edytuj"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Usunąć szansę: ${deal.title}?`)) {
                                deleteDeal(deal.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Usuń"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Client */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {deal.title}
                        </h4>
                        <button
                          onClick={() => {
                            setSelectedClientId(deal.clientId);
                            setActiveTab('clients');
                          }}
                          className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline mt-1 truncate max-w-full"
                        >
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">{deal.clientName}</span>
                        </button>
                      </div>

                      {/* Value in bold */}
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {deal.value.toLocaleString('pl-PL')} zł
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {deal.probability}% szans
                        </span>
                      </div>

                      {/* Probability bar */}
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {deal.expectedCloseDate}
                        </span>
                        <span className="truncate max-w-[80px]" title={deal.assignedTo}>
                          {deal.assignedTo.split(' ')[0]}
                        </span>
                      </div>

                      {/* Stage Shift Controls */}
                      <div className="flex items-center justify-between pt-1 gap-1">
                        {prev ? (
                          <button
                            onClick={() => moveDealStage(deal.id, prev)}
                            className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Przesuń wstecz"
                          >
                            <ChevronLeft className="w-3 h-3 mr-0.5" />
                            <span>Cofnij</span>
                          </button>
                        ) : <div />}

                        {next ? (
                          <button
                            onClick={() => moveDealStage(deal.id, next)}
                            className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950"
                            title="Przesuń dalej"
                          >
                            <span>Dalej</span>
                            <ChevronRight className="w-3 h-3 ml-0.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold">
                            Zakończony
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colDeals.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-center p-4">
                    <p className="text-[11px] text-slate-400">Brak szans na tym etapie</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DealFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDealToEdit(null);
        }}
        dealToEdit={dealToEdit}
        defaultStage={targetStage}
      />
    </div>
  );
};
