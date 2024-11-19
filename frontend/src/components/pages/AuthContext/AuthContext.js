// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../../firebase';  // Certifique-se de que o arquivo Firebase está configurado
import { onAuthStateChanged } from 'firebase/auth';

// Criando o contexto de autenticação
const AuthContext = createContext();

// Provider para envolver a aplicação e fornecer o contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assina a mudança de estado da autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // A verificação foi concluída
    });

    return () => unsubscribe(); // Limpa o listener quando o componente é desmontado
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
