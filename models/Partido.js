const mongoose = require('mongoose');

const partidoSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    home_team: {
      type: String,
      required: true,
      trim: true,
    },
    away_team: {
      type: String,
      required: true,
      trim: true,
    },
    home_score: {
      type: Number,
      required: true,
    },
    away_score: {
      type: Number,
      required: true,
    },
    tournament: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    neutral: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'partidos',
  }
);

module.exports = mongoose.model('Partido', partidoSchema); 