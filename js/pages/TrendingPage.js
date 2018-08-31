import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import DataRepository, {FLAG_STORAGE} from '../expend/dao/DataRepository'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import TrendingCell from '../common/TrendingCell'
import LanguageDao, { FLAG_LANGUAGE } from '../expend/dao/LanguageDao';
import RepositoryDetail from './RepositoryDetail';

export default class TrendingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataArray:[]
        }
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
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
                    console.log('TrendingPage 加载数据异常-->', error);
                })
        }
    }

    renderTags = () => {
        var tags = [];
        for (let i = 0, len = this.state.dataArray.length; i < len; i++) {
            if (this.state.dataArray[i].checked) {
                let name = this.state.dataArray[i].name;
                tags.push(
                    <TrendingTab tabLabel={name} key={i} {...this.props} >{name}</TrendingTab>
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
                title={'趋势'} 
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

class TrendingTab extends Component {

    constructor(props){
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending) //实例化数据请求对象

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
        const url = `https://github.com/trending/${this.props.tabLabel}`
        this.dataRepository.fetchRepository(url)
            .then(result => {
                let items = result && result.items ? result.items : result ? result : [];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading:false,
                })
                if(result && result.update_date && !this.dataRepository.checkDate(result.update_date)){
                    DeviceEventEmitter.emit('showToast', '数据过时');
                    return this.dataRepository.fetchNetRepository(url);
                }else{
                    DeviceEventEmitter.emit('showToast', '显示本地数据');
                }
            })
            .then(result => {
                if(!result && result.length === 0) return ;
                DeviceEventEmitter.emit('showToast', '显示网络数据');
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result),
                })
            })
            .catch(error => {
                this.setState({
                    result:"error-->" + JSON.stringify(error),
                    isLoading:false,
                })
            })
    }

    onSelected = (item) => {
        this.props.navigator.push({
            component:RepositoryDetail,
            params:{
                item:item,
                ...this.props
            }
        })
    }

    render(){
        return (
            <View style={{flex:1}} >
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => <TrendingCell data={data} key={data.id} onSelected={() => this.onSelected(data)} />}
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