/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
const WALL_TYPE = 'wall';
const ENTRY_TYPE = 'entry';
const ESCALATOR_TYPE = 'escalator';
const VORTEX_TYPE = 'vortex';
const SEARCH_TYPE = 'search';
const ITEM_TYPE = 'item';
const TIME_TYPE = 'time';
const EXIT_TYPE = 'exit';
const NORMAL_TYPE = 'normal';

const RED = 'red';
const PURPLE = 'purple';
const BLUE = 'blue';
const GREEN = 'green';

// neighbours: [top, left, bottom, right]
const MAZETILE_0_TILE_NEIGHBOUR_CONFIG = [
  { type: TIME_TYPE, neighbours: [-1, -1, -1, 1], used: false, coordinates: { x: 0, y: 0 } },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2], coordinates: { x: 1, y: 0 } },
  { type: SEARCH_TYPE, neighbours: [null, 1, 6, 3], colour: PURPLE, searched: false, coordinates: { x: 2, y: 0 } },
  { type: VORTEX_TYPE, neighbours: [-1, 2, -1, -1], colour: BLUE, coordinates: { x: 3, y: 0 } },

  { type: SEARCH_TYPE, neighbours: [-1, null, -1, 5], colour: RED, searched: false, coordinates: { x: 0, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6], coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7], coordinates: { x: 2, y: 1 } },
  { type: VORTEX_TYPE, neighbours: [-1, 6, -1, -1], colour: PURPLE, coordinates: { x: 3, y: 1 } },

  { type: VORTEX_TYPE, neighbours: [-1, -1, -1, 9], colour: RED, coordinates: { x: 0, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10], coordinates: { x: 1, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, -1], coordinates: { x: 2, y: 2 } },
  { type: SEARCH_TYPE, neighbours: [-1, -1, 15, null], colour: GREEN, searched: false, coordinates: { x: 3, y: 2 } },

  { type: VORTEX_TYPE, neighbours: [-1, -1, -1, 13], colour: GREEN, coordinates: { x: 0, y: 3 } },
  { type: SEARCH_TYPE, neighbours: [9, 12, null, 14], colour: BLUE, searched: false, coordinates: { x: 1, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15], coordinates: { x: 2, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1], coordinates: { x: 3, y: 3 } },
];

const MAZETILE_1_TILE_NEIGHBOUR_CONFIG = [
  { type: EXIT_TYPE, neighbours: [-1, -1, 4, -1], colour: BLUE, coordinates: { x: 0, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 1, y: 0 } },
  { type: SEARCH_TYPE, neighbours: [null, -1, 6, -1], colour: RED, searched: false, coordinates: { x: 2, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 0 } },

  { type: NORMAL_TYPE, neighbours: [0, -1, 8, 5], coordinates: { x: 0, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [-1, 4, -1, 6], coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [2, 5, -1, -1], coordinates: { x: 2, y: 1 } },
  { type: VORTEX_TYPE, neighbours: [-1, -1, 11, -1], colour: BLUE, coordinates: { x: 3, y: 1 } },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, -1], coordinates: { x: 0, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [-1, -1, 13, 10], coordinates: { x: 1, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [-1, 9, 14, -1], coordinates: { x: 2, y: 2 } },
  { type: ENTRY_TYPE, neighbours: [7, -1, 15, null], coordinates: { x: 3, y: 2 } },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13], coordinates: { x: 0, y: 3 } },
  { type: SEARCH_TYPE, neighbours: [9, 12, null, -1], colour: GREEN, searched: false, coordinates: { x: 1, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [10, -1, -1, 15], coordinates: { x: 2, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1], coordinates: { x: 3, y: 3 } },
];

