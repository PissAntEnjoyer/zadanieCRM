import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { PriorityBadge } from '../common/Badge';
import { Check, Clock, Plus, ArrowRight } from 'lucide-react';

export const QuickTasksWidget: React.FC = () => {
  const { tasks, toggleTaskStatus, setActiveTab, setQuickActionModal } = useCrm();

  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Do zrobienia (Priorytety)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zaplanowane zadania i follow-upy
            </p>
          </div>
          <button
            onClick={() => setQuickActionModal('task')}
            className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
            title="Dodaj zadanie"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mt-4">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Wszystkie zadania wykonane!
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Świetna robota, nie masz zaległych zadań.
              </p>
            </div>
          ) : (
            pendingTasks.map(task => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 transition-colors group"
              >
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 group-hover:border-indigo-500 flex items-center justify-center transition-colors shrink-0 bg-white dark:bg-slate-800"
                >
                  <span className="opacity-0 group-hover:opacity-40">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <PriorityBadge priority={task.priority} />
                    {task.clientName && (
                      <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {task.clientName}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('tasks')}
          className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1"
        >
          <span>Przejdź do pełnej listy zadań</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
