import React, { useState, useRef, useEffect } from 'react';
import { useCrm } from '../../context/CrmContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Building2,
  UserPlus,
  TrendingUp,
  PhoneCall,
  CheckSquare,
  Check,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const {
    activeTab,
    setActiveTab,
    setSelectedClientId,
    clients,
    contacts,
    deals,
    notifications,
    markAllNotificationsAsRead,
    darkMode,
    toggleDarkMode,
    setQuickActionModal
  } = useCrm();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const addMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Pulpit Zarządczy', subtitle: 'Przegląd kluczowych wskaźników CRM i bieżącej sprzedaży' },
    clients: { title: 'Baza Klientów i Firm', subtitle: 'Zarządzanie kontrahentami, statusem relacji i historią' },
    contacts: { title: 'Baza Kontaktów Osobistych', subtitle: 'Bezpośrednie osoby kontaktowe, stanowiska i dane kontaktowe' },
    pipeline: { title: 'Lejek Sprzedaży (Kanban)', subtitle: 'Wizualne etapy transakcji, szanse i prognozowane przychody' },
    activities: { title: 'Historia Kontaktów i Notatki', subtitle: 'Rejestr telefonów, spotkań, maili i ustaleń z klientami' },
    tasks: { title: 'Zadania i Przypomnienia', subtitle: 'Lista obowiązków, terminy wykonania i statusy realizacji' },
    reports: { title: 'Raporty i Analityka B2B', subtitle: 'Konwersje, prognozy przychodów i zestawienia handlowców' }
  };

  // Search matches
  const filteredClients = searchTerm.trim()
    ? clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nip?.includes(searchTerm)
      ).slice(0, 4)
    : [];

  const filteredContacts = searchTerm.trim()
    ? contacts.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredDeals = searchTerm.trim()
    ? deals.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 4)
    : [];

  const hasSearchResults =
    filteredClients.length > 0 || filteredContacts.length > 0 || filteredDeals.length > 0;

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Collapsible toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Zwiń / Rozwiń menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {tabTitles[activeTab]?.title || 'CRM'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {tabTitles[activeTab]?.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search + Quick Add + Theme + Notifications */}
      <div className="flex items-center gap-3">
        {/* Global Search Input */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Szukaj klienta, kontaktu, szansy..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-36 sm:w-56"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchOpen && searchTerm.trim().length > 0 && (
            <div className="absolute right-0 top-12 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-fade-in max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Wyniki wyszukiwania
                </span>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Zamknij
                </button>
              </div>

              {!hasSearchResults && (
                <p className="text-xs text-slate-500 py-4 text-center">
                  Brak wyników dla zapytania "{searchTerm}"
                </p>
              )}

              {/* Clients */}
              {filteredClients.length > 0 && (
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase px-2">Klienci</span>
                  <div className="space-y-1 mt-1">
                    {filteredClients.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setActiveTab('clients');
                          setSearchOpen(false);
                          setSearchTerm('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 text-left text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</p>
                            <p className="text-[10px] text-slate-400">{c.city} • {c.industry}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts */}
              {filteredContacts.length > 0 && (
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase px-2">Kontakty</span>
                  <div className="space-y-1 mt-1">
                    {filteredContacts.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveTab('contacts');
                          setSearchOpen(false);
                          setSearchTerm('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 text-left text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <img src={c.avatar} className="w-5 h-5 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{c.firstName} {c.lastName}</p>
                            <p className="text-[10px] text-slate-400">{c.role}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Deals */}
              {filteredDeals.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase px-2">Szanse sprzedaży</span>
                  <div className="space-y-1 mt-1">
                    {filteredDeals.map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setActiveTab('pipeline');
                          setSearchOpen(false);
                          setSearchTerm('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 text-left text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{d.title}</p>
                            <p className="text-[10px] text-slate-400">{d.value.toLocaleString('pl-PL')} zł • {d.clientName}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Add Dropdown Button */}
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Dodaj</span>
          </button>

          {showAddMenu && (
            <div className="absolute right-0 top-11 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-fade-in">
              <button
                onClick={() => {
                  setQuickActionModal('client');
                  setShowAddMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Nowy Klient / Firma</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionModal('contact');
                  setShowAddMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-sky-500" />
                <span>Nowy Kontakt</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionModal('deal');
                  setShowAddMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Nowa Szansa sprzedaży</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionModal('activity');
                  setShowAddMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-purple-500" />
                <span>Zarejestruj interakcję</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionModal('task');
                  setShowAddMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <span>Nowe Zadanie</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Powiadomienia"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Powiadomienia</span>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Odczytaj wszystkie</span>
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      notif.read
                        ? 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent text-slate-500'
                        : 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/40 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{notif.title}</span>
                      <span className="text-[10px] text-slate-400">{notif.date}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