const MAZETILE_2_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1], coordinates: { x: 0, y: 0 } },
  { type: ESCALATOR_TYPE, neighbours: [-1, 0, 5, 2], escalatorID: 0, coordinates: { x: 1, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, 6, 3], coordinates: { x: 2, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, 2, 7, -1], coordinates: { x: 3, y: 0 } },

  { type: SEARCH_TYPE, neighbours: [0, null, 8, 5], colour: BLUE, searched: false, coordinates: { x: 0, y: 1 } },
  { type: WALL_TYPE, neighbours: [1, 4, 9, 6], coordinates: { x: 1, y: 1 } },
  { type: ESCALATOR_TYPE, neighbours: [2, 5, 10, -1], escalatorID: 0, coordinates: { x: 2, y: 1 } },
  { type: VORTEX_TYPE, neighbours: [-1, -1, 11, -1], colour: RED, coordinates: { x: 3, y: 1 } },

  { type: ESCALATOR_TYPE, neighbours: [4, -1, 12, 9], escalatorID: 1, coordinates: { x: 0, y: 2 } },
  { type: WALL_TYPE, neighbours: [5, 8, 13, 10], coordinates: { x: 1, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11], coordinates: { x: 2, y: 2 } },
  { type: ENTRY_TYPE, neighbours: [7, 10, 15, null], coordinates: { x: 3, y: 2 } },

  { type: EXIT_TYPE, neighbours: [8, -1, -1, -1], colour: RED, coordinates: { x: 0, y: 3 } },
  { type: ESCALATOR_TYPE, neighbours: [9, -1, -1, 14], escalatorID: 1, coordinates: { x: 1, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, -1], coordinates: { x: 2, y: 3 } },
  { type: VORTEX_TYPE, neighbours: [11, -1, -1, -1], colour: PURPLE, coordinates: { x: 3, y: 3 } },
];

const MAZETILE_3_TILE_NEIGHBOUR_CONFIG = [
  { type: WALL_TYPE, neighbours: [-1, -1, 4, 1], coordinates: { x: 0, y: 0 } },
  { type: VORTEX_TYPE, neighbours: [-1, 0, 5, 2], colour: PURPLE, coordinates: { x: 1, y: 0 } },
  { type: ENTRY_TYPE, neighbours: [null, 1, 6, 3], coordinates: { x: 2, y: 0 } },
  { type: VORTEX_TYPE, neighbours: [-1, 2, 7, -1], colour: GREEN, coordinates: { x: 3, y: 0 } },

  { type: WALL_TYPE, neighbours: [0, null, 8, 5], coordinates: { x: 0, y: 1 } },
  { type: WALL_TYPE, neighbours: [1, 4, 9, 6], coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7], coordinates: { x: 2, y: 1 } },
  { type: ESCALATOR_TYPE, neighbours: [3, 6, 11, -1], escalatorID: 2, coordinates: { x: 3, y: 1 } },

  { type: WALL_TYPE, neighbours: [4, -1, 12, 9], coordinates: { x: 0, y: 2 } },
  { type: WALL_TYPE, neighbours: [5, 8, 13, 10], coordinates: { x: 1, y: 2 } },
  { type: WALL_TYPE, neighbours: [6, 9, 14, 11], coordinates: { x: 2, y: 2 } },
  { type: SEARCH_TYPE, neighbours: [7, 10, 15, null], colour: RED, searched: false, coordinates: { x: 3, y: 2 } },

  { type: EXIT_TYPE, neighbours: [8, -1, -1, 13], colour: PURPLE, coordinates: { x: 0, y: 3 } },
  { type: ESCALATOR_TYPE, neighbours: [9, 12, null, 14], escalatorID: 2, coordinates: { x: 1, y: 3 } },
  { type: WALL_TYPE, neighbours: [10, 13, -1, 15], coordinates: { x: 2, y: 3 } },
  { type: WALL_TYPE, neighbours: [11, 14, -1, -1], coordinates: { x: 3, y: 3 } },
];

const MAZETILE_4_TILE_NEIGHBOUR_CONFIG = [
  { type: WALL_TYPE, neighbours: [-1, -1, 4, 1], coordinates: { x: 0, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, 0, 5, 2], coordinates: { x: 1, y: 0 } },
  { type: SEARCH_TYPE, neighbours: [null, 1, 6, 3], colour: BLUE, searched: false, coordinates: { x: 2, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, 2, 7, -1], coordinates: { x: 3, y: 0 } },

  { type: VORTEX_TYPE, neighbours: [0, -1, 8, 5], colour: RED, coordinates: { x: 0, y: 1 } },
  { type: WALL_TYPE, neighbours: [1, 4, 9, 6], coordinates: { x: 1, y: 1 } },
  { type: ESCALATOR_TYPE, neighbours: [2, 5, 10, 7], escalatorID: 3, coordinates: { x: 2, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1], coordinates: { x: 3, y: 1 } },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9], coordinates: { x: 0, y: 2 } },
  { type: ESCALATOR_TYPE, neighbours: [5, 8, 13, 10], escalatorID: 3, coordinates: { x: 1, y: 2 } },
  { type: WALL_TYPE, neighbours: [6, 9, 14, 11], coordinates: { x: 2, y: 2 } },
  { type: ENTRY_TYPE, neighbours: [7, 10, 15, null], coordinates: { x: 3, y: 2 } },

  { type: EXIT_TYPE, neighbours: [8, -1, -1, -1], colour: GREEN, coordinates: { x: 0, y: 3 } },
  { type: SEARCH_TYPE, neighbours: [9, -1, null, 14], colour: PURPLE, searched: false, coordinates: { x: 1, y: 3 } },
  { type: WALL_TYPE, neighbours: [10, 13, -1, 15], coordinates: { x: 2, y: 3 } },
  { type: VORTEX_TYPE, neighbours: [11, 14, -1, -1], colour: GREEN, coordinates: { x: 3, y: 3 } },
];

