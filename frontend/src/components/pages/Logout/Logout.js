import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Método de logout do Firebase
import { auth } from '../../../firebase'; // Configuração do Firebase

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Função para deslogar o usuário
        const handleLogout = async () => {
            try {
                // Desloga o usuário usando o Firebase
                await signOut(auth);

                // Limpa o localStorage para remover o token, se necessário
                localStorage.removeItem('token');

                // Redireciona para a página de login após o logout
                navigate('/');
            } catch (error) {
                console.error('Erro ao deslogar: ', error);
            }
        };

        handleLogout(); // Chama a função para deslogar
    }, [navigate]);

    return <div>Deslogando...</div>; // Pode ser substituído por um spinner ou mensagem amigável
};

export default Logout;
