import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/logout">Logout</Link>
    </nav>
  );
};

export default Navbar;