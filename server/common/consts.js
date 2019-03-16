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
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_2_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_3_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_4_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_5_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_6_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_7_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_8_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_9_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_10_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
];

const MAZETILE_11_TILE_NEIGHBOUR_CONFIG = [
  { type: NORMAL_TYPE, neighbours: [-1, -1, 4, 1] },
  { type: NORMAL_TYPE, neighbours: [-1, 0, 5, 2] },
  { type: NORMAL_TYPE, neighbours: [null, 1, 6, 3] },
  { type: NORMAL_TYPE, neighbours: [-1, 2, 7, -1] },

  { type: NORMAL_TYPE, neighbours: [0, null, 8, 5] },
  { type: NORMAL_TYPE, neighbours: [1, 4, 9, 6] },
  { type: NORMAL_TYPE, neighbours: [2, 5, 10, 7] },
  { type: NORMAL_TYPE, neighbours: [3, 6, 11, -1] },

  { type: NORMAL_TYPE, neighbours: [4, -1, 12, 9] },
  { type: NORMAL_TYPE, neighbours: [5, 8, 13, 10] },
  { type: NORMAL_TYPE, neighbours: [6, 9, 14, 11] },
  { type: NORMAL_TYPE, neighbours: [7, 10, 15, null] },

  { type: NORMAL_TYPE, neighbours: [8, -1, -1, 13] },
  { type: NORMAL_TYPE, neighbours: [9, 12, null, 14] },
  { type: NORMAL_TYPE, neighbours: [10, 13, -1, 15] },
  { type: NORMAL_TYPE, neighbours: [11, 14, -1, -1] },
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
};
