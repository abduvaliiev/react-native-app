import React, { Component } from 'react';
import { all, and, equals, gte, isEmpty, length, not, or } from 'ramda';
import { AsyncStorage, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import md5 from 'md5';
import PropTypes from 'prop-types';

import * as actions from './CreatePassword.actions';

const MIN_PASSWORD_LENGTH = 4;
const PASSWORDS_DONT_MATCH_MSG = `Passwords don't match`;
const PASSWORD_TOO_SHORT_MSG = `Minimum ${MIN_PASSWORD_LENGTH} digits`;

export class CreatePassword extends Component {
  state = {
    errorMsg: ' ',
    confirmation: '',
    isValid: false,
    password: ''
  };

  savePassword = async () => {
    try {
      await AsyncStorage.setItem('password', md5(this.state.password));
      this.props.setPasswordCreated();
    } catch(error) {
      console.log(error);
    }
  };

  validate() {
    const {password, confirmation} = this.state;
    const isPasswordEmpty = isEmpty(password);
    const isPasswordValid = gte(length(password), MIN_PASSWORD_LENGTH);
    const isConfirmationEmpty = isEmpty(confirmation);
    const isConfirmationValid = gte(length(confirmation), MIN_PASSWORD_LENGTH);
    const arePasswordsEqual = equals(confirmation, password);
    const arePasswordsNotEmpty = and(not(isPasswordEmpty), not(isConfirmationEmpty));

    if (or(isConfirmationEmpty, isPasswordEmpty)) {
      this.setState({
        valid: false
      });

      return;
    }

    if (all(not, [isPasswordEmpty, isConfirmationEmpty, arePasswordsEqual])) {
      this.setState({
        isValid: false,
        errorMsg: PASSWORDS_DONT_MATCH_MSG
      });

      return;
    }

    if (and(arePasswordsNotEmpty, or(not(isPasswordValid), not(isConfirmationValid)))) {
      this.setState({
        isValid: false,
        errorMsg: PASSWORD_TOO_SHORT_MSG
      });

      return;
    }

    this.setState({
      isValid: true,
      errorMsg: ' '
    })
  }

  handleTextFieldUpdate(text, fieldName) {
    this.setState({[fieldName]: text}, this.validate);
  }

  render() {
    const {isPasswordCreated, isInitialScreenVisible} = this.props;
    const {errorMsg, isValid} = this.state;
    const isComponentVisible = and(not(isPasswordCreated), not(isInitialScreenVisible));

    return isComponentVisible
    ? (
      <View style={styles.container}>
        <Text style={styles.createPasswordMessage}>Create master password</Text>
        <Text style={styles.errorMessage}>{errorMsg}</Text>
        <TextInput
          keyboardType='numeric'
          onChangeText={(text) => this.handleTextFieldUpdate(text, 'password')}
          secureTextEntry
          style={styles.input}
          underlineColorAndroid='transparent'
        />
        <TextInput
          keyboardType='numeric'
          onChangeText={(text) => this.handleTextFieldUpdate(text, 'confirmation')}
          secureTextEntry
          style={styles.input}
          underlineColorAndroid='transparent'
        />
        <Button
          buttonStyle={styles.button}
          containerViewStyle={styles.buttonContainerView}
          disabled={not(isValid)}
          fontSize={25}
          large
          onPress={this.savePassword}
          raised={isValid}
          title='SUBMIT'
        />
      </View>
    )
    : null;
  }
}
CreatePassword.propTypes = {
  isInitialScreenVisible: PropTypes.bool.isRequired,
  isPasswordCreated: PropTypes.bool.isRequired,
  setPasswordCreated: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4773BF',
    borderRadius: 5,
    height: 60
  },
  buttonContainerView: {
    borderRadius: 5,
    height: 60,
    marginTop: 10,
    width: '80%'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2979FF',
    display: 'flex',
    flex: 1
  },
  createPasswordMessage: {
    color: 'white',
    fontSize: 25
  },
  errorMessage: {
    color: 'red',
    fontSize: 15
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
const mapStateToProps = ({createPassword: {isPasswordCreated}}) => ({
  isPasswordCreated
});
const mapDispatchToProps = {
  setPasswordCreated: actions.setPasswordCreated
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePassword);