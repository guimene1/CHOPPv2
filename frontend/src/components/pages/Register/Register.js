import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app, auth } from '../../../firebase'; 
import './Register.css';
import logo from '../../../Assets/Beer Mapper.svg'; 

const Register = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    const db = getFirestore(app);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!nome || !email || !password) {
            setError('Todos os campos são obrigatórios.');
            setLoading(false);
            return;
        }

        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                nome,
                email,
            });

            alert('Usuário registrado com sucesso!');
            navigate('/');  
        } catch (error) {
            console.error('Erro ao registrar:', error);

            if (error.code === 'auth/email-already-in-use') {
                setError('O e-mail já está em uso.');
            } else if (error.code === 'auth/weak-password') {
                setError('A senha deve ter pelo menos 6 caracteres.');
            } else {
                setError('Erro ao registrar. Tente novamente mais tarde.');
            }
        } finally {
            setLoading(false);
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
                    {error && <p className="error-message">{error}</p>} 
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
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;