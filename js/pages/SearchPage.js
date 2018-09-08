import React, { Component } from 'react'
import {
    View,
    TextInput,
    Platform,
    TouchableOpacity,
    Text,
    ListView
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

export default class SearchPage extends Component {
    constructor(props){
        super(props);
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.favoriteKeys = [];
        this.state = {
            rightButtonText:'搜索',
            isLoading:false,
            dataSource:new ListView.DataSource({
                rowHasChanged:(r1, r2) => r1 !== r2,
            })
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
        console.log('url ===> ', this.getUrl(this.inputTextContent));
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
                this.items = result.items;
                this.getFavoriteKeys();
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

    renderNavBar = () => {
        let leftButton = ViewUtils.getLeftButton(() => {this.onBack();this.refs.input.blur();})
        let inputText = <TextInput ref="input" style={styles.inputText} onChangeText={text => this.inputTextContent = text}/>
        let rightButton = <TouchableOpacity onPress={() => {this.refs.input.blur();this.onRightButtonClicked()}}>
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

    render() {
        let statusBar = null;
        if(Platform.OS === 'ios'){
            statusBar = <View style={[styles.statusBar, {backgroundColor:"#2196f3"}]} />
        }
        let listView = <ListView style={{marginTop:5}}
            dataSource={this.state.dataSource}
            renderRow={(data) => this.renderRow(data)}
        />
        
        return (
        <View style={GlobalStyles.titleContainer} >
            {statusBar}
            {this.renderNavBar()}
            {listView}
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
    }
}