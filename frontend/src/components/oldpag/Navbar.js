import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      {/* Outras links de navegação */}
      <Link to="/logout">Logout</Link> {/* Link para a rota de logout */}
    </nav>
  );
};

export default Navbar;