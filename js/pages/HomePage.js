import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage';
import AsyncStorageTest from '../../AsyncStorageTest';
import MyPage from './my/MyPage'
import Toast, {DURATION} from 'react-native-easy-toast'
import WebViewTest from '../../WebViewTest';

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

  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tab_popular'} 
            selectedTitleStyle={{color:'#2196f3'}} // 标签底部文字的样式
            title="热门"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_popular.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:'#2196f3'}]} source={require('../../res/images/ic_popular.png')} />}//* style的属性不仅可以使用一个对象来赋值，还能用一个集合来赋值
            badgeText="1"
            onPress={() => this.setState({ selectedTab: 'tab_popular' })}>
            <PopularPage {...this.props} ></PopularPage>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tab-trending'}
            selectedTitleStyle={{color:'#2196f3'}}
            title="趋势"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:'#2196f3'}]} source={require('../../res/images/ic_trending.png')} />}
            onPress={() => this.setState({ selectedTab: 'tab-trending' })}>
            <AsyncStorageTest></AsyncStorageTest>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tab_favourite'}
            selectedTitleStyle={{color:'#2196f3'}}
            title="收藏"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:'#2196f3'}]} source={require('../../res/images/ic_trending.png')} />}
            onPress={() => this.setState({ selectedTab: 'tab_favourite' })}>
            <WebViewTest>
              
            </WebViewTest>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tab_my'}
            selectedTitleStyle={{color:'#2196f3'}}
            title="我的"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:'#2196f3'}]} source={require('../../res/images/ic_trending.png')} />}
            onPress={() => this.setState({ selectedTab: 'tab_my' })}>
            <MyPage {...this.props} ></MyPage>
          </TabNavigator.Item>
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