export type UserRole = 'admin' | 'manager' | 'sales_rep';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  department: string;
}

export type ClientStatus = 'lead' | 'contacted' | 'negotiation' | 'active' | 'inactive' | 'vip';

export type Industry = 
  | 'IT & Nowe Technologie' 
  | 'Finanse i Bankowość' 
  | 'E-commerce & Retail' 
  | 'Logistyka & Transport' 
  | 'Produkcja' 
  | 'Medycyna & Zdrowie' 
  | 'Nieruchomości' 
  | 'Inne';

export interface Client {
  id: string;
  name: string;
  legalName?: string;
  nip?: string;
  industry: Industry;
  status: ClientStatus;
  email: string;
  phone: string;
  website?: string;
  city: string;
  address: string;
  assignedTo: string;
  annualRevenue?: number;
  tags: string[];
  notes?: string;
  createdAt: string;
  lastContactDate?: string;
}

export interface Contact {
  id: string;
  clientId: string;
  clientName?: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  avatar?: string;
  notes?: string;
  createdAt: string;
}

export type DealStage = 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type DealPriority = 'low' | 'medium' | 'high';

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  value: number; // in PLN
  stage: DealStage;
  priority: DealPriority;
  probability: number; // 0 - 100
  expectedCloseDate: string;
  assignedTo: string;
  notes?: string;
  createdAt: string;
}

export type ActivityType = 'call' | 'meeting' | 'email' | 'note' | 'proposal';

export interface Activity {
  id: string;
  clientId: string;
  clientName?: string;
  contactId?: string;
  contactName?: string;
  type: ActivityType;
  title: string;
  description: string;
  outcome?: string;
  date: string;
  performedBy: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  clientId?: string;
  clientName?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  description?: string;
  createdAt: string;
}

export interface CrmNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  date: string;
  read: boolean;
}

export type ActiveTab = 'dashboard' | 'clients' | 'contacts' | 'pipeline' | 'activities' | 'tasks' | 'reports';
