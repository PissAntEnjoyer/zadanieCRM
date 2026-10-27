import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client,
  Contact,
  Deal,
  Activity,
  Task,
  CrmNotification,
  DealStage,
  ActiveTab
} from '../types/crm';
import {
  initialClients,
  initialContacts,
  initialDeals,
  initialActivities,
  initialTasks,
  initialNotifications
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CrmContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Contact;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContactsByClient: (clientId: string) => Contact[];

  // Deals
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Deal;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  moveDealStage: (id: string, stage: DealStage) => void;

  // Activities
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => Activity;
  deleteActivity: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, task: Partial<Task>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  // Notifications
  notifications: CrmNotification[];
  markAllNotificationsAsRead: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Quick Action Modals
  quickActionModal: 'client' | 'contact' | 'deal' | 'activity' | 'task' | null;
  setQuickActionModal: (modal: 'client' | 'contact' | 'deal' | 'activity' | 'task' | null) => void;

  // Reset
  resetToDemoData: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLIENTS: 'nexus_crm_clients',
  CONTACTS: 'nexus_crm_contacts',
  DEALS: 'nexus_crm_deals',
  ACTIVITIES: 'nexus_crm_activities',
  TASKS: 'nexus_crm_tasks',
  NOTIFICATIONS: 'nexus_crm_notifications',
  DARK_MODE: 'nexus_crm_dark_mode'
};

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickActionModal, setQuickActionModal] = useState<'client' | 'contact' | 'deal' | 'activity' | 'task' | null>(null);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Clients
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return saved ? JSON.parse(saved) : initialClients;
  });

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return saved ? JSON.parse(saved) : initialContacts;
  });

  // Deals
  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEALS);
    return saved ? JSON.parse(saved) : initialDeals;
  });

  // Activities
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : initialActivities;
  });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  // Notifications
  const [notifications, setNotifications] = useState<CrmNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Clients CRUD
  const addClient = (data: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...data,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setClients(prev => [newClient, ...prev]);
    showToast(`Dodano klienta: ${newClient.name}`, 'success');
    return newClient;
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    showToast('Zaktualizowano dane klienta', 'info');
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));
    // Also remove reference from contacts, deals, activities
    setContacts(prev => prev.filter(c => c.clientId !== id));
    setDeals(prev => prev.filter(d => d.clientId !== id));
    if (selectedClientId === id) {
      setSelectedClientId(null);
    }
    showToast(`Usunięto klienta: ${client?.name || ''}`, 'warning');
  };

  const getClientById = (id: string) => clients.find(c => c.id === id);

  // Contacts CRUD
  const addContact = (data: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...data,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setContacts(prev => [newContact, ...prev]);
    showToast(`Dodano kontakt: ${newContact.firstName} ${newContact.lastName}`, 'success');
    return newContact;
  };

  const updateContact = (id: string, data: Partial<Contact>) => {
    setContacts(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    showToast('Zaktualizowano kontakt', 'info');
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast('Usunięto kontakt', 'warning');
  };

  const getContactsByClient = (clientId: string) => contacts.filter(c => c.clientId === clientId);

  // Deals CRUD
  const addDeal = (data: Omit<Deal, 'id' | 'createdAt'>) => {
    const newDeal: Deal = {
      ...data,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDeals(prev => [newDeal, ...prev]);
    showToast(`Utworzono szansę: ${newDeal.title}`, 'success');
    return newDeal;
  };

  const updateDeal = (id: string, data: Partial<Deal>) => {
    setDeals(prev => prev.map(d => (d.id === id ? { ...d, ...data } : d)));
    showToast('Zaktualizowano szansę sprzedaży', 'info');
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    showToast('Usunięto szansę sprzedaży', 'warning');
  };

  const moveDealStage = (id: string, newStage: DealStage) => {
    setDeals(prev =>
      prev.map(d => {
        if (d.id === id) {
          const prob = newStage === 'won' ? 100 : newStage === 'lost' ? 0 : d.probability;
          return { ...d, stage: newStage, probability: prob };
        }
        return d;
      })
    );
    const stageNames: Record<DealStage, string> = {
      lead: 'Nowy Lead',
      qualification: 'Kwalifikacja',
      proposal: 'Prezentacja oferty',
      negotiation: 'Negocjacje',
      won: 'Wygrana 🎉',
      lost: 'Przegrana'
    };
    showToast(`Przeniesiono do etapu: ${stageNames[newStage]}`, 'info');
  };

  // Activities
  const addActivity = (data: Omit<Activity, 'id' | 'date'>) => {
    const newActivity: Activity = {
      ...data,
      id: `act-${Date.now()}`,
      date: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);

    // Update client last contact date
    if (data.clientId) {
      setClients(prev =>
        prev.map(c => (c.id === data.clientId ? { ...c, lastContactDate: newActivity.date } : c))
      );
    }

    showToast(`Zarejestrowano kontakt: ${newActivity.title}`, 'success');
    return newActivity;
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('Usunięto wpis interakcji', 'warning');
  };

  // Tasks
  const addTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`Dodano zadanie: ${newTask.title}`, 'success');
    return newTask;
  };

  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
    showToast('Zaktualizowano zadanie', 'info');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Usunięto zadanie', 'warning');
  };

  // Notifications
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Oznaczono powiadomienia jako przeczytane', 'info');
  };

  // Reset
  const resetToDemoData = () => {
    setClients(initialClients);
    setContacts(initialContacts);
    setDeals(initialDeals);
    setActivities(initialActivities);
    setTasks(initialTasks);
    setNotifications(initialNotifications);
    showToast('Przywrócono domyślne dane demonstracyjne', 'info');
  };

  return (
    <CrmContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedClientId,
        setSelectedClientId,
        searchQuery,
        setSearchQuery,
        darkMode,
        toggleDarkMode,
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        getContactsByClient,
        deals,
        addDeal,
        updateDeal,
        deleteDeal,
        moveDealStage,
        activities,
        addActivity,
        deleteActivity,
        tasks,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        notifications,
        markAllNotificationsAsRead,
        toasts,
        showToast,
        removeToast,
        quickActionModal,
        setQuickActionModal,
        resetToDemoData
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
