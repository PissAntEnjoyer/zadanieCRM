import React from 'react';
import { useCrm } from '../../context/CrmContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  TrendingUp,
  Award,
  Users,
  Target
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { clients, deals, activities, tasks, showToast } = useCrm();

  // Industry revenue aggregation
  const industryDataMap: Record<string, number> = {};
  clients.forEach(c => {
    industryDataMap[c.industry] = (industryDataMap[c.industry] || 0) + (c.annualRevenue || 0);
  });

  const industryChartData = Object.entries(industryDataMap).map(([name, value]) => ({
    name: name.replace(' & ', ' / '),
    value: Math.round(value / 1000) // in k PLN
  }));

  // Sales rep leaderboard
  const repsMap: Record<string, { won: number; totalDeals: number; wonCount: number }> = {};
  deals.forEach(d => {
    if (!repsMap[d.assignedTo]) {
      repsMap[d.assignedTo] = { won: 0, totalDeals: 0, wonCount: 0 };
    }
    repsMap[d.assignedTo].totalDeals += 1;
    if (d.stage === 'won') {
      repsMap[d.assignedTo].won += d.value;
      repsMap[d.assignedTo].wonCount += 1;
    }
  });

  const leaderboard = Object.entries(repsMap).map(([name, stats]) => ({
    name,
    ...stats,
    winRate: stats.totalDeals > 0 ? Math.round((stats.wonCount / stats.totalDeals) * 100) : 0
  })).sort((a, b) => b.won - a.won);

  // Conversion funnel data
  const totalLeads = deals.filter(d => d.stage === 'lead').length;
  const totalQualified = deals.filter(d => d.stage === 'qualification').length;
  const totalProposals = deals.filter(d => d.stage === 'proposal').length;
  const totalNegotiations = deals.filter(d => d.stage === 'negotiation').length;
  const totalWon = deals.filter(d => d.stage === 'won').length;

  const funnelData = [
    { name: '1. Lead', count: totalLeads, fill: '#f59e0b' },
    { name: '2. Kwalifikacja', count: totalQualified, fill: '#0ea5e9' },
    { name: '3. Oferta', count: totalProposals, fill: '#6366f1' },
    { name: '4. Negocjacje', count: totalNegotiations, fill: '#a855f7' },
    { name: '5. Wygrana', count: totalWon, fill: '#10b981' }
  ];

  // CSV Export functions
  const exportClientsCsv = () => {
    const headers = ['Nazwa', 'NIP', 'Branża', 'Status', 'Miasto', 'Telefon', 'Email', 'Roczny Obrot'];
    const rows = clients.map(c => [
      `"${c.name}"`,
      `"${c.nip || ''}"`,
      `"${c.industry}"`,
      `"${c.status}"`,
      `"${c.city}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      c.annualRevenue || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `klienci_crm_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Wyeksportowano listę klientów do CSV', 'success');
  };

  const exportDealsCsv = () => {
    const headers = ['Tytul', 'Klient', 'Wartosc_PLN', 'Etap', 'Priorytet', 'Prawdopodobienstwo', 'Termin', 'Opiekun'];
    const rows = deals.map(d => [
      `"${d.title}"`,
      `"${d.clientName}"`,
      d.value,
      `"${d.stage}"`,
      `"${d.priority}"`,
      d.probability,
      `"${d.expectedCloseDate}"`,
      `"${d.assignedTo}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `szanse_sprzedazy_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Wyeksportowano szanse sprzedaży do CSV', 'success');
  };

  const exportJsonBackup = () => {
    const fullBackup = { clients, deals, activities, tasks, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Pobrano pełną kopię zapasową JSON', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Export Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Eksport i Raportowanie Zarządcze
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pobierz raporty w formacie CSV lub wykonaj pełny backup bazy CRM
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={exportClientsCsv}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Klienci (CSV)</span>
          </button>

          <button
            onClick={exportDealsCsv}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
            <span>Szanse sprzedaży (CSV)</span>
          </button>

          <button
            onClick={exportJsonBackup}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Kopia JSON</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Drukuj / PDF</span>
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Potential Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Potencjał Rynkowy wg Branż (tys. PLN)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Roczny obrót kontrahentów w poszczególnych sektorach
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={v => `${v}k`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                <Tooltip
                  formatter={(value: any) => [`${value} 000 zł`, 'Wartość branży']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel conversion stages */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Konwersja Lejka (Ilość szans na etap)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Przejście leadów do finalizacji kontraktu
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="count" name="Liczba szans" radius={[6, 6, 0, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales Team Performance Leaderboard */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ranking Skuteczności Handlowców
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Wyniki sprzedaży, wartość zamkniętych umów oraz skuteczność (Win Rate)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-4 py-3">Handlowiec / Opiekun</th>
                <th className="px-4 py-3">Zrealizowana sprzedaż</th>
                <th className="px-4 py-3">Wygrane szanse</th>
                <th className="px-4 py-3">Wszystkie prowadzone szanse</th>
                <th className="px-4 py-3">Wskaźnik sukcesu (Win Rate)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((item, idx) => (
                <tr key={item.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{item.name}</span>
                  </td>
                  <td className="px-4 py-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                    {item.won.toLocaleString('pl-PL')} zł
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                    {item.wonCount} umów
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {item.totalDeals}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${item.winRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {item.winRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
