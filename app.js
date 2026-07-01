require('dotenv').config();

const express = require('express');
const conectarDB = require('./config/db');
const partidoRoutes = require('./routes/partidoRoutes');

const app = express();

app.use(express.json());

conectarDB();

app.get('/', (req, res) => {
  res.send('API REST de Partidos de Fútbol Internacionales');
});

app.use('/partidos', partidoRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada',
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;