const express = require('express');
const admin = require('../firebaseAdmin');
const router = express.Router();
const { logoutUser } = require('../controller/authController')

router.post('/validate', async (req, res) => {
  const { token } = req.body;

  
  if (!token) {
    return res.status(400).json({ message: 'Token não fornecido' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ message: 'Token válido', uid: decodedToken.uid, email: decodedToken.email });
  } catch (error) {
    console.error('Erro ao validar token:', error);
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
});

router.post('/logout', logoutUser);


module.exports = router;
