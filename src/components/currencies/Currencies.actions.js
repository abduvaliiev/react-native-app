import { AsyncStorage } from 'react-native';

export const FETCH_CURRENCIES = 'FETCH_CURRENCIES';
export const FETCH_CURRENCIES_FAIL = 'FETCH_CURRENCIES_FAIL';
export const FETCH_CURRENCIES_SUCCESS = 'FETCH_CURRENCIES_SUCCESS';
export const REFRESH_CURRENCIES = 'REFRESH_CURRENCIES';
export const REFRESH_CURRENCIES_FAIL = 'REFRESH_CURRENCIES_FAIL';
export const REFRESH_CURRENCIES_SUCCESS = 'REFRESH_CURRENCIES_SUCCESS';
export const SET_USER_CURRENCIES = 'SET_USER_CURRENCIES';

export const fetchData = () => ({
  type: FETCH_CURRENCIES,
  payload: {
    request: {
      params: {
        limit: 50
      },
      url: '/ticker'
    }
  }
});
export const getUserCurrencies = () => async (dispatch) => {
  try {
    const userCurrencies = await AsyncStorage.getItem('userCurrencies');

    userCurrencies && dispatch(setUserCurrencies(JSON.parse(userCurrencies)));
  } catch (error) {
    console.log(error);
  }
};

export const handleRefresh = () => ({
  type: REFRESH_CURRENCIES,
  payload: {
    refreshing: true,
    request: {
      params: {
        limit: 50
      },
      url: '/ticker'
    }
  }
});
export const setUserCurrencies = currencies => ({
  payload: currencies,
  type: SET_USER_CURRENCIES
});
