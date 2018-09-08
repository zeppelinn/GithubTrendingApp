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
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import RepositoryCell from '../common/RepositoryCell'
import RepositoryDetail from './RepositoryDetail';
import {FLAG_STORAGE} from '../expend/dao/DataRepository'
import ProjectModel from '../model/ProjectModel';
import FavoriteDao from '../expend/dao/FavoriteDao';
import TrendingCell from '../common/TrendingCell';
import ArrayUtils from './util/ArrayUtils';
import ActionUtils from './util/ActionUtils';

export default class FavorPage extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render() {
        let content = <ScrollableTabView 
                        tabBarBackgroundColor="#2196F3"
                        tabBarActiveTextColor="white"
                        tabBarInactiveTextColor="mintcream"
                        tabBarUnderlineStyle={{backgroundColor:"#e7e7e7", height:2}}
                        renderTabBar={() => <ScrollableTabBar/>}>
                        <FavorTab tabLabel='热门' {...this.props} flag={FLAG_STORAGE.flag_popular}/>
                        <FavorTab tabLabel='趋势' {...this.props} flag={FLAG_STORAGE.flag_trending}/>
                    </ScrollableTabView>
        return (
        <View style={styles.container} >
            <NavigationBar 
                title={'收藏'}
                statusBar={{
                    barStyle:"light-content"
                }}
            />
            {content}
        </View>
        )
    }
}

class FavorTab extends Component {

    componentWillMount = () => {
        this.getData(true)
    }

    componentWillReceiveProps = (nextProps) => {
        this.getData(false)
    }

    constructor(props){
        super(props);
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.cancelFavorItems = [];
        this.state={
            dataSource:new ListView.DataSource({
                rowHasChanged:(r1, r2) => r1!==r2
            }),
            isLoading:false,
            favoriteKeys:[]
        }
    }

    updateState = (dict) => {
        if(!this) return ;
        this.setState(dict);
    }

    getData = (needLoading) => {
        if(needLoading){
            this.setState({
                isLoading:true
            })
        }
        this.favoriteDao.getAllItems()
            .then(items => {
                var resultData = [];
                for (let i = 0; i < items.length; i++) {
                    resultData.push(new ProjectModel(JSON.parse(items[i]), true))
                }
                console.log('size ----> ', items);
                this.updateState({
                    isLoading:false,
                    dataSource:this.getDataSource(resultData)
                })
            })
            .catch(error => {
                this.updateState({
                    isLoading:false
                })
            })
    }

    getDataSource = (data) => {
        return this.state.dataSource.cloneWithRows(data);
    }

    updateCancelFavorItems = (item, isFavorite) => {
        let index = this.cancelFavorItems.indexOf(item);
        if (isFavorite) {
            if(index !== -1){
                this.cancelFavorItems.splice(index, 1);
            }
        }else{
            if(index === -1){
                this.cancelFavorItems.push(item);
            }
        }
    }

    renderRow = (projectModel) => {
        let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
        return <CellComponent 
            projectModel={projectModel}
            key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName}
            onSelected={() => ActionUtils.onRepositorySelected({
                projectModel:projectModel,
                ...this.props,
                parentComponent:this,
                flag:FLAG_STORAGE.flag_popular
            })}
            onFavouriteIconPressed={(item, isFavorite) => {
                ActionUtils.onFavorite(this.favoriteDao, item, isFavorite);// 刷新取消收藏列表
                this.updateCancelFavorItems(item, isFavorite);
                if(this.cancelFavorItems.length > 0){
                    if(this.props.flag === FLAG_STORAGE.flag_popular){
                        DeviceEventEmitter.emit('favoriteChanged_popular');
                    }else{
                        DeviceEventEmitter.emit('favoriteChanged_trending');
                    }
                }}}
         />;
    }

    render(){
        return (
            <View style={{flex:1}} >
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRow(data)}
                    enableEmptySections={true}
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