const MAZETILE_5_TILE_NEIGHBOUR_CONFIG = [
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 0, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 1, y: 0 } },
  { type: ITEM_TYPE, neighbours: [-1, -1, 6, -1], colour: BLUE, coordinates: { x: 2, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 0 } },

  { type: SEARCH_TYPE, neighbours: [-1, null, -1, 5], colour: GREEN, searched: false, coordinates: { x: 0, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [-1, 4, 9, 6], coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, -1], coordinates: { x: 2, y: 1 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 1 } },

  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 0, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [5, -1, 13, -1], coordinates: { x: 1, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [6, -1, -1, 11], coordinates: { x: 2, y: 2 } },
  { type: ENTRY_TYPE, neighbours: [-1, 10, 15, null], coordinates: { x: 3, y: 2 } },

  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 0, y: 3 } },
  { type: SEARCH_TYPE, neighbours: [9, -1, null, -1], colour: RED, searched: false, coordinates: { x: 1, y: 3 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 2, y: 3 } },
  { type: VORTEX_TYPE, neighbours: [11, -1, -1, -1], colour: PURPLE, coordinates: { x: 3, y: 3 } },
];

const MAZETILE_6_TILE_NEIGHBOUR_CONFIG = [
  { type: ITEM_TYPE, neighbours: [-1, -1, 4, -1], colour: PURPLE, coordinates: { x: 0, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 1, y: 0 } },
  { type: ENTRY_TYPE, neighbours: [null, -1, 6, -1], coordinates: { x: 2, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 0 } },

  { type: SEARCH_TYPE, neighbours: [0, null, 8, -1], colour: BLUE, searched: false, coordinates: { x: 0, y: 1 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [2, -1, -1, 7], coordinates: { x: 2, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [-1, 6, 11, -1], coordinates: { x: 3, y: 1 } },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9], coordinates: { x: 0, y: 2 } },
  { type: VORTEX_TYPE, neighbours: [-1, 8, -1, -1], colour: RED, coordinates: { x: 1, y: 2 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 2, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [7, -1, 15, -1], coordinates: { x: 3, y: 2 } },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13], coordinates: { x: 0, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [-1, 12, -1, 14], coordinates: { x: 1, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [-1, 13, -1, 15], coordinates: { x: 2, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1], coordinates: { x: 3, y: 3 } },
];

const MAZETILE_7_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1], coordinates: { x: 0, y: 0 } },
  { type: NORMAL_TYPE, neighbours: [-1, 0, -1, 2], coordinates: { x: 1, y: 0 } },
  { type: ENTRY_TYPE, neighbours: [null, 1, -1, 3], coordinates: { x: 2, y: 0 } },
  { type: ITEM_TYPE, neighbours: [-1, 2, -1, -1], colour: GREEN, coordinates: { x: 3, y: 0 } },

  { type: SEARCH_TYPE, neighbours: [0, null, 8, -1], colour: PURPLE, searched: false, coordinates: { x: 0, y: 1 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 1, y: 1 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 2, y: 1 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 1 } },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, -1], coordinates: { x: 0, y: 2 } },
  { type: VORTEX_TYPE, neighbours: [-1, -1, 13, -1], colour: BLUE, coordinates: { x: 1, y: 2 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 2, y: 2 } },
  { type: SEARCH_TYPE, neighbours: [-1, -1, 15, null], colour: RED, searched: false, coordinates: { x: 3, y: 2 } },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13], coordinates: { x: 0, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [9, 12, -1, 14], coordinates: { x: 1, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [-1, 13, -1, 15], coordinates: { x: 2, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1], coordinates: { x: 3, y: 3 } },
];

