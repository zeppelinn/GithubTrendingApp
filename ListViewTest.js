import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ListView,
    RefreshControl,
} from 'react-native'

import NavigationBar from './NavigationBar';

import Toast, {DURATION} from 'react-native-easy-toast';

export var data = {
    "result":[
      {
        "email":"1111@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"2222@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"3333@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"4444@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"5555@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"6666@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"7777@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"8888@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"9999@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"aaaa@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"bbbb@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"cccc@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"dddd@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"eeee@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"ffff@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"gggg@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"hhhh@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"iiii@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"jjjj@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"kkkk@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"llll@qq.com",
        "fullName":"Jack"
      },
      {
        "email":"mmmm@qq.com",
        "fullName":"Jack"
      }
    ],
    "statusCode":0
  }

export default class ListViewTest extends Component {

    constructor(props){
        super(props);
        // 1.在构造器中为ListView创建一个数据源
        const ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1!==r2 });
        this.state = {
            dataSource:ds.cloneWithRows(data.result),
            isLoading:true,
        }
        this.onLoad();
    }

    renderRow = (item) => {
        return <View style={styles.row} >
            <TouchableOpacity
                onPress={() => {
                    this.toast.show(item.email, DURATION.LENGTH_SHORT)
                }}
            >
                <Text style={styles.tips}>{item.fullName}</Text>
                <Text style={styles.tips}>{item.email}</Text>
            </TouchableOpacity>
        </View>
    }

    renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
        return <View 
            key={rowID}
            style={styles.line}
        >
        </View>
    }

    renderHeader = () => {

    }

    renderFooter = () => {
        // 需要注意的是，当Image组件渲染一张网络图片时，一定要指定它的宽和高，否则无法显示
        return <Image source={{
            uri:"https://images.gr-assets.com/hostedimages/1406479536ra/10555627.gif"
        }} style={styles.footerImage} >

        </Image>
    }

    onLoad = () => {
        this.setState({
            isLoading:true,
        })
        setTimeout(() => {
            this.setState({
                isLoading:false
            })
        }, 2000);
    }

    render() {
        return (
            <View style={styles.container} >
                <NavigationBar
                    title={'ListViewTest'}
                >
                </NavigationBar>
                <ListView
                    dataSource={this.state.dataSource} /* 关联数据 */
                    renderRow={(item) => this.renderRow(item)} /*设置ListView每一行返回的视图*/
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    renderHeader={() => this.renderHeader()}
                    renderFooter={() => this.renderFooter()}
                    refreshControl={<RefreshControl
                        refreshing = {this.state.isLoading}
                        onRefresh = {() => this.onLoad()}
                    >

                    </RefreshControl>}
                >

                </ListView>
                <Toast
                    ref={
                        toast => this.toast=toast
                    }
                >

                </Toast>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    text:{
        fontSize:22
    },
    tips:{
        fontSize:18
    },
    row:{
        height:50
    },
    line:{
        height:1,
        backgroundColor:'black'
    },
    footerImage: {
        width:400,
        height:100
    }
})