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
import FavoriteDao from '../expend/dao/FavoriteDao';
import Utils from '../pages/util/Utils';
// 声明全局的favoriteDao，使得所有的tab都能够使用这个dao
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

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
                title={'热门'} 
                statusBar={{
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
        this.isFavoriteChanged = false;
        this.state={
            result:"",
            dataSource:new ListView.DataSource({
                rowHasChanged:(r1, r2) => r1!==r2
            }),
            isLoading:false,
            favoriteKeys:[]
        }
    }

    componentDidMount = () => {
        this.getData();
        // 注册监听，监听收藏页面对收藏项目的修改
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
            console.log('popular page received emit')
            this.isFavoriteChanged = true
        })
    }

    // 在组件卸载之前销毁监听器
    componentWillUnmount = () => {
        if(this.listener){
            this.listener.remove();
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.isFavoriteChanged){
            this.isFavoriteChanged = false;
            this.getFavoriteKeys()
        }
    }

    // 更新project的item收藏状态
    flushFavoriteState = () => {
        let projectModels = [];
        let items = this.items;
        for (let i = 0; i < items.length; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavor(items[i], this.state.favoriteKeys)));
        }
        this.updateState({
            isLoading:false,
            dataSource:this.getDataSource(projectModels)
        })
    }

    getDataSource = (data) => {
        return this.state.dataSource.cloneWithRows(data);
    }

    getFavoriteKeys = () => {
        favoriteDao.getFavorKey()
            .then(keys => {
                if(keys){
                    this.updateState({favoriteKeys:keys})
                }
                this.flushFavoriteState();
            })
            .catch(error => {
                this.flushFavoriteState();
            })
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
                this.getFavoriteKeys();
                if(result && result.update_date && !this.dataRepository.checkDate(result.update_date)){
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(result => {
                if(!result && result.length === 0) return ;
                this.items = result;
                this.getFavoriteKeys();
            })
            .catch(error => {
                this.updateState({
                    isLoading:false,
                })
            })
    }

    onSelected = (projectModel) => {
        this.props.navigator.push({
            component:RepositoryDetail,
            params:{
                projectModel:projectModel,
                ...this.props,
                parentComponent:this,
                flag:FLAG_STORAGE.flag_popular
            }
        })
    }

    // 处理收藏按钮的回调函数
    onFavouriteIconPressed = (item, isFavorite) => {
        if(isFavorite){
            favoriteDao.saveFavorItem(item.id.toString(), JSON.stringify(item))
        }else{
            favoriteDao.removeFavorItem(item.id.toString());
        }
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