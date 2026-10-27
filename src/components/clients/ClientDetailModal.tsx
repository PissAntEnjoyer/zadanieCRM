import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ClientStatusBadge, ActivityTypeBadge, DealStageBadge } from '../common/Badge';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { ActivityType } from '../../types/crm';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Plus,
  Trash2,
  Edit,
  PhoneCall,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react';

interface ClientDetailModalProps {
  clientId: string | null;
  onClose: () => void;
  onEditClient: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  clientId,
  onClose,
  onEditClient
}) => {
  const {
    getClientById,
    deleteClient,
    getContactsByClient,
    deals,
    activities,
    addActivity,
    setQuickActionModal
  } = useCrm();

  const { currentUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'contacts' | 'deals' | 'info'>('timeline');

  // Quick activity log state
  const [quickActivityType, setQuickActivityType] = useState<ActivityType>('call');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickOutcome, setQuickOutcome] = useState('');

  if (!clientId) return null;
  const client = getClientById(clientId);
  if (!client) return null;

  const clientContacts = getContactsByClient(clientId);
  const clientDeals = deals.filter(d => d.clientId === clientId);
  const clientActivities = activities.filter(a => a.clientId === clientId);

  const handleAddQuickActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addActivity({
      clientId: client.id,
      clientName: client.name,
      type: quickActivityType,
      title: quickTitle,
      description: quickDesc,
      outcome: quickOutcome,
      performedBy: currentUser?.name || 'Handlowiec'
    });

    setQuickTitle('');
    setQuickDesc('');
    setQuickOutcome('');
  };

  return (
    <Modal
      isOpen={!!clientId}
      onClose={onClose}
      title={client.name}
      description={`NIP: ${client.nip || 'Brak'} • Branża: ${client.industry}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              {client.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {client.name}
                </h4>
                <ClientStatusBadge status={client.status} />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {client.city}, {client.address}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Opiekun: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{client.assignedTo}</strong>
                </span>
                {client.annualRevenue ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    {client.annualRevenue.toLocaleString('pl-PL')} zł / rok
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            <button
              onClick={onEditClient}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edytuj</span>
            </button>
            <button
              onClick={() => {
                if (confirm(`Czy na pewno usunąć klienta "${client.name}" oraz powiązane dane?`)) {
                  deleteClient(client.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Usuń</span>
            </button>
          </div>
        </div>

        {/* Contact and Website Direct Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={`mailto:${client.email}`}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50/50 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-800 hover:border-indigo-300 transition-colors text-xs text-slate-700 dark:text-slate-200"
          >
            <Mail className="w-4 h-4 text-indigo-500" />
            <span className="truncate">{client.email}</span>
          </a>
          <a
            href={`tel:${client.phone}`}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-sky-50/50 dark:bg-slate-800/40 border border-sky-100 dark:border-slate-800 hover:border-sky-300 transition-colors text-xs text-slate-700 dark:text-slate-200"
          >
            <Phone className="w-4 h-4 text-sky-500" />
            <span className="truncate">{client.phone}</span>
          </a>
          {client.website ? (
            <a
              href={client.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/40 border border-purple-100 dark:border-slate-800 hover:border-purple-300 transition-colors text-xs text-slate-700 dark:text-slate-200"
            >
              <Globe className="w-4 h-4 text-purple-500" />
              <span className="truncate">{client.website.replace('https://', '')}</span>
              <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
            </a>
          ) : (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              <Globe className="w-4 h-4" />
              <span>Brak strony www</span>
            </div>
          )}
        </div>

        {/* Sub-Tabs Nav */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Historia & Interakcje ({clientActivities.length})
          </button>
          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'contacts'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Osoby kontaktowe ({clientContacts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('deals')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'deals'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Szanse sprzedaży ({clientDeals.length})
          </button>
          <button
            onClick={() => setActiveSubTab('info')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'info'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Informacje & Tagi
          </button>
        </div>

        {/* Sub-Tab 1: TIMELINE */}
        {activeSubTab === 'timeline' && (
          <div className="space-y-4">
            {/* Quick Activity Logger Box */}
            <form
              onSubmit={handleAddQuickActivity}
              className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Szybki wpis do historii relacji
                </span>
                <div className="flex items-center gap-1">
                  {(['call', 'meeting', 'email', 'note'] as ActivityType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuickActivityType(type)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-all ${
                        quickActivityType === type
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {type === 'call' && 'Telefon'}
                      {type === 'meeting' && 'Spotkanie'}
                      {type === 'email' && 'E-mail'}
                      {type === 'note' && 'Notatka'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Tytuł interakcji (np. Ustalenia ws. terminu wdrożenia)"
                  value={quickTitle}
                  onChange={e => setQuickTitle(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Wynik / Następny krok (np. Przesłać wycenę do piątku)"
                  value={quickOutcome}
                  onChange={e => setQuickOutcome(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Szczegóły rozmowy, pytania klienta, ustalenia..."
                value={quickDesc}
                onChange={e => setQuickDesc(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Zapisz interakcję
                </button>
              </div>
            </form>

            {/* Timeline Events List */}
            <div className="space-y-3">
              {clientActivities.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Brak wpisów w historii tego klienta. Dodaj pierwszy powyżej!
                </p>
              ) : (
                clientActivities.map(act => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ActivityTypeBadge type={act.type} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {act.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(act.date).toLocaleString('pl-PL')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {act.description}
                    </p>

                    {act.outcome && (
                      <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-100 dark:border-emerald-900/40">
                        <strong>Kolejny krok:</strong> {act.outcome}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 pt-1">
                      Zarejestrował: {act.performedBy}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Sub-Tab 2: CONTACTS */}
        {activeSubTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Osoby decyzyjne i operacyjne w tej organizacji
              </span>
              <button
                onClick={() => setQuickActionModal('contact')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dodaj osobę kontaktową</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clientContacts.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-xs text-slate-400">
                  Brak przypisanych osób kontaktowych do tej firmy.
                </div>
              ) : (
                clientContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center gap-3.5"
                  >
                    <img
                      src={contact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={contact.firstName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {contact.firstName} {contact.lastName}
                        </span>
                        {contact.isPrimary && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                            Główny
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{contact.role}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <a href={`tel:${contact.phone}`} className="hover:text-indigo-600">
                          {contact.phone}
                        </a>
                        <span>•</span>
                        <a href={`mailto:${contact.email}`} className="hover:text-indigo-600 truncate">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Sub-Tab 3: DEALS */}
        {activeSubTab === 'deals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Wszystkie szanse handlowe i przetargi
              </span>
              <button
                onClick={() => setQuickActionModal('deal')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nowa szansa</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {clientDeals.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Brak zarejestrowanych szans sprzedaży dla tego klienta.
                </div>
              ) : (
                clientDeals.map(deal => (
                  <div
                    key={deal.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        {deal.title}
                      </h5>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>Opiekun: {deal.assignedTo}</span>
                        <span>•</span>
                        <span>Data zamknięcia: {deal.expectedCloseDate}</span>
                        <span>•</span>
                        <span>Szansa: {deal.probability}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DealStageBadge stage={deal.stage} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {deal.value.toLocaleString('pl-PL')} zł
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Sub-Tab 4: INFO & TAGS */}
        {activeSubTab === 'info' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-slate-400">Pełna nazwa KRS:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {client.legalName || client.name}
                </p>
              </div>
              <div>
                <span className="text-slate-400">NIP:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {client.nip || 'Brak danych'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Branża:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {client.industry}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Data dodania do bazy:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {new Date(client.createdAt).toLocaleDateString('pl-PL')}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Przypisane etykiety (Tagi):
              </span>
              <div className="flex flex-wrap gap-2">
                {client.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-slate-700"
                  >
                    <Tag className="w-3 h-3 text-indigo-500" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {client.notes && (
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Notatki o kliencie:
                </span>
                <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {client.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
