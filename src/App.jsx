import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Client Views
import ClientOverview from './views/client/ClientOverview';
import ClientROI from './views/client/ClientROI';
import ClientRerouting from './views/client/ClientRerouting';
import ClientBilling from './views/client/ClientBilling';

// Admin CRM Views
import AdminCRM from './views/admin/AdminCRM';
import AdminPLG from './views/admin/AdminPLG';
import AdminNetwork from './views/admin/AdminNetwork';

function DashboardApp() {
  const { activePortal, clientTab, adminTab } = useApp();

  const renderContent = () => {
    if (activePortal === 'client') {
      switch (clientTab) {
        case 'overview':
          return <ClientOverview />;
        case 'roi':
          return <ClientROI />;
        case 'rerouting':
          return <ClientRerouting />;
        case 'billing':
          return <ClientBilling />;
        default:
          return <ClientOverview />;
      }
    } else {
      switch (adminTab) {
        case 'workspaces':
          return <AdminCRM />;
        case 'plg':
          return <AdminPLG />;
        case 'network':
          return <AdminNetwork />;
        default:
          return <AdminCRM />;
      }
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="app-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardApp />
    </AppProvider>
  );
}
