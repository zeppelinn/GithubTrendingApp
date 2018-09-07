import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
    Image
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import HomePage from './HomePage';
import DataRepository, {FLAG_STORAGE} from '../expend/dao/DataRepository'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import TrendingCell from '../common/TrendingCell'
import LanguageDao, { FLAG_LANGUAGE } from '../expend/dao/LanguageDao';
import RepositoryDetail from './RepositoryDetail';
import TimeSpan from '../model/TimeSpan';
import Popover from '../common/Popover';
import ProjectModel from '../model/ProjectModel';
import FavoriteDao from '../expend/dao/FavoriteDao';
import Utils from '../pages/util/Utils'
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending) //实例化数据请求对象
var timeSpanTextArray = [new TimeSpan('今天', '今 天', 'since=daily'), new TimeSpan('本周','本 周', 'since=weekly'), new TimeSpan('本月','本 月', 'since=monthly')];

export default class TrendingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataArray:[],
            isVisible:false,
            buttonReact:{},
            timeSpan:timeSpanTextArray[0]
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
                    <TrendingTab tabLabel={name} key={i} timeSpan={this.state.timeSpan} {...this.props} >{name}</TrendingTab>
                )
            }
        }
        return tags;
    }

    showPopover = () => {
        this.refs.popoverButton.measure((ox, oy, width, height, px, py) => {
            this.setState({
                buttonReact:{x:px, y:py, width:width, height:height},
                isVisible:true
            })
        })
    }

    renderTitleView = () => {
        return <View>
            <TouchableOpacity ref='popoverButton' onPress={() => this.showPopover()} >
                <View style={{flexDirection:'row', alignItems:"center"}} >
                    <Text style={{fontSize:18, color:'white', fontWeight:'400'}} >趋势({this.state.timeSpan.titleText})</Text>
                    <Image style={{width:12, height:12, marginLeft:5}} source={require('../../res/images/ic_spinner_triangle.png')} ></Image>
                </View>
            </TouchableOpacity>
        </View>
    }

    closePopover = () => {
        this.setState({
            isVisible:false
        })
    }

    onSeletTimeSpan = (tempTimeSpan) => {
        this.setState({
            timeSpan:tempTimeSpan,
            isVisible:false
        })
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
        let timeSpanView = <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonReact}
            onClose={this.closePopover}
            placement={'bottom'}
            contentStyle={{backgroundColor:"#343434", opacity:0.82}}
        >
            {timeSpanTextArray.map((result, i, arr) => {
                return <TouchableOpacity key={i} underlayColor='transparent' onPress={() => this.onSeletTimeSpan(arr[i])} >
                    <Text style={{fontSize:18, color:'white', fontWeight:"400", padding:8}} >
                        {arr[i].showText}
                    </Text>
                </TouchableOpacity>
            })}
        </Popover>
        return (
            <View style={styles.container} >
                <NavigationBar 
                    title={'趋势'} 
                    statusBar={{
                        backgroundColor:'#2196F3',
                        barStyle:"light-content"
                    }}
                    titleView={this.renderTitleView()}
                />
                {content}
                {timeSpanView}
            </View>
        )
    }
}

class TrendingTab extends Component {
    constructor(props){
        super(props);
        this.isFavoriteChanged = false;
        this.state={
            result:"",
            dataSource:new ListView.DataSource({
                rowHasChanged:(r1, r2) => r1!==r2
            }),
            isLoading:false,
            favoriteKeys:[],
        }
    }

    componentDidMount = () => {
        console.log('trending page componentDidMount');
        this.getData(this.props.timeSpan, true)
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
            console.log('received emmit!!');
            this.isFavoriteChanged = true;
        })
    }

    // 组件在收到新的属性的时候调用
    componentWillReceiveProps = (nextProps) => {
        console.log('trending page componentWillReceiveProps start ');
        if(nextProps.timeSpan !== this.props.timeSpan){
            this.getData(nextProps.timeSpan)
        }
        console.log('trending page componentWillReceiveProps end-->', this.isFavoriteChanged);
        if(this.isFavoriteChanged){
            console.log('trending page favor changed!!!!');
            this.isFavoriteChanged = false;
            this.getFavoriteKeys()
        }
    }

    componentWillUnmount = () => {
        if(this.listener){
            this.listener.remove();
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

    updateState = (dict) => {
        if(!this) return ;
        this.setState(dict);
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

    getDataSource = (data) => {
        return this.state.dataSource.cloneWithRows(data);
    }

    getData = (timeSpan, isRefresh) => {
        this.setState({
            isLoading:true
        })
        const url = `https://github.com/trending/${this.props.tabLabel}?${timeSpan.searchText}`
        dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if(result && result.update_date && Utils.checkDate(result.update_date)){
                    return dataRepository.fetchNetRepository(url);
                }
            })
            .then(result => {
                if(!result && result.length === 0) return ;
                this.items = result;
                this.getFavoriteKeys();
            })
            .catch(error => {
                this.setState({
                    isLoading:false,
                })
            })
    }

    // 处理收藏按钮的回调函数
    onFavouriteIconPressed = (item, isFavorite) => {
        if(isFavorite){
            favoriteDao.saveFavorItem(item.fullName, JSON.stringify(item))
        }else{
            favoriteDao.removeFavorItem(item.fullName);
        }
    }

    onSelected = (projectModel) => {
        var item = projectModel.item
        this.props.navigator.push({
            title:item.fullName,
            component:RepositoryDetail,
            params:{
                projectModel:projectModel,
                parentComponent:this,
                flag:FLAG_STORAGE.flag_trending,
                ...this.props
            }
        })
    }

    renderRow = (projectModel) => {
        return <TrendingCell 
            projectModel={projectModel}
            key={projectModel.item.fullName}
            onSelected={() => this.onSelected(projectModel)}
            onFavouriteIconPressed={(item, isFavorite) => this.onFavouriteIconPressed(item, isFavorite)}
        />
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
                            onRefresh={() => this.getData(this.props.timeSpan)}
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