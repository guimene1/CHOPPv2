const admin = require('../firebaseAdmin');

exports.loginUser = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token não fornecido' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.session.userId = decodedToken.uid;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60,
        });

        res.json({ message: 'Login bem-sucedido!', user: decodedToken });
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

exports.logoutUser = (req, res) => {
    try {
        console.log('Requisição de logout recebida');

        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao destruir sessão:', err);
                return res.status(500).json({ message: 'Erro ao fazer logout' });
            }

            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            });

            console.log('Logout realizado com sucesso');
            res.json({ message: 'Logout realizado com sucesso' });
        });
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        res.status(500).json({ message: 'Erro ao fazer logout' });
    }
};

