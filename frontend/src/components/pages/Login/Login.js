import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useNavigate, Link } from 'react-router-dom'; 
import './Login.css';
import logo from '../../../Assets/Beer Mapper.svg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            alert('Login bem-sucedido!');
            console.log('Usuário logado:', user);

            // Obter token JWT do Firebase
            const token = await user.getIdToken();

            // Enviar token para o backend
            const response = await fetch('http://localhost:3001/auth/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error('Erro no login do backend');
            }

            localStorage.setItem('token', token); // Opcional: Salvar no frontend
            navigate('/produtos');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            navigate('/produtos');
        }
    };

    return (
        <div className="login-container">
            <div className="logo-container">
                <img src={logo} alt="Beer Maper Logo" className="logo" />
            </div>
            <div className="form-container">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
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
                    <button type="submit">Entrar</button>
                </form>
                <p className="redirect-register">
                    Não tem uma conta? <Link to="/Register">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
