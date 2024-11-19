import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase'; // Configuração do Firebase
import { useNavigate, Link } from 'react-router-dom'; // Link para navegação
import './Login.css';
import logo from '../../../Assets/Beer Mapper.svg'; // Importando a imagem do logo

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
