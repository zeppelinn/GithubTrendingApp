import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

export default class HomePage extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab:"tab_popular",/* 初始化state，默认选中第一个tab */
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tab_popular'} 
            selectedTitleStyle={{color:"red"}} // 标签底部文字的样式
            title="热门"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_popular.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:"red"}]} source={require('../../res/images/ic_popular.png')} />}//* style的属性不仅可以使用一个对象来赋值，还能用一个集合来赋值
            badgeText="1"
            onPress={() => this.setState({ selectedTab: 'tab_popular' })}>
            <View style={styles.page}>

            </View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tab-trending'}
            selectedTitleStyle={{color:"red"}}
            title="趋势"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:"red"}]} source={require('../../res/images/ic_trending.png')} />}
            onPress={() => this.setState({ selectedTab: 'tab-trending' })}>
            <View style={styles.page1}>

            </View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tab_favourite'}
            selectedTitleStyle={{color:"red"}}
            title="收藏"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:"red"}]} source={require('../../res/images/ic_trending.png')} />}
            onPress={() => this.setState({ selectedTab: 'tab_favourite' })}>
            <View style={styles.page1}>

            </View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tab_my'}
            selectedTitleStyle={{color:"red"}}
            title="我的"
            renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_trending.png')} />}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor:"red"}]} source={require('../../res/images/ic_trending.png')} />}
            onPress={() => this.setState({ selectedTab: 'tab_my' })}>
            <View style={styles.page1}>

            </View>
          </TabNavigator.Item>
        </TabNavigator> 
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