import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    ListView
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import DataRepository from '../expend/dao/DataRepository'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import RepositoryCell from '../common/RepositoryCell'

export default class PopularPage extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
        <View style={styles.container} >
            <NavigationBar title={'最热'} style={{ backgroundColor:'#6495ed' }} />
            <ScrollableTabView 
                renderTabBar={() => <ScrollableTabBar/>}
            >
                <PopularTab tabLabel="Java" >Java</PopularTab>
                <PopularTab tabLabel="Android" >Android</PopularTab>
                <PopularTab tabLabel="iOS" >iOS</PopularTab>
                <PopularTab tabLabel="React Native" >React Native</PopularTab>
            </ScrollableTabView>
        </View>
        )
    }
}

class PopularTab extends Component {

    constructor(props){
        super(props);
        this.dataRepository = new DataRepository() //实例化数据请求对象

        this.state={
            result:"",
            dataSource:new ListView.DataSource({
                rowHasChanged:(r1, r2) => r1!==r2
            })
        }
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = () => {
        const url = `https://api.github.com/search/repositories?q=${this.props.tabLabel}&sort=star`
        this.dataRepository.fetchNetRepository(url)
            .then(result => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result.items)
                })
            })
            .catch(error => {
                this.setState({
                    result:"error-->" + JSON.stringify(error)
                })
            })
    }

    render(){
        return (
            <View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => <RepositoryCell data={data} />}
                />
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