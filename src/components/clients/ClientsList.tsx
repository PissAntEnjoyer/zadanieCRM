import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { ClientStatusBadge } from '../common/Badge';
import { ClientStatus, Industry, Client } from '../../types/crm';
import {
  Building2,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  ChevronRight,
  User,
  SlidersHorizontal
} from 'lucide-react';
import { ClientDetailModal } from './ClientDetailModal';
import { ClientFormModal } from './ClientFormModal';

export const ClientsList: React.FC = () => {
  const { clients, selectedClientId, setSelectedClientId } = useCrm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'revenue' | 'lastContact'>('name');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // Filter clients
  const filteredClients = clients
    .filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.city.toLowerCase().includes(search.toLowerCase()) ||
        (client.nip && client.nip.includes(search)) ||
        client.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;

      return matchesSearch && matchesStatus && matchesIndustry;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'revenue') return (b.annualRevenue || 0) - (a.annualRevenue || 0);
      if (sortBy === 'lastContact') {
        const dateA = a.lastContactDate ? new Date(a.lastContactDate).getTime() : 0;
        const dateB = b.lastContactDate ? new Date(b.lastContactDate).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });

  const totalRevenue = clients.reduce((sum, c) => sum + (c.annualRevenue || 0), 0);
  const vipCount = clients.filter(c => c.status === 'vip').length;
  const activeCount = clients.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Baza Klientów</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {clients.length} firm
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aktywni & VIP</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {vipCount + activeCount} kontrahentów
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Łączny potencjał roczny</p>
            <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
              {totalRevenue.toLocaleString('pl-PL')} zł
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Szukaj po nazwie firmy, mieście, NIP lub e-mailu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">Wszystkie statusy</option>
            <option value="vip">VIP</option>
            <option value="active">Aktywny</option>
            <option value="negotiation">Negocjacje</option>
            <option value="contacted">W kontakcie</option>
            <option value="lead">Nowy Lead</option>
            <option value="inactive">Nieaktywny</option>
          </select>

          <select
            value={industryFilter}
            onChange={e => setIndustryFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 outline-none max-w-[150px] truncate"
          >
            <option value="all">Wszystkie branże</option>
            <option value="IT & Nowe Technologie">IT & Nowe Technologie</option>
            <option value="Finanse i Bankowość">Finanse i Bankowość</option>
            <option value="E-commerce & Retail">E-commerce & Retail</option>
            <option value="Logistyka & Transport">Logistyka & Transport</option>
            <option value="Produkcja">Produkcja</option>
            <option value="Medycyna & Zdrowie">Medycyna & Zdrowie</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="name">Sortuj: Nazwa A-Z</option>
            <option value="revenue">Sortuj: Przychód malejąco</option>
            <option value="lastContact">Sortuj: Ostatni kontakt</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Widok tabeli"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Widok kafelków"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Add Client Button */}
          <button
            onClick={() => {
              setClientToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj klienta</span>
          </button>
        </div>
      </div>

      {/* Main Client Content */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="px-5 py-3.5">Firma / Kontrahent</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Branża & Lokalizacja</th>
                  <th className="px-5 py-3.5">Opiekun</th>
                  <th className="px-5 py-3.5">Wartość roczna</th>
                  <th className="px-5 py-3.5">Ostatni kontakt</th>
                  <th className="px-5 py-3.5 text-right">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredClients.map(client => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {client.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            NIP: {client.nip || 'Brak'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <ClientStatusBadge status={client.status} />
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {client.industry}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {client.city}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {client.assignedTo}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {client.annualRevenue
                          ? `${client.annualRevenue.toLocaleString('pl-PL')} zł`
                          : '—'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-slate-500 dark:text-slate-400">
                        {client.lastContactDate
                          ? new Date(client.lastContactDate).toLocaleDateString('pl-PL')
                          : 'Brak'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedClientId(client.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                      >
                        <span>Szczegóły 360°</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map(client => (
            <div
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {client.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{client.industry}</p>
                    </div>
                  </div>
                  <ClientStatusBadge status={client.status} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 my-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{client.city}, {client.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Opiekun: {client.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400">Roczny obrót:</span>
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    {client.annualRevenue ? `${client.annualRevenue.toLocaleString('pl-PL')} zł` : '—'}
                  </p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedClientId(client.id);
                  }}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Profil</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 360-degree Detail Modal */}
      <ClientDetailModal
        clientId={selectedClientId}
        onClose={() => setSelectedClientId(null)}
        onEditClient={() => {
          if (selectedClientId) {
            const client = clients.find(c => c.id === selectedClientId);
            setClientToEdit(client || null);
            setIsAddModalOpen(true);
          }
        }}
      />

      {/* Add / Edit Form Modal */}
      <ClientFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setClientToEdit(null);
        }}
        clientToEdit={clientToEdit}
      />
    </div>
  );
};
