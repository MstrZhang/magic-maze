module.exports = {
  Tile: {
    __resolveType(tile) {
      switch (tile.type) {
        case 'entry': return 'Entry';
        case 'wall': return 'Wall';
        case 'escalator': return 'Escalator';
        case 'vortex': return 'Vortex';
        case 'search': return 'Search';
        case 'item': return 'Item';
        case 'time': return 'Time';
        case 'exit': return 'Exit';
        default: return 'Normal';
      }
    },
  },
};
