import React, { Component } from 'react'
import {
    Dimensions,
    Image,
    ListView,
    PixelRatio,
    StyleSheet,
    Text,
    View,
    Platform
} from 'react-native';
import {MORE_MENU} from '../../common/MoreMenu';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../../../res/styles/GlobalStyles'
import FavoriteDao from '../../expend/dao/FavoriteDao';
import { FLAG_STORAGE } from '../../expend/dao/DataRepository';
import ProjectModel from '../../model/ProjectModel';
import Utils from '../util/Utils';
import RepositoryCell from '../../common/RepositoryCell';
import RepositoryDetail from '../RepositoryDetail';
import RepositoryUilts from '../../expend/dao/RepositoryUilts';

export var FLAG_ABOUT = {flag_about:'about', flag_about_author:'about_author'}

export default class AboutCommon{
    constructor(props, updateState, flag, config) {
        this.props = props;
        this.updateState = updateState;
        this.flag = flag;
        this.config = config;
        this.repositoryUtils = new RepositoryUilts(this);
        this.repositories = [];
        this.repositoryKeys = null;
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    }

    componentDidMount() {
        if (this.flag === FLAG_ABOUT.flag_about) {
            this.repositoryUtils.fetchResository(this.config.info.currentRepoUrl);
        }else{
            var urls = [];
            var items = this.config.items;
            for (let i = 0; i < array.length; i++) {
                urls.push(this.config.info.url + items[i]);
            }
            this.repositoryUtils.fetchResositories(urls);
        }
    }

    /**
     * 通知数据发生改变
     * @param items 发生改变的数据
     */
    onNotifiedDataChanged = (items) => {
        console.log('onNotifiedDataChanged ---> ', items)
        this.updateRepository(items);
    }

    /**
     * 加入es6新特性
     * 使用async修饰的函数是一个异步函数
     * await关键字后面一般跟的是一个返回了Promise对象的函数表达式，它返回Promiser的resolve的对象
     * 这样避免了链式调用的繁琐
    */
    async updateRepository(repositories){
        if(repositories){
            this.repositories = repositories;
        }
        if(!this.repositories) return ;
        if(!this.repositoryKeys) {
            this.repositoryKeys = await this.favoriteDao.getFavorKey();
        }
        let projectModels = [];
        for (let i = 0; i < this.repositories.length; i++) {
            projectModels.push({
                isFavor:Utils.checkFavor(this.repositories[i], this.repositoryKeys ? this.repositoryKeys : []),
                item:this.repositories[i].item ? this.repositories[i].item : this.repositories[i]
            })
        }
        console.log('updateRepository ----> ', projectModels);
        this.updateState({
            projectModel:projectModels
        })
    }

    onSelectedRepository = (projectModel) => {
        var item = projectModel.items;
        this.props.navigator.push({
            title:item.full_name,
            component:RepositoryDetail,
            params:{
                projectModel:projectModel,
                parentComponent:this,
                flag:FLAG_STORAGE.flag_popular,
                ...this.props
            },
        });
    }

    onFavouriteIconPressed = (item, isFavor) => {
        if(isFavor){
            this.favoriteDao.saveFavorItem(item.id.toString(), JSON.stringify(item));
        }else{
            this.favoriteDao.removeFavorItem(item.id.toString());
        }
    }

    /**
     * 创建项目视图
     */
    renderRepository = (projectModels) => {
        console.log("about projectModels---->", projectModels);
        if(!projectModels || projectModels.length === 0){
            return null;
        }else{
            let views = [];
            for (let i = 0; i < projectModels.length; i++) {
                let projectModel =  projectModels[i];
                console.log('renderRepository -----> id ', projectModel.item.items.id);
                views.push(
                    <RepositoryCell
                        key={projectModel.item.items.id}
                        projectModel={projectModel.item.items}
                        onSelected={() => {}}
                        onFavouriteIconPressed={() => {}}
                    />
                )
            }
            return views;
        }
    }

    getParallaxRenderConfig = (params) => {
        let config = {};
        config.renderBackground= () => (
            <View key="background">
            <Image source={{uri: params.backgroundPic,
                            width: window.width,
                            height: PARALLAX_HEADER_HEIGHT}}/>
            <View style={{position: 'absolute',
                            top: 0,
                            width: window.width,
                            backgroundColor: 'rgba(0,0,0,.4)',
                            height: PARALLAX_HEADER_HEIGHT}}/>
            </View>
        )
        config.renderForeground=() => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
            <Image style={ styles.avatar } source={{
                uri: params.avatar,
                width: AVATAR_SIZE,
                height: AVATAR_SIZE
            }}/>
            <Text style={ styles.sectionSpeakerText }>
                {params.name}
            </Text>
            <Text style={ styles.sectionTitleText }>
                {params.description}
            </Text>
            </View>
        )
        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        )
        config.renderFixedHeader=() => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(() => this.props.navigator.pop())}
            </View>
        )
        return config;
    }

    renderView = (content, params) => {
        let renderConfig = this.getParallaxRenderConfig(params);
        return (
            <ParallaxScrollView
                headerBackgroundColor="#333"
                backgroundColor="#2196F3"
                stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                backgroundSpeed={10}
                {...renderConfig}>
                {content}
            </ParallaxScrollView>
        );
    }


}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems:'center',
        paddingTop:(Platform.OS === 'ios') ? 20 : 0,
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10,
    },
    fixedSection: {
        left:0,
        right:0,
        bottom:0,
        top:0,
        position: 'absolute',
        paddingRight:8,
        flexDirection:'row',
        alignItems:'center',
        paddingTop:(Platform.OS === 'ios') ? 20 : 0,
        justifyContent:'space-between'
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});