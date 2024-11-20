import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; 
import { auth } from '../../../firebase';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                console.log('Iniciando logout no Firebase...');
                await signOut(auth);  

                console.log('Solicitando logout no backend...');
                const response = await fetch('http://localhost:3001/auth/logout', {
                    method: 'POST',
                    credentials: 'include', 
                });

                if (!response.ok) {
                    throw new Error('Erro ao deslogar no backend');
                }

                console.log('Logout realizado com sucesso no backend.');
                localStorage.removeItem('token');  
                navigate('/');  
            } catch (error) {
                console.error('Erro ao deslogar:', error);
            }
        };

        handleLogout();
    }, [navigate]);

    return <div>Deslogando...</div>;
};

export default Logout;
