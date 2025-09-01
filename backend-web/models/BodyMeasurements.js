const mongoose = require('mongoose');

const bodyMeasurementsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  height: { type: Number, required: true },
  chest: { type: Number },
  waist: { type: Number },
  hips: { type: Number },
  inseam: { type: Number },
  shoulder: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('BodyMeasurements', bodyMeasurementsSchema);
