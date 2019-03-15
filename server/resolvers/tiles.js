const { ObjectId } = require('mongoose').Types;
const {
  ENTRY_TYPE, WALL_TYPE, ESCALATOR_TYPE, VORTEX_TYPE, SEARCH_TYPE, ITEM_TYPE, TIME_TYPE, EXIT_TYPE,
} = require('../common/consts');

module.exports = {
  Tile: {
    __resolveType(tile) {
      switch (tile.type) {
        case ENTRY_TYPE: return 'Entry';
        case WALL_TYPE: return 'Wall';
        case ESCALATOR_TYPE: return 'Escalator';
        case VORTEX_TYPE: return 'Vortex';
        case SEARCH_TYPE: return 'Search';
        case ITEM_TYPE: return 'Item';
        case TIME_TYPE: return 'Time';
        case EXIT_TYPE: return 'Exit';
        default: return 'Normal';
      }
    },
  },
  Query: {
    tile: async (_parent, { tileID }, { models }) => models.Tile.findOne({ _id: ObjectId(tileID) }),
    tiles: async (_parent, { mazeTileID }, { models }) => models.Tile
      .find({ mazeTileID: ObjectId(mazeTileID) })
      .toArray(),
  },
};
