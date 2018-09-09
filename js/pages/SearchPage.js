import React, { Component } from 'react'
import {
    View,
    TextInput,
    Platform,
    TouchableOpacity,
    Text,
    ListView,
    ActivityIndicator,
    AsyncStorage,
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import ViewUtils from './util/ViewUtils';
import GlobalStyles from '../../res/styles/GlobalStyles'
import Toast, {DURATION} from 'react-native-easy-toast';
import FavoriteDao from '../expend/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expend/dao/DataRepository';
import ProjectModel from '../model/ProjectModel';
import Utils from './util/Utils';
import RepositoryCell from '../common/RepositoryCell';
import RepositoryDetail from './RepositoryDetail';
import ActionUtils from './util/ActionUtils';
import LanguageDao, {FLAG_LANGUAGE} from '../expend/dao/LanguageDao';

export default class SearchPage extends Component {
    constructor(props){
        super(props);
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.favoriteKeys = [];
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            rightButtonText:'搜索',
            isLoading:false,
            isFinished:false,
            dataSource:new ListView.DataSource({
                rowHasChanged:(r1, r2) => r1 !== r2,
            }),
            searchHistory:[],
            textInputValue:'',
            showBottomButton:false,
        }
    }

    /**
     * 拼接URL
     */
    getUrl = (param) => {
        return `https://api.github.com/search/repositories?q=${param}&sort=star`;
    }
    
    /**
     * 加载数据
     */
    loadData = () => {
        this.updateState({
            isLoading:true,
        })
        fetch(this.getUrl(this.inputTextContent))
            .then(response => response.json())
            .then(result => {
                if(!this || !result || !result.items || result.items.length === 0){
                    this.toast.show('没有找到与' + this.inputTextContent + '相关的仓库', DURATION.LENGTH_SHORT);
                    this.updateState({
                        isLoading:false,
                        rightButtonText:'搜索'
                    })
                    return ;
                }
                this.updateState({
                    isFinished:true,
                })
                this.items = result.items;
                this.getFavoriteKeys();
                console.log('start check');
                if(!this.checkRepeatKeys(this.inputTextContent)){
                    this.updateState({
                        showBottomButton:true,
                    })
                }
            })
            .catch(error => {
                this.updateState({
                    isLoading:false,
                    rightButtonText:'搜索'
                })
            })
    }

    getFavoriteKeys = () => {
        this.favoriteDao.getFavorKey()
            .then(keys => {
                this.favoriteKeys = keys || [];
                if(keys){
                    this.updateState({favoriteKeys:keys})
                }
                this.flushFavoriteState();
            })
            .catch(error => {
                this.flushFavoriteState();
            })
    }

    // 更新project的item收藏状态
    flushFavoriteState = () => {
        let projectModels = [];
        let items = this.items;
        for (let i = 0; i < items.length; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavor(items[i], this.favoriteKeys)));
        }
        this.updateState({
            isLoading:false,
            dataSource:this.getDataSource(projectModels),
            rightButtonText:'搜索'
        })
    }

    getDataSource = (data) => {
        return this.state.dataSource.cloneWithRows(data);
    }

    onBack = () => {
        this.props.navigator.pop();
    }

    updateState = (dict) => {
        if(!this) return ;
        this.setState(dict);
    }

    onRightButtonClicked = () => {
        if (this.state.rightButtonText === '搜索') {
            
                this.updateState({
                    rightButtonText:'取消'
                })
                this.loadData();
        }else{
            this.updateState({
                rightButtonText:'搜索',
                isLoading:false
            })
        }
    }

    /**
     * 从本地获取之前保存的搜索历史
     */
    fetchSearchHistory = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('search_history', (error, result) => {
                if(!error){
                    try {
                        console.log('search history result ----> ', result);
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                }else{
                    reject(error);
                }
            })
        })
    }

    /**
     * 获取搜索历史数据
     */
    getSearchHistory = () => {
        console.log('renderSearchHistoryBubble');
        this.fetchSearchHistory()
            .then(response => {
                if(response && response.length > 0){
                    this.updateState({
                        searchHistory:response
                    })
                }
            })
            .catch(error => {
            });
    }

    /**
     * 遍历搜索历史，返回搜索历史集合
     */
    searchHistoryBubbleListView = () => {
        return this.state.searchHistory.map(item => (this.searchHistoryBubbleItem(item.tag)))
    }

    /**
     * 返回单个搜索历史
     */
    searchHistoryBubbleItem = (item) => {
        return <TouchableOpacity key={item} style={styles.bubbleContainer} onPress={() => {this.inputTextContent = item;this.refs.input.blur();this.onRightButtonClicked();this.updateState({textInputValue:item})}} >
            <Text key={item} style={styles.bubbleItem}>
                {item}
            </Text>
        </TouchableOpacity> 
    }

    /**
     * 搜索历史
     */
    searchHistoryBubble = () => {
        return (
            <View>
                <Text style={{marginTop:10,marginLeft:10, fontSize:15, color:"#848482"}} >搜索历史</Text>
                <View style={{flexDirection:"row", flexWrap:"wrap", marginTop:5}} >
                    {this.searchHistoryBubbleListView()}
                </View>
            </View>
        )
    }

    updateSearchHistory = () => {
        var [...arr] = this.state.searchHistory;
        for (let i = 0; i < arr.length; i++) {
            if(arr[i].tag.toLowerCase() === this.inputTextContent.toLowerCase()){
                arr.splice(i, 1);
                break;
            }
        }
        arr.unshift({tag:this.inputTextContent});
        this.updateState({
            searchHistory:arr
        })
    }

    renderNavBar = () => {
        let leftButton = ViewUtils.getLeftButton(() => {this.onBack();this.refs.input.blur();})
        let inputText = <TextInput defaultValue={this.state.textInputValue} ref="input" style={styles.inputText} onChangeText={text => {this.inputTextContent = text;if(!text || text === ''){this.refs.input.blur();this.updateState({isFinished:false, isLoading:false})}}}/>
        let rightButton = <TouchableOpacity onPress={() => {
                this.refs.input.blur();
                if(this.inputTextContent && this.inputTextContent !== ''){
                    console.log('enable search');
                    this.onRightButtonClicked();
                    this.updateSearchHistory();
                }
            }}>
            <View style={{marginRight:10}} >
                <Text style={styles.title} >
                    {this.state.rightButtonText}
                </Text>
            </View>
        </TouchableOpacity>
        return <View style={{
            backgroundColor:"#2196f3",
            flexDirection:'row',
            alignItems:'center',
            height:(Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android
        }} >
            {leftButton}
            {inputText}
            {rightButton}
        </View>
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

    renderRow = (projectModel) => {
        return <RepositoryCell 
            projectModel={projectModel}
            key={projectModel.item.id}
            onSelected={() => this.onSelected(projectModel)}
            onFavouriteIconPressed={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite)}
         />;
    }

    /**
     * 使用async和await来异步获取本地标签
     */
    async initKeys(){
        this.keys = await this.languageDao.fetch();
    }

    /**
     * 检查当前搜索的标签是否已经在本地保存
     */
    checkRepeatKeys = (key) => {
        for (let i = 0; i < this.keys.length; i++) {
            if(key.toLowerCase() === this.keys[i].name.toLowerCase()){
                return true;
            }
        }
        return false;
    }

    saveKey = () => {
        let key = this.inputTextContent;
        if(this.checkRepeatKeys(key)){
            this.toast.show(key + "已经保存", DURATION.LENGTH_SHORT);
        }else{
            key = {
                "path":key,
                "name":key,
                "checked":true
            };
            this.keys.unshift(key);
            this.languageDao.save(this.keys);
            this.toast.show("保存成功", DURATION.LENGTH_SHORT);
            this.updateState({
                showBottomButton:false
            })
        }
    }

    componentDidMount() {
        this.initKeys();
    }
    
    componentWillMount = () => {
        this.getSearchHistory();
    }
    

    componentWillUnmount() {
        AsyncStorage.setItem('search_history', JSON.stringify(this.state.searchHistory));
    }

    render() {
        let statusBar = null;
        if(Platform.OS === 'ios'){
            statusBar = <View style={[styles.statusBar, {backgroundColor:"#2196f3"}]} />
        }
        let listView = this.state.isLoading ? null : <ListView style={{marginTop:5}}
            dataSource={this.state.dataSource}
            renderRow={(data) => this.renderRow(data)}
        />
        let indicatorView = this.state.isFinished ? null:( this.state.isLoading?
            <ActivityIndicator
                style={{alignItems:'center', justifyContent:'center', flex:1}}
                animating={this.state.isLoading}
                size={'large'}
            />:this.searchHistoryBubble());
        let parentView = <View style={{flex:1}} >
            {indicatorView}
            {listView}
        </View>
        let bottomButton = this.state.showBottomButton ? 
            <TouchableOpacity
                onPress={() => this.saveKey(this.inputTextContent)}
                style={[styles.bottom, {backgroundColor:"#2196f3"}]}
            >
                <View style={{justifyContent:'center', }} >
                    <Text style={styles.title} >
                        添加标签
                    </Text>
                </View>
            </TouchableOpacity> : null;
        return (
        <View style={GlobalStyles.titleContainer} >
            {statusBar}
            {this.renderNavBar()}
            {parentView}
            {bottomButton}
            <Toast ref={toast => this.toast = toast} />
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
    },
    statusBar:{
        height:20,
    },
    inputText:{
        flex:1,
        height:(Platform.OS === 'ios') ? 30:40,
        borderWidth:(Platform.OS === 'ios') ? 1:0,
        borderColor:'white',
        alignSelf:'center',
        paddingLeft:5,
        marginRight:10,
        marginLeft:5,
        borderRadius:3,
        opacity:0.7,
        color:'black',
        backgroundColor:'white'
    },
    title:{
        fontSize:18,
        color:'white',
        fontWeight:'500'
    },
    bubbleContainer:{
        backgroundColor:"#E5E4E2",
        marginTop:8,
        marginLeft:10,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    bubbleItem:{
        backgroundColor:'transparent',
        marginLeft:8,
        marginRight:8,
        marginTop:3,
        marginBottom:3,
        borderRadius:10,
        alignItems:'center',
        fontSize:15,
        color:"#848482"
    },
    bottom:{
        alignItems:'center',
        justifyContent:'center',
        opacity:0.8,
        height:40,
        position:'absolute',
        left:140,
        top:GlobalStyles.window_height - 45,
        right:140,
        borderRadius:5
    }
}