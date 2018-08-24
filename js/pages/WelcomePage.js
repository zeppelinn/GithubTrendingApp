import React, { Component } from 'react'
import {
    View,
    Text
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';

export default class WelcomePage extends Component {

    componentDidMount = ()=> {
        this.timer = setTimeout(() => {
            this.props.navigator.resetTo({
                component:HomePage
            })
        }, 2000);
    }

    componentWillUnmount = ()=> {
        this.timer && clearTimeout(this.timer);
    }

  render() {
    return (
      <View>
          <NavigationBar
            title={'欢迎'}
          >
          </NavigationBar>
        <Text>
            Welcome
        </Text>
      </View>
    )
  }
}