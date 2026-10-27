import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types/crm';
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  PhoneCall,
  CheckSquare,
  BarChart3,
  Plus,
  LogOut,
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { activeTab, setActiveTab, clients, contacts, deals, tasks, resetToDemoData, setQuickActionModal } = useCrm();
  const { currentUser, logout, switchUser, availableUsers } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const activeDealsCount = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Pulpit główny', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'clients', label: 'Klienci i Firmy', icon: <Building2 className="w-5 h-5" />, badge: clients.length },
    { id: 'contacts', label: 'Baza kontaktów', icon: <Users className="w-5 h-5" />, badge: contacts.length },
    { id: 'pipeline', label: 'Lejek sprzedaży', icon: <Kanban className="w-5 h-5" />, badge: activeDealsCount },
    { id: 'activities', label: 'Interakcje & Notatki', icon: <PhoneCall className="w-5 h-5" /> },
    { id: 'tasks', label: 'Zadania do zrobienia', icon: <CheckSquare className="w-5 h-5" />, badge: pendingTasksCount },
    { id: 'reports', label: 'Raporty i Analityka', icon: <BarChart3 className="w-5 h-5" /> }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Nexus<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate">
                Customer Relations
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add CTA Button */}
      <div className="p-3">
        {!collapsed ? (
          <button
            onClick={() => setQuickActionModal('deal')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Nowa szansa</span>
          </button>
        ) : (
          <button
            onClick={() => setQuickActionModal('deal')}
            title="Nowa szansa sprzedaży"
            className="w-full h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.icon}
              </div>

              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Demo Reset Helper */}
      {!collapsed && (
        <div className="px-4 py-2">
          <button
            onClick={() => {
              if (confirm('Czy na pewno chcesz przywrócić domyślne dane demonstracyjne?')) {
                resetToDemoData();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetuj do danych demo</span>
          </button>
        </div>
      )}

      {/* User Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 relative">
        {currentUser && (
          <div>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentUser.title}
                  </p>
                </div>
              )}
              {!collapsed && <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
            </button>

            {/* User Switcher Dropdown */}
            {showUserMenu && !collapsed && (
              <div className="absolute bottom-16 left-3 right-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Zmień profil (Demo)
                </p>
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setShowUserMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                      user.id === currentUser.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" />
                    <div className="text-left truncate">
                      <div className="truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{user.title}</div>
                    </div>
                  </button>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Wyloguj się</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
