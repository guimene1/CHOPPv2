// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ListaProdutos from './components/ListaProdutos';
import ProdutoForm from './components/ProdutoForm';
import Carrinho from './components/Carrinho';
import ListaPedidos from './components/ListaPedidos';
import PrivateRoute from './components/PrivateRoute'; // Componente de rota privada
import EditarProduto from './components/EditarProduto';
import Navbar from './components/Navbar';
import Logout from './components/Logout';
import { AuthProvider } from './components/AuthContext';  // Importando o AuthProvider

const App = () => {
  return (
    <AuthProvider> {/* Envolvendo a aplicação com o AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/produtos" element={<PrivateRoute><ListaProdutos /></PrivateRoute>} />
          <Route path="/novo-produto" element={<PrivateRoute><ProdutoForm /></PrivateRoute>} />
          <Route path="/carrinho" element={<PrivateRoute><Carrinho /></PrivateRoute>} />
          <Route path="/listapedidos" element={<PrivateRoute><ListaPedidos /></PrivateRoute>} />
          <Route path="/editarproduto" element={<PrivateRoute><EditarProduto /></PrivateRoute>} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
