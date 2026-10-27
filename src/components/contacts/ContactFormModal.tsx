import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Contact } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit?: Contact | null;
  defaultClientId?: string;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isOpen,
  onClose,
  contactToEdit,
  defaultClientId
}) => {
  const { clients, addContact, updateContact } = useCrm();

  const [formData, setFormData] = useState({
    clientId: defaultClientId || (clients[0]?.id || ''),
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    isPrimary: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    notes: ''
  });

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        clientId: contactToEdit.clientId,
        firstName: contactToEdit.firstName,
        lastName: contactToEdit.lastName,
        role: contactToEdit.role,
        email: contactToEdit.email,
        phone: contactToEdit.phone,
        isPrimary: contactToEdit.isPrimary,
        avatar: contactToEdit.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        notes: contactToEdit.notes || ''
      });
    } else {
      setFormData({
        clientId: defaultClientId || (clients[0]?.id || ''),
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        phone: '',
        isPrimary: false,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        notes: ''
      });
    }
  }, [contactToEdit, isOpen, defaultClientId, clients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      alert('Wypełnij imię, nazwisko oraz adres e-mail');
      return;
    }

    const selectedClient = clients.find(c => c.id === formData.clientId);

    const payload = {
      clientId: formData.clientId,
      clientName: selectedClient?.name || 'Firma nieznana',
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      isPrimary: formData.isPrimary,
      avatar: formData.avatar,
      notes: formData.notes
    };

    if (contactToEdit) {
      updateContact(contactToEdit.id, payload);
    } else {
      addContact(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contactToEdit ? 'Edytuj kontakt' : 'Dodaj nową osobę kontaktową'}
      description="Powiąż osobę z firmą i wprowadź dane teleadresowe"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Firma / Klient powiązany *
          </label>
          <select
            value={formData.clientId}
            onChange={e => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Imię *
            </label>
            <input
              type="text"
              required
              placeholder="np. Jan"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nazwisko *
            </label>
            <input
              type="text"
              required
              placeholder="np. Kowalski"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Stanowisko / Rola w organizacji
          </label>
          <input
            type="text"
            placeholder="np. Dyrektor IT, Chief Operations Officer"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Adres e-mail *
            </label>
            <input
              type="email"
              required
              placeholder="j.kowalski@firma.pl"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Telefon bezpośredni
            </label>
            <input
              type="text"
              placeholder="+48 600 000 000"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isPrimary"
            checked={formData.isPrimary}
            onChange={e => setFormData({ ...formData, isPrimary: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isPrimary" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Główna osoba kontaktowa dla tej firmy (Lead decision maker)
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notatki personalne (preferencje kontaktu, godziny dostępności)
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none resize-none"
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
            {contactToEdit ? 'Zapisz zmiany' : 'Dodaj kontakt'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
