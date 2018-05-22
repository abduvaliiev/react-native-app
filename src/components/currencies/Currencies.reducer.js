import { map, merge, pick, values } from 'ramda';
import * as actions from './Currencies.actions';

const initialState = {
  data: [],
  isLoading: false,
  refreshing: false,
  requestFailed: false,
  userCurrencies: []
};
const currencies = (state = initialState, {type, payload}) => {
  switch (type) {
    case actions.FETCH_CURRENCIES:
      return merge(
        state,
        {isLoading: true}
      );
    case actions.FETCH_CURRENCIES_SUCCESS:
      return merge(
        state,
        {
          isLoading: false,
          requestFailed: false,
          data: map(pick(['quotes', 'symbol', 'name', 'id']), values(payload.data.data))
        }
      );
    case actions.FETCH_CURRENCIES_FAIL:
      return merge(
        state,
        {
          isLoading: false,
          requestFailed: true
        }
      );
    case actions.REFRESH_CURRENCIES:
      return merge(
        state,
        {refreshing: true}
      );
    case actions.REFRESH_CURRENCIES_FAIL:
      return merge(
        state,
        {refreshing: false}
      );
    case actions.REFRESH_CURRENCIES_SUCCESS:
      return merge(
        state,
        {
          refreshing: false,
          requestFailed: false,
          data: map(pick(['quotes', 'symbol', 'name', 'id']), values(payload.data.data))
        }
      );
    case actions.SET_USER_CURRENCIES:
      return merge(
        state,
        {userCurrencies: payload}
      );
    default:
      return state;
  }
};

export default currencies;

