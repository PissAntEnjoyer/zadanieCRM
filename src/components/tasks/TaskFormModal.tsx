import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Task, TaskPriority, TaskStatus } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  taskToEdit
}) => {
  const { clients, addTask, updateTask } = useCrm();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus,
    assignedTo: currentUser?.name || 'Michał Kowalczyk',
    description: ''
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        clientId: taskToEdit.clientId || '',
        dueDate: taskToEdit.dueDate,
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        assignedTo: taskToEdit.assignedTo,
        description: taskToEdit.description || ''
      });
    } else {
      setFormData({
        title: '',
        clientId: '',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'todo',
        assignedTo: currentUser?.name || 'Michał Kowalczyk',
        description: ''
      });
    }
  }, [taskToEdit, isOpen, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Wprowadź treść zadania');
      return;
    }

    const selectedClient = clients.find(c => c.id === formData.clientId);

    const payload = {
      title: formData.title,
      clientId: formData.clientId || undefined,
      clientName: selectedClient?.name || undefined,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
      assignedTo: formData.assignedTo,
      description: formData.description
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, payload);
    } else {
      addTask(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edytuj zadanie' : 'Nowe zadanie CRM'}
      description="Zaplanuj termin, priorytet i powiąż z klientem"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Treść zadania / Co należy zrobić *
          </label>
          <input
            type="text"
            required
            placeholder="np. Przygotować kalkulację wdrożenia dla zarządu"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Powiązany klient (opcjonalnie)
            </label>
            <select
              value={formData.clientId}
              onChange={e => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="">Brak powiązania (Zadanie ogólne)</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Termin realizacji (Due Date) *
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priorytet
            </label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="high">Wysoki 🔴</option>
              <option value="medium">Średni 🟡</option>
              <option value="low">Niski ⚪</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status zadania
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="todo">Do zrobienia</option>
              <option value="in_progress">W trakcie</option>
              <option value="completed">Zakończone</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Osoba odpowiedzialna
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
            Szczegóły / Instrukcja
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
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
            {taskToEdit ? 'Zapisz zmiany' : 'Dodaj zadanie'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
