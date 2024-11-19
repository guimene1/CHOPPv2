import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app, auth } from '../../../firebase'; // Instâncias do Firebase
import './Register.css';
import logo from '../../../Assets/Beer Mapper.svg'; // Importando imagem corretamente

const Register = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const db = getFirestore(app);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Cria o usuário com e-mail e senha
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Salva informações adicionais do usuário no Firestore
            await setDoc(doc(db, 'users', user.uid), {
                nome,
                email,
            });

            alert('Usuário registrado com sucesso!');
            navigate('/login'); // Redireciona para a tela de login
        } catch (error) {
            console.error('Erro ao registrar:', error);
        }
    };

    return (
        <div className="register-container">
            <div className="logo-container">
                <img src={logo} alt="Beer Maper Logo" className="logo" />
            </div>
            <div className="form-container">
                <form onSubmit={handleRegister}>
                    <h2>Registro</h2>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
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
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
