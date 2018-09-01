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
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, { FLAG_LANGUAGE } from '../expend/dao/LanguageDao';
import RepositoryDetail from './RepositoryDetail';
import ProjectModel from '../model/ProjectModel';

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

    renderTags = () => {
        var tags = [];
        for (let i = 0, len = this.state.dataArray.length; i < len; i++) {
            if (this.state.dataArray[i].checked) {
                let name = this.state.dataArray[i].name;
                tags.push(
                    <PopularTab tabLabel={name} key={i} {...this.props} >{name}</PopularTab>
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
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular) //实例化数据请求对象

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

    // 更新project的item收藏状态
    flushFavoriteState = () => {
        let projectModels = [];
        let items = this.items;
        for (let i = 0; i < items.length; i++) {
            projectModels.push(new ProjectModel(items[i], false));
        }
        this.updateState({
            isLoading:false,
            dataSource:this.getDataSource(projectModels)
        })
    }

    getDataSource = (data) => {
        return this.state.dataSource.cloneWithRows(data);
    }

    updateState = (dict) => {
        if(!this) return ;
        this.setState(dict);
    }

    getData = () => {
        this.setState({
            isLoading:true
        })
        const url = `https://api.github.com/search/repositories?q=${this.props.tabLabel}&sort=star`
        this.dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.flushFavoriteState();
                if(result && result.update_date && !this.dataRepository.checkDate(result.update_date)){
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(result => {
                if(!result && result.length === 0) return ;
                this.items = result;
                this.flushFavoriteState();
            })
            .catch(error => {
                this.updateState({
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

    // 处理收藏按钮的回调函数
    onFavouriteIconPressed = (item, isFavorite) => {
        
    }

    renderRow = (projectModel) => {
        return <RepositoryCell 
            projectModel={projectModel}
            key={projectModel.item.id}
            onSelected={() => this.onSelected(projectModel)}
            onFavouriteIconPressed={(item, isFavorite) => this.onFavouriteIconPressed(item, isFavorite)}
         />;
    }

    render(){
        return (
            <View style={{flex:1}} >
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRow(data)}
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