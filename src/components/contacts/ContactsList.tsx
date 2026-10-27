import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Contact } from '../../types/crm';
import { ContactFormModal } from './ContactFormModal';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  Star,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const ContactsList: React.FC = () => {
  const { contacts, clients, deleteContact, setSelectedClientId, setActiveTab } = useCrm();

  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(c => {
    const query = search.toLowerCase();
    const matchesSearch =
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
      c.role.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.clientName && c.clientName.toLowerCase().includes(query));

    const matchesCompany = selectedCompany === 'all' || c.clientId === selectedCompany;

    return matchesSearch && matchesCompany;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Szukaj po imieniu, nazwisku, stanowisku, mailu lub firmie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Company Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 outline-none max-w-[200px] truncate"
          >
            <option value="all">Wszystkie firmy ({contacts.length})</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setContactToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj kontakt</span>
          </button>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={contact.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={`${contact.firstName} ${contact.lastName}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-slate-700"
                    />
                    {contact.isPrimary && (
                      <span
                        title="Główna osoba kontaktowa"
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-xs text-[10px]"
                      >
                        <Star className="w-3 h-3 fill-current" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {contact.firstName} {contact.lastName}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {contact.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setContactToEdit(contact);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edytuj kontakt"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Czy na pewno usunąć kontakt ${contact.firstName} ${contact.lastName}?`)) {
                        deleteContact(contact.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                    title="Usuń"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Company affiliation */}
              <div className="mb-3">
                <button
                  onClick={() => {
                    setSelectedClientId(contact.clientId);
                    setActiveTab('clients');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{contact.clientName}</span>
                </button>
              </div>

              {/* Direct channels */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${contact.email}`} className="truncate hover:text-indigo-600">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`tel:${contact.phone}`} className="hover:text-indigo-600">
                    {contact.phone}
                  </a>
                </div>
              </div>

              {contact.notes && (
                <p className="text-[11px] text-slate-400 italic line-clamp-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  „{contact.notes}”
                </p>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-xl text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Zadzwoń</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Napisz e-mail</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setContactToEdit(null);
        }}
        contactToEdit={contactToEdit}
      />
    </div>
  );
};
