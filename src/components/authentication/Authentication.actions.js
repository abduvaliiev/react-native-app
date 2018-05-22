import { AsyncStorage } from 'react-native';

export const LOG_IN = 'LOG_IN';
export const SET_ENCRYPTED_PASSWORD = 'SET_ENCRYPTED_PASSWORD';

export const getEncryptedPassword = () => async (dispatch) => {
  try {
    const encryptedPassword = await AsyncStorage.getItem('password');

    dispatch({
      type: SET_ENCRYPTED_PASSWORD,
      payload: encryptedPassword
    });
  } catch (error) {
    console.log(error);
  }
};
export const logIn = () => ({
  type: LOG_IN
});