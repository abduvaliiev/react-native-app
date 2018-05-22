import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

export const InitialScreen = ({isVisible}) => {
  return isVisible
    ? (
      <View style={styles.container}>
        <Image
          source={require('./logo.png')}
          style={styles.image}
        />
      </View>
    )
    : null
};
InitialScreen.propTypes = {
  isVisible: PropTypes.bool.isRequired
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2979FF',
    display: 'flex',
    flex: 1
  },
  image: {
    height: 200,
    width: 200
  }
});

export default InitialScreen;