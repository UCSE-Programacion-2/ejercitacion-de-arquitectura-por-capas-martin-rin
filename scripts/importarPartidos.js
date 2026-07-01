require('dotenv').config();

const dns = require('dns');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Partido = require('../models/Partido');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const importarPartidos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Conectado a MongoDB');

    const rutaArchivo = path.join(__dirname, '../data/data.json');

    const archivo = fs.readFileSync(rutaArchivo, 'utf-8');

    const datos = JSON.parse(archivo);

    const partidos = Array.isArray(datos) ? datos : datos.partidos;

    if (!Array.isArray(partidos)) {
      throw new Error('El archivo data.json no contiene un arreglo válido de partidos');
    }

    await Partido.deleteMany();

    await Partido.insertMany(partidos);

    console.log('Partidos importados correctamente');

    process.exit();
  } catch (error) {
    console.error('Error al importar partidos:', error.message);
    process.exit(1);
  }
};

importarPartidos();