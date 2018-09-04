import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage';
import MyPage from './my/MyPage'
import Toast, {DURATION} from 'react-native-easy-toast'
import FavorPage from './FavorPage'
import TrendingPage from './TrendingPage';

export default class HomePage extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab:"tab_popular",/* 初始化state，默认选中第一个tab */
    }
  }

  componentDidMount = () => {
    // 注册通知
    this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.toast.show(text, DURATION.LENGTH_SHORT);
    });
  }

  componentWillUnmount = () => {
    this.listener && this.listener.remove();
  }

  _renderTab = (Component, selectedTab, title, renderIcon) => {
    return <TabNavigator.Item
            selected={this.state.selectedTab === selectedTab} 
            selectedTitleStyle={{color:'#2196f3'}} // 标签底部文字的样式
            title={title}
            renderIcon={() => <Image style={styles.image} source={renderIcon} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:'#2196f3'}]} source={renderIcon} />}//* style的属性不仅可以使用一个对象来赋值，还能用一个集合来赋值
            onPress={() => this.setState({ selectedTab: selectedTab })}>
            <Component {...this.props} />
          </TabNavigator.Item>
  }

  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          {this._renderTab(PopularPage, 'tab_popular', '热门', require('../../res/images/ic_popular.png'))}
          {this._renderTab(TrendingPage, 'tab_trending', '趋势', require('../../res/images/ic_trending.png'))}
          {this._renderTab(FavorPage, 'tab_favourite', '收藏', require('../../res/images/ic_trending.png'))}
          {this._renderTab(MyPage, 'tab_my', '我的', require('../../res/images/ic_trending.png'))}
        </TabNavigator> 
        <Toast
          ref={toast => this.toast = toast}
        >

        </Toast>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  page: {
    flex:1,
    backgroundColor:'blue'
  },
  page1: {
    flex:1,
    backgroundColor:'green',
  },
  image: {
    height:22,
    width:22
  }
});