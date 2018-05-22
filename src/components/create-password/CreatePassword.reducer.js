import { merge } from 'ramda';

import * as actions from './CreatePassword.actions';

const initialState = {
  isPasswordCreated: false,
};
const createPassword = (state = initialState, {type}) => {
  switch (type) {
    case actions.PASSWORD_CREATED:
      return merge(
        state,
        {isPasswordCreated: true}
      );
    default:
      return state;
  }
};

export default createPassword;
