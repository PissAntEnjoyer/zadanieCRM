import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { ActivityType } from '../../types/crm';
import { ActivityTypeBadge } from '../common/Badge';
import { LogActivityModal } from './LogActivityModal';
import {
  PhoneCall,
  Calendar,
  Mail,
  FileText,
  Search,
  Filter,
  Plus,
  Building2,
  User,
  Clock,
  Trash2,
  ChevronRight
} from 'lucide-react';

export const ActivitiesList: React.FC = () => {
  const { activities, clients, deleteActivity, setSelectedClientId, setActiveTab } = useCrm();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const filteredActivities = activities.filter(act => {
    const query = search.toLowerCase();
    const matchesSearch =
      act.title.toLowerCase().includes(query) ||
      act.description.toLowerCase().includes(query) ||
      (act.clientName && act.clientName.toLowerCase().includes(query)) ||
      (act.contactName && act.contactName.toLowerCase().includes(query));

    const matchesType = selectedType === 'all' || act.type === selectedType;
    const matchesClient = selectedClient === 'all' || act.clientId === selectedClient;

    return matchesSearch && matchesType && matchesClient;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Szukaj w historii (temat, opis, klient, osoba)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">Wszystkie typy</option>
            <option value="call">Telefon</option>
            <option value="meeting">Spotkanie</option>
            <option value="email">E-mail</option>
            <option value="proposal">Oferta</option>
            <option value="note">Notatka</option>
          </select>

          <select
            value={selectedClient}
            onChange={e => setSelectedClient(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 outline-none max-w-[180px] truncate"
          >
            <option value="all">Wszyscy klienci</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Zarejestruj kontakt</span>
          </button>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nie znaleziono zarejestrowanych interakcji
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Dopasuj filtry lub kliknij przycisk powyżej, aby zarejestrować kontakt.
            </p>
          </div>
        ) : (
          filteredActivities.map(act => (
            <div
              key={act.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative flex flex-col md:flex-row md:items-start justify-between gap-4 group"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                  {getIcon(act.type)}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <ActivityTypeBadge type={act.type} />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {act.title}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {act.description}
                  </p>

                  {act.outcome && (
                    <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-800 dark:text-slate-200">
                      <strong className="text-indigo-700 dark:text-indigo-400 font-semibold mr-1">
                        Następny krok:
                      </strong>
                      {act.outcome}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
                    {act.clientName && (
                      <button
                        onClick={() => {
                          setSelectedClientId(act.clientId);
                          setActiveTab('clients');
                        }}
                        className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{act.clientName}</span>
                      </button>
                    )}

                    {act.contactName && (
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        <span>Rozmówca: {act.contactName}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(act.date).toLocaleString('pl-PL')}
                    </span>

                    <span className="text-slate-400">
                      Przez: <strong>{act.performedBy}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-start opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    if (confirm('Usunąć ten wpis z historii kontaktów?')) {
                      deleteActivity(act.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                  title="Usuń wpis"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <LogActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
