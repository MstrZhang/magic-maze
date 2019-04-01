import Firebase from '../config/firebase';

export const firebaseInitialState = {
  firebaseInst: new Firebase(),
};

const firebaseReducer = (state = firebaseInitialState) => state;

export default firebaseReducer;
