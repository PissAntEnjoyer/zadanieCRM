import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Deal, DealStage, DealPriority } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealToEdit?: Deal | null;
  defaultStage?: DealStage;
}

export const DealFormModal: React.FC<DealFormModalProps> = ({
  isOpen,
  onClose,
  dealToEdit,
  defaultStage = 'lead'
}) => {
  const { clients, addDeal, updateDeal } = useCrm();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    clientId: clients[0]?.id || '',
    value: 50000,
    stage: defaultStage,
    priority: 'medium' as DealPriority,
    probability: 50,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedTo: currentUser?.name || 'Michał Kowalczyk',
    notes: ''
  });

  useEffect(() => {
    if (dealToEdit) {
      setFormData({
        title: dealToEdit.title,
        clientId: dealToEdit.clientId,
        value: dealToEdit.value,
        stage: dealToEdit.stage,
        priority: dealToEdit.priority,
        probability: dealToEdit.probability,
        expectedCloseDate: dealToEdit.expectedCloseDate,
        assignedTo: dealToEdit.assignedTo,
        notes: dealToEdit.notes || ''
      });
    } else {
      setFormData({
        title: '',
        clientId: clients[0]?.id || '',
        value: 50000,
        stage: defaultStage,
        priority: 'medium',
        probability: defaultStage === 'won' ? 100 : defaultStage === 'proposal' ? 60 : 40,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedTo: currentUser?.name || 'Michał Kowalczyk',
        notes: ''
      });
    }
  }, [dealToEdit, isOpen, defaultStage, clients, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Wprowadź tytuł szansy sprzedaży');
      return;
    }

    const selectedClient = clients.find(c => c.id === formData.clientId);

    const payload = {
      title: formData.title,
      clientId: formData.clientId,
      clientName: selectedClient?.name || 'Klient ogólny',
      value: Number(formData.value) || 0,
      stage: formData.stage,
      priority: formData.priority,
      probability: Number(formData.probability) || 50,
      expectedCloseDate: formData.expectedCloseDate,
      assignedTo: formData.assignedTo,
      notes: formData.notes
    };

    if (dealToEdit) {
      updateDeal(dealToEdit.id, payload);
    } else {
      addDeal(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dealToEdit ? 'Edytuj szansę sprzedaży' : 'Nowa szansa w lejku handlowym'}
      description="Zdefiniuj wartość kontraktu, klienta oraz prawdopodobieństwo sukcesu"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tytuł transakcji / Nazwa projektu *
          </label>
          <input
            type="text"
            required
            placeholder="np. Wdrożenie Platformy B2B + Integracja ERP"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Klient powiązany *
            </label>
            <select
              value={formData.clientId}
              onChange={e => setFormData({ ...formData, clientId: e.target.value })}
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
              Wartość transakcji (PLN netto) *
            </label>
            <input
              type="number"
              required
              step="1000"
              placeholder="75000"
              value={formData.value}
              onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Etap w lejku
            </label>
            <select
              value={formData.stage}
              onChange={e => setFormData({ ...formData, stage: e.target.value as DealStage })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="lead">Nowy Lead</option>
              <option value="qualification">Kwalifikacja</option>
              <option value="proposal">Oferta</option>
              <option value="negotiation">Negocjacje</option>
              <option value="won">Wygrana 🎉</option>
              <option value="lost">Przegrana</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priorytet
            </label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as DealPriority })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Szansa (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={e => setFormData({ ...formData, probability: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Przewidywany termin zamknięcia
            </label>
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={e => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Handlowiec prowadzący
            </label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Opis szansy, konkurencja, uwagi
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
            {dealToEdit ? 'Zapisz zmiany' : 'Utwórz szansę'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
