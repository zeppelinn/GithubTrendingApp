import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    ListView,
    RefreshControl,
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import DataRepository from '../expend/dao/DataRepository'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, { FLAG_LANGUAGE } from '../expend/dao/LanguageDao';

export default class PopularPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataArray:[]
        }
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    }

    componentDidMount = () => {
        if(this.languageDao){
            this.languageDao.fetch()
                .then(result => {
                    this.setState({
                        dataArray:result
                    })
                })
                .catch(error => {
                    console.log('PopularPage 加载数据异常-->', error);
                })
        }
    }

    componentDidUpdate = () => {
        
    }

    renderTags = () => {
        var tags = [];
        for (let i = 0, len = this.state.dataArray.length; i < len; i++) {
            if (this.state.dataArray[i].checked) {
                let name = this.state.dataArray[i].name;
                tags.push(
                    <PopularTab tabLabel={name} key={i} >{name}</PopularTab>
                )
            }
        }
        return tags;
    }

    render() {

        let content = this.state.dataArray.length !== 0 ? <ScrollableTabView 
                        tabBarBackgroundColor="#2196F3"
                        tabBarActiveTextColor="white"
                        tabBarInactiveTextColor="mintcream"
                        tabBarUnderlineStyle={{backgroundColor:"#e7e7e7", height:2}}
                        renderTabBar={() => <ScrollableTabBar/>}
                    >
                        {this.renderTags()}
                    </ScrollableTabView> : null
        return (
        <View style={styles.container} >
            <NavigationBar 
                title={'最热'} 
                statusBar={{
                    backgroundColor:'#2196F3',
                    barStyle:"light-content"
                }}
            />
            {content}
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
            }),
            isLoading:false,
        }
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = () => {
        this.setState({
            isLoading:true
        })
        const url = `https://api.github.com/search/repositories?q=${this.props.tabLabel}&sort=star`
        this.dataRepository.fetchNetRepository(url)
            .then(result => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result.items),
                    isLoading:false,
                })
            })
            .catch(error => {
                this.setState({
                    result:"error-->" + JSON.stringify(error),
                    isLoading:false,
                })
            })
    }

    render(){
        return (
            <View style={{flex:1}} >
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => <RepositoryCell data={data} />}
                    /* 设置下拉刷新 */
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={() => this.getData()}
                            colors={['#2196F3']}
                            tintColor={'#2196F3'}
                            title={'Loading'}
                            titleColor={'#2196F3'}
                        />
                    
                    }
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