export const SIGNUP_USER = 'SIGNUP_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const CREATE_GAME = 'CREATE_GAME';

export const ACTIONS = [
  'UP',
  'LEFT',
  'DOWN',
  'RIGHT',
  'SEARCH',
  'ESCALATOR',
  'VORTEX',
];

export const rotateList = (array, shift) => {
  for (let i = 0; i < shift; i += 1) {
    array.unshift(array.pop());
  }
  return array;
};
