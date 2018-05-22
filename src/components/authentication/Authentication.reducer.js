import { merge } from 'ramda';

import * as actions from './Authentication.actions';

const initialState = {
  encryptedPassword: '',
  isAuthenticated: false
};
const authentication = (state = initialState, {type, payload}) => {
  switch (type) {
    case actions.LOG_IN:
      return merge(
        state,
        {isAuthenticated: true}
      );
    case actions.SET_ENCRYPTED_PASSWORD:
      return merge(
        state,
        {encryptedPassword: payload}
      );
    default:
      return state;
    }
};

export default authentication;

