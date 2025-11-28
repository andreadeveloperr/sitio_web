// server.js
// Servidor principal del servicio web

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send({ mensaje: 'Servicio funcionando. Usa /api/auth' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});