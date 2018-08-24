import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import DataRepository from '../expend/dao/DataRepository'

export default class PopularPage extends Component {

    constructor(props){
        super(props);
        this.dataRepository = new DataRepository() //实例化数据请求对象
        this.state={
            result:""
        }
    }

    getData = () => {
        const url = `https://api.github.com/search/repositories?q=${this.text}&sort=star`
        this.dataRepository.fetchNetRepository(url)
            .then(result => {
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(error => {
                this.setState({
                    result:"error-->" + JSON.stringify(error)
                })
            })
    }

    render() {
        return (
        <View style={styles.container} >
            <NavigationBar
                title={'最热'}
                style={{
                    backgroundColor:'#6495ed'
                }}
            >
            </NavigationBar>
            <Text style={styles.tips}
                onPress={() => {
                    this.getData();
                }}
            >
                获取数据
            </Text>
            <TextInput
                style={{
                    height:20,
                    borderWidth:1
                }}
                onChangeText={(text) => this.text = text}
            >
            </TextInput>
            <Text style={{
                height:500
            }} >
                {this.state.result}
            </Text>
        </View>
        )
    }
}

const styles = {
    container:{
        flex:1
    },
    tips:{
        fontSize:29
    }
}