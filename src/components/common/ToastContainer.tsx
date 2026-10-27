import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCrm();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
        };

        const bgStyles = {
          success: 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/60 shadow-emerald-500/10',
          info: 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800/60 shadow-indigo-500/10',
          warning: 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/60 shadow-amber-500/10',
          error: 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800/60 shadow-rose-500/10'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg ${bgStyles[toast.type]} animate-fade-in transition-all`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type]}
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
