import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ActivityType } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClientId?: string;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  defaultClientId
}) => {
  const { clients, contacts, addActivity } = useCrm();
  const { currentUser } = useAuth();

  const [type, setType] = useState<ActivityType>('call');
  const [clientId, setClientId] = useState<string>(defaultClientId || (clients[0]?.id || ''));
  const [contactId, setContactId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState('');

  const clientContacts = contacts.filter(c => c.clientId === clientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Wprowadź temat interakcji');
      return;
    }

    const client = clients.find(c => c.id === clientId);
    const contact = contacts.find(c => c.id === contactId);

    addActivity({
      clientId,
      clientName: client?.name,
      contactId: contactId || undefined,
      contactName: contact ? `${contact.firstName} ${contact.lastName}` : undefined,
      type,
      title,
      description,
      outcome: outcome || undefined,
      performedBy: currentUser?.name || 'Handlowiec'
    });

    onClose();
    setTitle('');
    setDescription('');
    setOutcome('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Zarejestruj kontakt z klientem"
      description="Dodaj wpis do historii: rozmowa telefoniczna, spotkanie, korespondencja e-mail"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Typ kontaktu *
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'call', label: 'Telefon' },
              { id: 'meeting', label: 'Spotkanie' },
              { id: 'email', label: 'E-mail' },
              { id: 'proposal', label: 'Oferta' },
              { id: 'note', label: 'Notatka' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as ActivityType)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                  type === item.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Client & Contact Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Klient / Firma *
            </label>
            <select
              value={clientId}
              onChange={e => {
                setClientId(e.target.value);
                setContactId('');
              }}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Osoba kontaktowa (opcjonalnie)
            </label>
            <select
              value={contactId}
              onChange={e => setContactId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="">Wybierz osobę...</option>
              {clientContacts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Temat / Podsumowanie *
          </label>
          <input
            type="text"
            required
            placeholder="np. Negocjacje rabatu na licencje Q1"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Szczegółowy opis rozmowy / notatki
          </label>
          <textarea
            rows={3}
            placeholder="Kluczowe argumenty, wątpliwości klienta, uzgodnienia..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none resize-none"
          />
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Wynik i następny krok (Follow-up)
          </label>
          <input
            type="text"
            placeholder="np. Przesłać ofertę wariantu B do czwartku 14:00"
            value={outcome}
            onChange={e => setOutcome(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="text-xs font-semibold px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95"
          >
            Zapisz w historii
          </button>
        </div>
      </form>
    </Modal>
  );
};
