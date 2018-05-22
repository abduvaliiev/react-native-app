import React from 'react';
import { Provider } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import Application from './src/app';
import configureStore from './src/store/store';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <View style={styles.container}>
      <Application />
    </View>
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default App;
