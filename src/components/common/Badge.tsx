import React from 'react';
import { ClientStatus, DealPriority, DealStage, TaskPriority, ActivityType } from '../../types/crm';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'sky';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const variantStyles = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  };

  const dotStyles = {
    slate: 'bg-slate-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    purple: 'bg-purple-500',
    sky: 'bg-sky-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

export const ClientStatusBadge: React.FC<{ status: ClientStatus }> = ({ status }) => {
  switch (status) {
    case 'vip':
      return <Badge variant="purple" dot>VIP</Badge>;
    case 'active':
      return <Badge variant="emerald" dot>Aktywny</Badge>;
    case 'negotiation':
      return <Badge variant="indigo" dot>Negocjacje</Badge>;
    case 'contacted':
      return <Badge variant="sky" dot>W kontakcie</Badge>;
    case 'lead':
      return <Badge variant="amber" dot>Nowy Lead</Badge>;
    case 'inactive':
      return <Badge variant="slate" dot>Nieaktywny</Badge>;
    default:
      return <Badge variant="slate">{status}</Badge>;
  }
};

export const DealStageBadge: React.FC<{ stage: DealStage }> = ({ stage }) => {
  switch (stage) {
    case 'won':
      return <Badge variant="emerald" dot>Wygrana</Badge>;
    case 'lost':
      return <Badge variant="rose" dot>Przegrana</Badge>;
    case 'negotiation':
      return <Badge variant="purple" dot>Negocjacje</Badge>;
    case 'proposal':
      return <Badge variant="indigo" dot>Oferta</Badge>;
    case 'qualification':
      return <Badge variant="sky" dot>Kwalifikacja</Badge>;
    case 'lead':
      return <Badge variant="amber" dot>Nowy lead</Badge>;
    default:
      return <Badge variant="slate">{stage}</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: DealPriority | TaskPriority }> = ({ priority }) => {
  switch (priority) {
    case 'high':
      return <Badge variant="rose" size="sm">Wysoki</Badge>;
    case 'medium':
      return <Badge variant="amber" size="sm">Średni</Badge>;
    case 'low':
      return <Badge variant="slate" size="sm">Niski</Badge>;
    default:
      return null;
  }
};

export const ActivityTypeBadge: React.FC<{ type: ActivityType }> = ({ type }) => {
  switch (type) {
    case 'call':
      return <Badge variant="sky" size="sm">Telefon</Badge>;
    case 'meeting':
      return <Badge variant="purple" size="sm">Spotkanie</Badge>;
    case 'email':
      return <Badge variant="indigo" size="sm">E-mail</Badge>;
    case 'note':
      return <Badge variant="slate" size="sm">Notatka</Badge>;
    case 'proposal':
      return <Badge variant="emerald" size="sm">Oferta</Badge>;
    default:
      return <Badge variant="slate" size="sm">{type}</Badge>;
  }
};
