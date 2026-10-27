import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginPage } from './components/auth/LoginPage';

// Main views
import { DashboardView } from './components/dashboard/DashboardView';
import { ClientsList } from './components/clients/ClientsList';
import { ContactsList } from './components/contacts/ContactsList';
import { PipelineBoard } from './components/pipeline/PipelineBoard';
import { ActivitiesList } from './components/activities/ActivitiesList';
import { TasksList } from './components/tasks/TasksList';
import { ReportsView } from './components/reports/ReportsView';

// Quick action modals
import { ClientFormModal } from './components/clients/ClientFormModal';
import { ContactFormModal } from './components/contacts/ContactFormModal';
import { DealFormModal } from './components/pipeline/DealFormModal';
import { LogActivityModal } from './components/activities/LogActivityModal';
import { TaskFormModal } from './components/tasks/TaskFormModal';

const CrmAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeTab, quickActionModal, setQuickActionModal } = useCrm();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Collapsible Navigation Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'clients' && <ClientsList />}
            {activeTab === 'contacts' && <ContactsList />}
            {activeTab === 'pipeline' && <PipelineBoard />}
            {activeTab === 'activities' && <ActivitiesList />}
            {activeTab === 'tasks' && <TasksList />}
            {activeTab === 'reports' && <ReportsView />}
          </div>
        </main>
      </div>

      {/* Global Quick Modals */}
      <ClientFormModal
        isOpen={quickActionModal === 'client'}
        onClose={() => setQuickActionModal(null)}
      />

      <ContactFormModal
        isOpen={quickActionModal === 'contact'}
        onClose={() => setQuickActionModal(null)}
      />

      <DealFormModal
        isOpen={quickActionModal === 'deal'}
        onClose={() => setQuickActionModal(null)}
      />

      <LogActivityModal
        isOpen={quickActionModal === 'activity'}
        onClose={() => setQuickActionModal(null)}
      />

      <TaskFormModal
        isOpen={quickActionModal === 'task'}
        onClose={() => setQuickActionModal(null)}
      />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CrmProvider>
        <CrmAppContent />
      </CrmProvider>
    </AuthProvider>
  );
}

export default App;
