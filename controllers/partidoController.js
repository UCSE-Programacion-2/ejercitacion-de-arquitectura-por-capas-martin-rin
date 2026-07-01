const mongoose = require('mongoose');
const Partido = require('../models/Partido');

const escaparRegex = (texto) => {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const obtenerPartidos = async (req, res) => {
  try {
    const limite = Number(req.query.limite || req.query.limit) || 20;

    const partidos = await Partido.find()
      .limit(limite)
      .sort({ date: -1 });

    res.status(200).json(partidos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener los partidos',
      error: error.message,
    });
  }
};

const obtenerPartidoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensaje: 'ID inválido',
      });
    }

    const partido = await Partido.findById(id);

    if (!partido) {
      return res.status(404).json({
        mensaje: 'Partido no encontrado',
      });
    }

    res.status(200).json(partido);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al buscar el partido',
      error: error.message,
    });
  }
};

const crearPartido = async (req, res) => {
  try {
    const nuevoPartido = await Partido.create(req.body);

    res.status(201).json(nuevoPartido);
  } catch (error) {
    res.status(400).json({
      mensaje: 'Error al crear el partido',
      error: error.message,
    });
  }
};

const actualizarPartido = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensaje: 'ID inválido',
      });
    }

    const partidoActualizado = await Partido.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!partidoActualizado) {
      return res.status(404).json({
        mensaje: 'Partido no encontrado',
      });
    }

    res.status(200).json(partidoActualizado);
  } catch (error) {
    res.status(400).json({
      mensaje: 'Error al actualizar el partido',
      error: error.message,
    });
  }
};

const eliminarPartido = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensaje: 'ID inválido',
      });
    }

    const partidoEliminado = await Partido.findByIdAndDelete(id);

    if (!partidoEliminado) {
      return res.status(404).json({
        mensaje: 'Partido no encontrado',
      });
    }

    res.status(200).json({
      mensaje: 'Partido eliminado correctamente',
      partido: partidoEliminado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar el partido',
      error: error.message,
    });
  }
};

const obtenerPartidosPorTorneo = async (req, res) => {
  try {
    const { torneo } = req.params;

    const partidos = await Partido.find({
      tournament: {
        $regex: escaparRegex(torneo),
        $options: 'i',
      },
    }).sort({ date: -1 });

    res.status(200).json(partidos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al buscar partidos por torneo',
      error: error.message,
    });
  }
};

const obtenerPartidosPorEquipo = async (req, res) => {
  try {
    const { equipo } = req.params;

    const equipoBuscado = escaparRegex(equipo);

    const partidos = await Partido.find({
      $or: [
        {
          home_team: {
            $regex: equipoBuscado,
            $options: 'i',
          },
        },
        {
          away_team: {
            $regex: equipoBuscado,
            $options: 'i',
          },
        },
      ],
    }).sort({ date: -1 });

    res.status(200).json(partidos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al buscar partidos por equipo',
      error: error.message,
    });
  }
};

const obtenerPartidosPorFecha = async (req, res) => {
  try {
    const { rango } = req.params;

    const regexRango = /^(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})$/;
    const resultado = rango.match(regexRango);

    if (!resultado) {
      return res.status(400).json({
        mensaje: 'Formato de fecha inválido. Usar: YYYY-MM-DD-YYYY-MM-DD',
      });
    }

    const fechaInicio = new Date(resultado[1]);
    const fechaFin = new Date(resultado[2]);

    fechaFin.setHours(23, 59, 59, 999);

    const partidos = await Partido.find({
      date: {
        $gte: fechaInicio,
        $lte: fechaFin,
      },
    }).sort({ date: 1 });

    res.status(200).json(partidos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al buscar partidos por fecha',
      error: error.message,
    });
  }
};

module.exports = {
  obtenerPartidos,
  obtenerPartidoPorId,
  crearPartido,
  actualizarPartido,
  eliminarPartido,
  obtenerPartidosPorTorneo,
  obtenerPartidosPorEquipo,
  obtenerPartidosPorFecha,
};