import { AsyncStorage } from 'react-native';
import * as createPasswordActions from '../components/create-password/CreatePassword.actions';

export const HIDE_INITIAL_SCREEN = 'HIDE_INITIAL_SCREEN';

export const getIsPasswordCreated = () => async (dispatch) => {
  try {
    const password = await AsyncStorage.getItem('password');

    password && dispatch({
      type: createPasswordActions.PASSWORD_CREATED
    });
  } catch (error) {
    console.log(error);
  }

  setTimeout(
    () => dispatch({
      type: HIDE_INITIAL_SCREEN
    }),
    2000
  )
};