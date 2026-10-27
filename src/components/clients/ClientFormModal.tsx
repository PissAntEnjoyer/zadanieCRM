import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Client, ClientStatus, Industry } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  clientToEdit
}) => {
  const { addClient, updateClient } = useCrm();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    nip: '',
    industry: 'IT & Nowe Technologie' as Industry,
    status: 'lead' as ClientStatus,
    email: '',
    phone: '',
    website: '',
    city: 'Warszawa',
    address: '',
    assignedTo: currentUser?.name || 'Aleksandra Wiśniewska',
    annualRevenue: 100000,
    tags: 'B2B, Nowy',
    notes: ''
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name,
        legalName: clientToEdit.legalName || '',
        nip: clientToEdit.nip || '',
        industry: clientToEdit.industry,
        status: clientToEdit.status,
        email: clientToEdit.email,
        phone: clientToEdit.phone,
        website: clientToEdit.website || '',
        city: clientToEdit.city,
        address: clientToEdit.address,
        assignedTo: clientToEdit.assignedTo,
        annualRevenue: clientToEdit.annualRevenue || 0,
        tags: clientToEdit.tags.join(', '),
        notes: clientToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        legalName: '',
        nip: '',
        industry: 'IT & Nowe Technologie',
        status: 'lead',
        email: '',
        phone: '',
        website: '',
        city: 'Warszawa',
        address: '',
        assignedTo: currentUser?.name || 'Aleksandra Wiśniewska',
        annualRevenue: 100000,
        tags: 'B2B, Nowy',
        notes: ''
      });
    }
  }, [clientToEdit, isOpen, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Proszę uzupełnić nazwę firmy oraz adres e-mail');
      return;
    }

    const payload = {
      name: formData.name,
      legalName: formData.legalName || formData.name,
      nip: formData.nip,
      industry: formData.industry,
      status: formData.status,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      city: formData.city,
      address: formData.address,
      assignedTo: formData.assignedTo,
      annualRevenue: Number(formData.annualRevenue) || 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      notes: formData.notes
    };

    if (clientToEdit) {
      updateClient(clientToEdit.id, payload);
    } else {
      addClient(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? 'Edytuj dane klienta' : 'Dodaj nowego klienta / firmę'}
      description="Wprowadź dane rejestrowe i kontaktowe kontrahenta"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nazwa skrócona / handlowa *
            </label>
            <input
              type="text"
              required
              placeholder="np. Apex Finanse"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pełna nazwa rejestrowa (KRS)
            </label>
            <input
              type="text"
              placeholder="np. Apex Finanse Sp. z o.o."
              value={formData.legalName}
              onChange={e => setFormData({ ...formData, legalName: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              NIP (Numer Identyfikacji Podatkowej)
            </label>
            <input
              type="text"
              placeholder="np. 5252819034"
              value={formData.nip}
              onChange={e => setFormData({ ...formData, nip: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Branża
            </label>
            <select
              value={formData.industry}
              onChange={e => setFormData({ ...formData, industry: e.target.value as Industry })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="IT & Nowe Technologie">IT & Nowe Technologie</option>
              <option value="Finanse i Bankowość">Finanse i Bankowość</option>
              <option value="E-commerce & Retail">E-commerce & Retail</option>
              <option value="Logistyka & Transport">Logistyka & Transport</option>
              <option value="Produkcja">Produkcja</option>
              <option value="Medycyna & Zdrowie">Medycyna & Zdrowie</option>
              <option value="Nieruchomości">Nieruchomości</option>
              <option value="Inne">Inne</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status relacji
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as ClientStatus })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="lead">Nowy Lead</option>
              <option value="contacted">W kontakcie</option>
              <option value="negotiation">Negocjacje</option>
              <option value="active">Aktywny klient</option>
              <option value="vip">Kluczowy VIP</option>
              <option value="inactive">Nieaktywny</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Szacowany roczny obrót (PLN)
            </label>
            <input
              type="number"
              step="5000"
              placeholder="150000"
              value={formData.annualRevenue}
              onChange={e => setFormData({ ...formData, annualRevenue: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              E-mail główny *
            </label>
            <input
              type="email"
              required
              placeholder="biuro@firma.pl"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Telefon kontaktowy
            </label>
            <input
              type="text"
              placeholder="+48 22 123 45 67"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Miasto
            </label>
            <input
              type="text"
              placeholder="Warszawa"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Adres siedziby
            </label>
            <input
              type="text"
              placeholder="ul. Prosta 1, 00-001 Warszawa"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Strona internetowa
            </label>
            <input
              type="text"
              placeholder="https://firma.pl"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Opiekun handlowy
            </label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tagi (oddzielone przecinkami)
          </label>
          <input
            type="text"
            placeholder="np. Kluczowy, SaaS, Warszawa, Targi"
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notatki i ustalenia wstępne
          </label>
          <textarea
            rows={3}
            placeholder="Kluczowe informacje o specyfice klienta, oczekiwaniach, konkurencji..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
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
            {clientToEdit ? 'Zapisz zmiany' : 'Dodaj klienta'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
