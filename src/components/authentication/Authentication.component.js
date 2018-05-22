import React, { Component } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, TextInput, Vibration, View } from 'react-native';
import { connect } from 'react-redux';
import { and, equals, isEmpty, not } from 'ramda';
import md5 from 'md5';
import PropTypes from 'prop-types';

import * as actions from './Authentication.actions';

export class Authentication extends Component {
  state = {
    isValid: false,
    password: ''
  };

  componentDidMount() {
    this.props.getEncryptedPassword();
  }

  handleTextFieldUpdate(password) {
    this.setState({password}, this.validatePassword)
  }

  validatePassword() {
    const {encryptedPassword} = this.props;
    const {password} = this.state;

    this.setState({
      isValid: not(isEmpty(password))
    });

    if (equals(encryptedPassword, md5(password))) {
      Vibration.vibrate([0, 100, 100, 100]);
      this.props.logIn();
    }
  };

  render() {
    const {isAuthenticated, isInitialScreenVisible} = this.props;
    const isComponentVisible =  and(not(isAuthenticated), not(isInitialScreenVisible));

    return isComponentVisible
      ? (
        <View style={styles.container}>
          <Text style={styles.enterPasswordMessage}>Enter master password</Text>
          <TextInput
            keyboardType='numeric'
            onChangeText={password => this.handleTextFieldUpdate(password)}
            secureTextEntry
            style={styles.input}
            underlineColorAndroid='transparent'
          />
          {/*<Button*/}
            {/*onPress={() => AsyncStorage.removeItem('password')}*/}
            {/*title='Reset password'*/}
          {/*/>*/}
        </View>
      )
      : null;
  }
}
Authentication.propTypes = {
  encryptedPassword: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isInitialScreenVisible: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#2979FF',
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  },
  enterPasswordMessage: {
    color: 'white',
    fontSize: 25
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 40,
    height: 60,
    marginTop: 10,
    textAlign: 'center',
    width: '80%'
  }
});

const mapStateToProps = ({
  authentication: {
    encryptedPassword, isAuthenticated
  }
}) => ({
  encryptedPassword, isAuthenticated
});
const mapDispatchToProps = {
  getEncryptedPassword: actions.getEncryptedPassword,
  logIn: actions.logIn
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);