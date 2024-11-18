// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Usando o hook para acessar o contexto

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();  // Acessando o estado de autenticação do contexto

  if (loading) {
    return <div>Loading...</div>;  // Enquanto a autenticação está sendo verificada
  }

  // Se o usuário não estiver autenticado, redireciona para a página inicial
  if (!user) {
    return <Navigate to="/" />;
  }

  // Se o usuário estiver autenticado, renderiza o componente protegido
  return children;
};

export default PrivateRoute;
