import React, { Component, Fragment } from 'react';
import { all, identity, not } from 'ramda';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';
import Tabs from 'react-native-tabs';

import * as actions from './Application.actions';
import * as currenciesActions from '../components/currencies/Currencies.actions';
import { Assets, Authentication, CreatePassword, Currencies, InitialScreen } from '../components';

const CurrentPage = ({currentPage, setUserCurrencies}) => {
  switch (currentPage) {
    case 'currencies':
      return <Currencies />;
    case 'assets':
      return <Assets setUserCurrencies={setUserCurrencies} />;
    default:
      return <Currencies />
  }
};
CurrentPage.propTypes = {
  currentPage: PropTypes.string.isRequired,
  setUserCurrencies: PropTypes.func.isRequired
};

export class Application extends Component {
  state = {
    currentPage: 'currencies',
    isPasswordCreated: false,
  };

  componentWillMount() {
    this.props.getIsPasswordCreated();
  }

  setCurrentPage = element => this.setState({currentPage: element.props.name});

  render() {
    const {
      isAuthenticated, isInitialScreenVisible, isLoading, isPasswordCreated, setUserCurrencies
    } = this.props;
    const {currentPage} = this.state;
    const showApplication = all(identity, [isAuthenticated, isPasswordCreated, not(isInitialScreenVisible)]);

    return (
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        <StatusBar hidden />
        <InitialScreen isVisible={isInitialScreenVisible} />
        <CreatePassword isInitialScreenVisible={isInitialScreenVisible} />
        {isPasswordCreated && <Authentication isInitialScreenVisible={isInitialScreenVisible} />}
        {showApplication &&
          <Fragment>
            <CurrentPage
              currentPage={currentPage}
              setUserCurrencies={setUserCurrencies}
            />
            <Tabs
              selected={currentPage}
              style={styles.tabs}
              selectedStyle={styles.selectedTab}
              onSelect={this.setCurrentPage}
            >
              <Text selectedIconStyle={styles.tabTextStyle} name='currencies'>Currencies</Text>
              <Text selectedIconStyle={styles.tabTextStyle} name='assets'>Assets</Text>
            </Tabs>
          </Fragment>
        }
      </View>
    );
  }
}
Application.propTypes = {
  data: PropTypes.array.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isPasswordCreated: PropTypes.bool.isRequired
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  selectedTab: {color: '#2979FF'},
  tabs: {
    backgroundColor: 'white',
    flex: 1
  },
  tabTextStyle: {
    borderTopColor:'#2979FF',
    borderTopWidth: 2
  }
});

const mapStateToProps = ({
  application: {isInitialScreenVisible},
  authentication: {isAuthenticated},
  createPassword: {isPasswordCreated},
  currencies: {
    data, isLoading
  }
}) => ({
  data, isAuthenticated, isInitialScreenVisible, isLoading, isPasswordCreated
});

const mapDispatchToProps = {
  getIsPasswordCreated: actions.getIsPasswordCreated,
  setUserCurrencies: currenciesActions.setUserCurrencies
};
export default connect(mapStateToProps, mapDispatchToProps)(Application);
