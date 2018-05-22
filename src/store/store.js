import { applyMiddleware, combineReducers, createStore } from 'redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import thunk from 'redux-thunk';

import application from '../app/Application.reducer';
import authentication from '../components/authentication/Authentication.reducer';
import createPassword from '../components/create-password/CreatePassword.reducer';
import currencies from '../components/currencies/Currencies.reducer';

export default function configureStore() {
  const client = axios.create({
    baseURL: 'https://api.coinmarketcap.com/v2',
    responseType: 'json'
  });
  const middleWares = [
    axiosMiddleware(client),
    thunk
  ];
  const reducers = combineReducers({
    application,
    authentication,
    createPassword,
    currencies
  });

  return createStore(reducers, applyMiddleware(...middleWares));
}
