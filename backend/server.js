import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

// Inicialização do Firebase Admin
import serviceAccount from './chopp-d9e06-firebase-adminsdk-zmoxk-a1f63652be.js';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore(); // Firestore Database

const app = express();
const PORT = 5000;

// Setup Middlewares
const setupMiddlewares = () => {
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
    app.use(bodyParser.json());
    app.use(session({
        secret: 'sua-chave-secreta',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 3600000, // Sessão válida por 1 hora
        },
    }));
};

setupMiddlewares();

app.get('/api/test-firestore', async (req, res) => {
    try {
        const testDoc = await db.collection('produtos').doc('test-connection').set({ test: true });
        res.json({ message: 'Conexão com Firestore bem-sucedida!', testDoc });
    } catch (error) {
        console.error('Erro ao conectar com Firestore:', error);
        res.status(500).json({ message: 'Erro ao conectar com Firestore', error });
    }
});

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
    const token = req.session.token;
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    try {
        // Verifique o token da sessão
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Salva as informações do usuário
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

// Rotas de autenticação
app.post('/api/usuarios/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        const token = await admin.auth().createCustomToken(user.uid);

        // Salvar o token no cookie da sessão
        req.session.token = token;
        req.session.user = { email: user.email, uid: user.uid };

        res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

app.get('/api/usuarios/session', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ message: 'Usuário não autenticado' });
    }
});

// Rota de logout
app.post('/api/usuarios/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao encerrar a sessão' });
            } else {
                return res.status(200).json({ message: 'Logout bem-sucedido' });
            }
        });
    } else {
        return res.status(400).json({ message: 'Nenhuma sessão ativa' });
    }
});

// Rotas de produtos
app.get('/api/produtos', async (req, res) => {
    try {
        const snapshot = await db.collection('produtos').get();
        const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos', error });
    }
});

app.post('/api/produtos', authMiddleware, async (req, res) => {
    try {
        console.log('Produto recebido no body:', req.body); // Verifica o payload recebido
        const produto = req.body;

        const docRef = await db.collection('produtos').add(produto);
        console.log('Produto salvo com sucesso no Firestore. ID:', docRef.id); // Verifica o Firestore

        res.status(201).json({ id: docRef.id, ...produto });
    } catch (error) {
        console.error('Erro ao salvar produto no Firestore:', error); // Log de erro
        res.status(500).json({ message: 'Erro ao salvar produto', error });
    }
});

app.put('/api/produtos/:id', authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const produto = req.body;
        await db.collection('produtos').doc(id).set(produto, { merge: true });
        res.json({ id, ...produto });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto', error });
    }
});

app.delete('/api/produtos/:id', authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        await db.collection('produtos').doc(id).delete();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar produto', error });
    }
});

// Iniciar o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
