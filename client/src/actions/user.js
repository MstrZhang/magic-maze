import { SIGNUP_USER, LOGIN_USER, LOGOUT_USER } from '../common/consts';

export const signupUser = user => ({ type: SIGNUP_USER, payload: user });

export const loginUser = user => ({ type: LOGIN_USER, payload: user });
export const logoutUser = () => ({ type: LOGOUT_USER });
