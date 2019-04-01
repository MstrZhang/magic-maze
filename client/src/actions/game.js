import { CREATE_GAME } from '../common/consts';

const createGame = gameStateID => ({ type: CREATE_GAME, gameStateID });

export default createGame;
