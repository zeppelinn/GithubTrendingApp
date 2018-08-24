import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native'

import NavigationBar from './NavigationBar';
import HttpUtils from './HttpUtils';

export default class FetchTest extends Component {

    constructor(props){
        super(props);
        this.state = {
            result:""
        }
    }

    getData = (url) => {
        // console.log('getData');
        // fetch(url, {
        //     method:"GET",
        //     header:{
        //         "Accept":"application/json",
        //         "Content-Type":"application/json"
        //     }
        // })
        //     .then(response => {
        //         console.log('then1:->', response.text());
        //         if(response.ok){
        //             return response.json();
        //         }else{
        //             this.setState({
        //                 result:'error status--->' + response.status
        //             })
        //         }
        //     })
        //     .then(result => {
        //         this.setState({
        //             result:JSON.stringify(result)
        //         })
        //     })
        //     .catch(error => {
        //         this.setState({
        //             result:"error -> " + JSON.stringify(error)
        //         })
        //     })

        // 注意点：ios在8.0版本之后，应用发起的网络请求必须是https的
        HttpUtils.get(url)
            .then(result => {
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(error => {
                this.setState({
                    result:"error -> " + JSON.stringify(error)
                })
            })

    }

    postData = (url, data) => {
        fetch(url,{
            method:"POST",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json",
            },
            body:JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(error => {
                this.setState({
                    result:"error -> " + JSON.stringify(error)
                })
            })
    }

    render() {
        return (
            <View style={styles.container} >
                <NavigationBar
                    title={'FetchTest'}
                >
                </NavigationBar>
                <Text
                    onPress={() => this.getData("https://raw.githubusercontent.com/zeppelinn/document/master/data.json")}
                >
                    获取数据
                </Text>
                <Text
                    onPress={() => this.postData("http://rap.taobao.org/mockjsdata/11793/submit", {"username":'xiaoming', "password":'123456'})}
                >
                    提交数据
                </Text>
                <Text>返回结果:{this.state.result}</Text>
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
    }
})