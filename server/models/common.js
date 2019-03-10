const mongoose = require('mongoose');

/**
 * Stores any general schemas that may be reused
 * by other models.
 */

const coordinates = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

module.exports = {
  coordinatesSchema: coordinates,
};
