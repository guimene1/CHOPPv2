import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importa o método do Firebase
import { auth } from '../firebase'; // Importa a configuração do Firebase
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Autentica o usuário com Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Exibe mensagem de sucesso e redireciona
            alert('Login bem-sucedido!');
            console.log('Usuário logado:', user);

            // Salva o token no localStorage (opcional, dependendo do uso)
            const token = await user.getIdToken();
            localStorage.setItem('token', token);

            navigate('/produtos'); // Redireciona para a página de produtos
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Email ou senha incorretos.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