const MAZETILE_8_TILE_NEIGHBOUR_CONFIG = [
  { type: WALL_TYPE, neighbours: [-1, -1, 4, 1], coordinates: { x: 0, y: 0 } },
  { type: ITEM_TYPE, neighbours: [-1, 0, 5, 2], colour: RED, coordinates: { x: 1, y: 0 } },
  { type: NORMAL_TYPE, neighbours: [-1, 1, 6, 3], coordinates: { x: 2, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, 2, 7, -1], coordinates: { x: 3, y: 0 } },

  { type: ENTRY_TYPE, neighbours: [0, null, 8, 5], coordinates: { x: 0, y: 1 } },
  { type: ESCALATOR_TYPE, neighbours: [-1, 4, 9, -1], escalatorID: 4, coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [2, -1, 10, 7], coordinates: { x: 2, y: 1 } },
  { type: WALL_TYPE, neighbours: [3, 6, 11, -1], coordinates: { x: 3, y: 1 } },

  { type: WALL_TYPE, neighbours: [4, -1, 12, 9], coordinates: { x: 0, y: 2 } },
  { type: WALL_TYPE, neighbours: [5, 8, 13, 10], coordinates: { x: 1, y: 2 } },
  { type: ESCALATOR_TYPE, neighbours: [6, 9, 14, 11], escalatorID: 4, coordinates: { x: 2, y: 2 } },
  { type: VORTEX_TYPE, neighbours: [7, 10, 15, -1], colour: GREEN, coordinates: { x: 3, y: 2 } },

  { type: VORTEX_TYPE, neighbours: [8, -1, -1, 13], colour: BLUE, coordinates: { x: 0, y: 3 } },
  { type: SEARCH_TYPE, neighbours: [9, 12, null, 14], colour: PURPLE, searched: false, coordinates: { x: 1, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15], coordinates: { x: 2, y: 3 } },
  { type: WALL_TYPE, neighbours: [11, 14, -1, -1], coordinates: { x: 3, y: 3 } },
];

const MAZETILE_9_TILE_NEIGHBOUR_CONFIG = [
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 0, y: 0 } },
  { type: TIME_TYPE, neighbours: [-1, -1, 5, -1], used: false, coordinates: { x: 1, y: 0 } },
  { type: SEARCH_TYPE, neighbours: [null, -1, -1, 3], colour: PURPLE, searched: false, coordinates: { x: 2, y: 0 } },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1], coordinates: { x: 3, y: 0 } },

  { type: ENTRY_TYPE, neighbours: [-1, null, 8, -1], coordinates: { x: 0, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [1, -1, 9, 6], coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [-1, 5, 10, 7], coordinates: { x: 2, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [3, 6, -1, -1], coordinates: { x: 3, y: 1 } },

  { type: NORMAL_TYPE, neighbours: [4, -1, -1, 9], coordinates: { x: 0, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, -1], coordinates: { x: 1, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [6, -1, 14, 11], coordinates: { x: 2, y: 2 } },
  { type: VORTEX_TYPE, neighbours: [-1, 10, -1, -1], colour: RED, coordinates: { x: 3, y: 2 } },

  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 0, y: 3 } },
  { type: SEARCH_TYPE, neighbours: [9, -1, null, -1], colour: BLUE, searched: false, coordinates: { x: 1, y: 3 } },
  { type: VORTEX_TYPE, neighbours: [10, -1, -1, -1], colour: GREEN, coordinates: { x: 2, y: 3 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 3 } },
];

