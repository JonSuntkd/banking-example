import React, { useState } from 'react';
import { Layout } from './presentation/components';
import ClientsPage from './presentation/pages/ClientsPage';
import AccountsPage from './presentation/pages/AccountsPage';
import TransactionsPage from './presentation/pages/TransactionsPage';
import ReportsPage from './presentation/pages/ReportsPage';
import './App.css';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('clientes');

  const renderContent = () => {
    switch (activeSection) {
      case 'clientes':
        return <ClientsPage />;
      case 'cuentas':
        return <AccountsPage />;
      case 'movimientos':
        return <TransactionsPage />;
      case 'reportes':
        return <ReportsPage />;
      default:
        return <ClientsPage />;
    }
  };

  return (
    <Layout activeSection={activeSection} onNavigate={setActiveSection}>
      {renderContent()}
    </Layout>
  );
};

export default App;