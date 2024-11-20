import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login/Login';
import Register from './components/pages/Register/Register';
import ListaProdutos from './components/pages/ListarProdutos/ListaProdutos';
import ProdutoForm from './components/pages/ProdutoForm/ProdutoForm';
import Carrinho from './components/pages/Carrinho/Carrinho';
import ListaPedidos from './components/pages/ListarPedidos/ListaPedidos';
import PrivateRoute from './components/pages/PrivateRoute/PrivateRoute';
import EditarProduto from './components/pages/EditarProdutos/EditarProduto';
import Logout from './components/pages/Logout/Logout';
import { AuthProvider } from './components/pages/AuthContext/AuthContext';

const RoutesApp = () => {
    return (
        <AuthProvider>
        <Router>
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

export default RoutesApp;
