import React, { Component } from 'react';
import { and, any, filter, isEmpty, not, propEq, toString } from 'ramda';
import { AsyncStorage, View, StyleSheet, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon, ListItem, SearchBar } from 'react-native-elements';
import PropTypes from 'prop-types';

import * as actions from './Currencies.actions';

class Currencies extends Component {
  state = {
    error: null,
    searchQuery: ''
  };

  componentDidMount() {
    if (isEmpty(this.props.data)) {
      this.props.fetchData();
      this.props.getUserCurrencies();
    }
  }

  handleSearchChange = (query) => {
    this.setState({
      searchQuery: query
    })
  };

  addCurrency = (symbol) => {
    const {setUserCurrencies, userCurrencies} = this.props;
    const list = [...userCurrencies, {currency: symbol, amount: '0'}];

    try {
      AsyncStorage.setItem('userCurrencies', toString(list));
      setUserCurrencies(list);
    } catch (error) {
      console.log(error);
    }
  };

  renderListItem = ({item}) => (
    <ListItem
      hideChevron={any(propEq('currency', item.symbol), this.props.userCurrencies)}
      title={`${item.name} (${item.symbol})`}
      subtitle={`${(item.quotes.USD.price)} USD`}
      containerStyle={{borderBottomWidth: 0}}
      rightIcon={this.renderListItemIcon(item)}
    />
  );

  renderListItemIcon = item => (
    <Icon
      onPress={() => this.addCurrency(item.symbol)}
      raised
      reverse
      name='add'
      size={18}
      color='#2979FF'
    />
  );

  renderSeparator = () => <View style={styles.separator} />;

  render() {
    const {data, requestFailed} = this.props;
    const {searchQuery} = this.state;
    const _data = filter(item => item.name.includes(searchQuery), data);
    const {handleRefresh, refreshing} = this.props;
    const showEmptyResults = and(isEmpty(_data), not(isEmpty(searchQuery)));

    return (
      <View style={styles.container}>
        <SearchBar
          onChangeText={this.handleSearchChange}
          placeholder='Search'
          round
        />
        {requestFailed &&
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Request Failed</Text>
          </View>
        }
        {showEmptyResults &&
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>There are not results for {searchQuery} query</Text>
          </View>
        }
        {not(isEmpty(_data)) &&
          <FlatList
            style={{flex: 1}}
            data={_data}
            renderItem={this.renderListItem}
            keyExtractor={item => item.symbol}
            initialNumToRender={50}
            ItemSeparatorComponent={this.renderSeparator}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        }
      </View>
    );
  }
}
Currencies.propTypes = {
  data: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  getUserCurrencies: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
  requestFailed: PropTypes.bool.isRequired,
  setUserCurrencies: PropTypes.func.isRequired,
  userCurrencies: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  errorText: {
    fontSize: 25
  },
  separator: {
    backgroundColor: '#CED0CE',
    height: 1,
    width: '100%'
  }
});
const mapStateToProps = ({
  currencies: {
    data, isLoading, refreshing, requestFailed, userCurrencies
  }
}) => ({
  data, isLoading, refreshing, requestFailed, userCurrencies
});
const mapDispatchToProps = {
  fetchData: actions.fetchData,
  getUserCurrencies: actions.getUserCurrencies,
  handleRefresh: actions.handleRefresh,
  setUserCurrencies: actions.setUserCurrencies
};

export default connect(mapStateToProps, mapDispatchToProps)(Currencies);
