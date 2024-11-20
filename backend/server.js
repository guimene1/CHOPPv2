const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const sessionConfig = require('./sessionConfig');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session(sessionConfig));
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});