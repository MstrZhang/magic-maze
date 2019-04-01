/* eslint-disable no-param-reassign */
import { LOGIN_USER, LOGOUT_USER, SIGNUP_USER } from '../common/consts';

const initialState = {
  uid: null,
  email: null,
  username: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_USER:
      return {
        ...state,
        ...action.payload,
      };
    case LOGIN_USER:
      return {
        ...state,
        ...action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        uid: null,
        email: null,
        username: null,
      };
    default:
      return state;
  }
};

export default userReducer;
