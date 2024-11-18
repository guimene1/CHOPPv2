import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app, auth } from '../firebase'; // Certifique-se de que 'app' e 'auth' são suas instâncias inicializadas do Firebase.
import './css/Register.css';

const Register = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        } catch (error) {
            console.error('Erro ao registrar:', error);
        }
    };

    return (
        <form onSubmit={handleRegister}>
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
    );
};

export default Register;
