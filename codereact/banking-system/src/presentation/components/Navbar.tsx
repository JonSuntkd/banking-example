import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo">BANCO</div>
      <ul className="nav-links">
        <li><Link to="/">Clientes</Link></li>
        <li><Link to="/accounts">Cuentas</Link></li>
        <li><Link to="/transactions">Movimientos</Link></li>
        <li><Link to="/reports">Reportes</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;