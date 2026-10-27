import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../data/mockData';
import {
  Sparkles,
  Lock,
  Mail,
  ShieldCheck,
  Zap,
  TrendingUp,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Wpisz adres e-mail lub wybierz konto demo poniżej');
      return;
    }
    login(email);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-900 text-white font-sans antialiased">
      {/* Left side: SaaS Hero Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 relative overflow-hidden border-r border-indigo-900/40">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">NexusCRM</h1>
            <p className="text-xs text-indigo-300 font-medium">Enterprise Customer Relations</p>
          </div>
        </div>

        {/* Hero value propositions */}
        <div className="space-y-6 max-w-lg relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Platforma CRM Nowej Generacji</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Zarządzaj relacjami i zamykaj kontrakty <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">2x szybciej</span>.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Zintegrowany lejek Kanban, historia 360° każdego kontrahenta, automatyczne prognozy przychodów oraz pełna analityka skuteczności zespołu handlowego.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-2xl font-black text-indigo-400">+38%</p>
              <p className="text-xs text-slate-400 mt-0.5">Wzrost konwersji leadów</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-2xl font-black text-emerald-400">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Kontroli nad historią kontaktu</p>
            </div>
          </div>
        </div>

        {/* Footer quote */}
        <div className="text-xs text-slate-400 relative z-10 flex items-center justify-between border-t border-indigo-900/50 pt-6">
          <span>Bezpieczne szyfrowanie end-to-end</span>
          <span>© 2024 NexusCRM Systems</span>
        </div>
      </div>

      {/* Right side: Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-900">
        <div className="w-full max-w-md space-y-6 bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">NexusCRM</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Logowanie do systemu CRM
            </h3>
            <p className="text-xs text-slate-400">
              Wprowadź dane dostępowe lub wybierz profil demonstracyjny
            </p>
          </div>

          {/* Quick 1-Click Demo Profiles */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Szybkie logowanie demo (1-kliknięcie):
            </p>
            <div className="space-y-1.5">
              {mockUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => loginAs(u)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/5 hover:border-indigo-500/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover border border-indigo-400"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-indigo-200">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{u.title}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-700 w-full" />
            <span className="bg-slate-800 px-3 text-[11px] text-slate-400 uppercase font-semibold">
              lub ręcznie
            </span>
            <div className="border-t border-slate-700 w-full" />
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Adres e-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="twoj.email@firma.pl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hasło
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-0" />
                <span>Zapamiętaj sesję</span>
              </label>
              <a href="#demo" onClick={(e) => { e.preventDefault(); loginAs(mockUsers[0]); }} className="text-indigo-400 hover:underline">
                Zapomniałeś hasła?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Zaloguj się</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
