import { merge } from 'ramda';

import * as actions from './Application.actions';

const initialState = {
  isInitialScreenVisible: true
};
const application = (state = initialState, {type}) => {
  switch (type) {
    case actions.HIDE_INITIAL_SCREEN:
      return merge(
        state,
        {isInitialScreenVisible: false}
      );
    default:
      return state;
  }
};

export default application;