const MAZETILE_10_TILE_NEIGHBOUR_CONFIG = [
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 0, y: 0 } },
  { type: NORMAL_TYPE, neighbours: [-1, -1, 5, 2], coordinates: { x: 1, y: 0 } },
  { type: ENTRY_TYPE, neighbours: [null, 1, -1, -1], coordinates: { x: 2, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 0 } },

  { type: SEARCH_TYPE, neighbours: [-1, null, 8, 5], colour: GREEN, searched: false, coordinates: { x: 0, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6], coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [-1, 5, 10, 7], coordinates: { x: 2, y: 1 } },
  { type: VORTEX_TYPE, neighbours: [-1, 6, -1, -1], colour: PURPLE, coordinates: { x: 3, y: 1 } }, // TODO: (Kevin) add right wall to this tile in sprite

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, -1], coordinates: { x: 0, y: 2 } },
  { type: TIME_TYPE, neighbours: [5, -1, -1, -1], used: false, coordinates: { x: 1, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [6, -1, 14, -1], coordinates: { x: 2, y: 2 } },
  { type: SEARCH_TYPE, neighbours: [-1, -1, 15, null], colour: BLUE, searched: false, coordinates: { x: 3, y: 2 } },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13], coordinates: { x: 0, y: 3 } },
  { type: SEARCH_TYPE, neighbours: [-1, 12, null, -1], colour: RED, searched: false, coordinates: { x: 1, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [10, -1, -1, 15], coordinates: { x: 2, y: 3 } },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1], coordinates: { x: 3, y: 3 } },
];

const MAZETILE_11_TILE_NEIGHBOUR_CONFIG = [
  { type: VORTEX_TYPE, neighbours: [-1, -1, 4, -1], colour: BLUE, coordinates: { x: 0, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 1, y: 0 } },
  { type: SEARCH_TYPE, neighbours: [null, -1, 6, -1], colour: GREEN, searched: false, coordinates: { x: 2, y: 0 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 0 } },

  { type: SEARCH_TYPE, neighbours: [0, null, -1, 5], colour: PURPLE, searched: false, coordinates: { x: 0, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [-1, 4, -1, 6], coordinates: { x: 1, y: 1 } },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, -1], coordinates: { x: 2, y: 1 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 1 } },

  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 0, y: 2 } },
  { type: TIME_TYPE, neighbours: [-1, -1, -1, 10], used: false, coordinates: { x: 1, y: 2 } },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11], coordinates: { x: 2, y: 2 } },
  { type: ENTRY_TYPE, neighbours: [-1, 10, -1, null], coordinates: { x: 3, y: 2 } },

  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 0, y: 3 } },
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 1, y: 3 } },
  { type: VORTEX_TYPE, neighbours: [10, -1, -1, -1], colour: RED, coordinates: { x: 2, y: 3 } }, // TODO: (Kevin) add bottom wall to this tile in sprite
  { type: WALL_TYPE, neighbours: [-1, -1, -1, -1], coordinates: { x: 3, y: 3 } },
];

const DIRECTIONS = {
  UP: 0,
  LEFT: 1,
  DOWN: 2,
  RIGHT: 3,
};

const MAZETILE_TILE_CONFIGS = [
  MAZETILE_0_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_1_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_2_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_3_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_4_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_5_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_6_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_7_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_8_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_9_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_10_TILE_NEIGHBOUR_CONFIG,
  MAZETILE_11_TILE_NEIGHBOUR_CONFIG,
];

const CHARACTER_COLOR_CONFIG = [
  RED, PURPLE, BLUE, GREEN,
];

const CHARACTER_COORDINATES_CONFIG = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
];

const TIME = (60000 * 3);

// subscription events
const CREATED_GAMESTATE = 'created_gamestate';
const ENDTIME_UPDATED = 'endtime_updated';
const END_GAME = 'end_game';
const ALL_ITEMS_CLAIMED = 'all_items_claimed';

const MAZETILE_ADDED = 'mazetile_added';

const CHARACTER_COORDINATES_UPDATED = 'char_coords_updated';
const CHARACTER_LOCK = 'char_lock';

const LOBBIES_UPDATED = 'lobbies_updated';
const LOBBY_USER_UPDATED = 'lobby_user_updated';

module.exports = {
  DIRECTIONS,
  WALL_TYPE,
  ENTRY_TYPE,
  ESCALATOR_TYPE,
  VORTEX_TYPE,
  SEARCH_TYPE,
  ITEM_TYPE,
  TIME_TYPE,
  EXIT_TYPE,
  CHARACTER_COLOR_CONFIG,
  CHARACTER_COORDINATES_CONFIG,
  MAZETILE_TILE_CONFIGS,
  TIME,
  CREATED_GAMESTATE,
  ENDTIME_UPDATED,
  END_GAME,
  ALL_ITEMS_CLAIMED,
  MAZETILE_ADDED,
  CHARACTER_COORDINATES_UPDATED,
  CHARACTER_LOCK,
  LOBBIES_UPDATED,
  LOBBY_USER_UPDATED,
};
