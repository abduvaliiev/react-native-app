import React, { Component, Fragment } from 'react';
import {
  adjust, any, equals, find, findIndex, innerJoin, isEmpty, lensProp, map, multiply, not, prop, propEq, set, sum,
  toString, without
} from 'ramda';
import { AsyncStorage, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Assets extends Component {
  getCurrencyAmount = symbol => prop('amount', find(propEq('currency', symbol), this.props.userCurrencies));

  getCurrencyPrice = item => multiply(item.quotes.USD.price, this.getCurrencyAmount(item.symbol));

  getTotalAmount = data => sum(map(this.getCurrencyPrice, data));

  handleAmountChange = async (amount, currency) => {
    let currencyIndex;
    let newUserCurrencies;
    const {userCurrencies} = this.props;

    if (any(propEq('currency', currency), userCurrencies)) {
      currencyIndex = findIndex(propEq('currency', currency), userCurrencies);
      newUserCurrencies = adjust(set(lensProp('amount'), amount), currencyIndex, userCurrencies);
    }
    try {
      AsyncStorage.setItem('userCurrencies', toString(newUserCurrencies));
      this.props.setUserCurrencies(newUserCurrencies);
    } catch (error) {
      console.log(error);
    }
  };

  renderListItem = item => (
    <View style={styles.listItem}>
      <Text style={{width: '30%'}}>{`${item.name} (${item.symbol})`}</Text>
      <TextInput
        defaultValue={this.getCurrencyAmount(item.symbol)}
        keyboardType='numeric'
        onChangeText={amount => this.handleAmountChange(amount, item.symbol)}
        style={styles.input}
        underlineColorAndroid='transparent'
      />
      <Text>{this.getCurrencyPrice(item).toFixed(6)} USD</Text>
      <Icon
        color='red'
        name='remove'
        onPress={() => this.removeCurrency(item.symbol)}
        raised
        reverse
        size={18}
        style={{marginRight: 'auto'}}
      />
    </View>
  );

  renderSeparator = () => <View style={styles.separator} />;

  removeCurrency = async (symbol) => {
    const {setUserCurrencies, userCurrencies} = this.props;
    const list = without([find(propEq('currency', symbol), userCurrencies)], userCurrencies);

    try {
      await AsyncStorage.setItem('userCurrencies', toString(list));
      setUserCurrencies(list);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {data, userCurrencies} = this.props;
    const _data = innerJoin(({symbol}, {currency}) => equals(symbol, currency), data, userCurrencies);

    return (
      <View style={styles.container}>
        {not(isEmpty(_data)) &&
          <Fragment>
            <FlatList
              data={_data}
              ItemSeparatorComponent={this.renderSeparator}
              keyExtractor={item => `${item.id}`}
              onEndReachedThreshold={50}
              renderItem={({item}) => this.renderListItem(item)}
              style={{flex: 1}}
            />
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: {this.getTotalAmount(_data)} USD</Text>
            </View>
          </Fragment>
        }
        {isEmpty(_data) &&
          <View style={styles.noCurrenciesContainer}>
            <Text style={styles.noCurrenciesText}>No user currencies selected</Text>
          </View>
        }
      </View>
    )
  }
}
Assets.propTypes = {
  data: PropTypes.array.isRequired,
  setUserCurrencies: PropTypes.func.isRequired,
  userCurrencies: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50
  },
  enterPasswordMessage: {
    color: 'white',
    fontSize: 25
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#CED0CE',
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 20,
    height: 40,
    textAlign: 'center',
    width: '30%'
  },
  listItem: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  noCurrenciesContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  noCurrenciesText: {
    fontSize: 25
  },
  separator: {
    backgroundColor: '#CED0CE',
    height: 1,
    width: '100%'
  },
  totalContainer: {
    backgroundColor: '#2979FF',
    height: '10%',
    justifyContent: 'center'
  },
  totalText: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center'
  }
});

const mapStateToProps = ({
  currencies: {
    data, userCurrencies
  }
}) => ({
  data, userCurrencies
});
export default connect(mapStateToProps)(Assets);