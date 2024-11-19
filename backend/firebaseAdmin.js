const admin = require('firebase-admin');

// Inicialize o Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Altere o caminho para o arquivo correto

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
