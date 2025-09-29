import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientList from './views/ClientList';
import AccountList from './views/AccountList';
import TransactionList from './views/TransactionList';
import TransactionReport from './views/TransactionReport';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ClientList />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/reports" element={<TransactionReport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;