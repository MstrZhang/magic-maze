import { combineReducers } from 'redux';
import userReducer from './user';
import gameStateReducer from './game';
import firebaseReducer from './firebase';

const rootReducer = combineReducers({
  userReducer,
  gameStateReducer,
  firebaseReducer,
});

export default rootReducer;
