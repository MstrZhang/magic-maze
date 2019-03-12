const _ = require('lodash');
const tiles = require('./tiles');

module.exports = _.merge({},
  {
    Orientation: {
      UP: 0,
      RIGHT: 1,
      DOWN: 2,
      LEFT: 3,
    },
  },
  tiles);
