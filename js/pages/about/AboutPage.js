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

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
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

    onClick = (section) => {
        let TargetComponent, params = {...this.props, menuType:section}
        switch (section) {
            case MORE_MENU.Author:
                
                break;
            case MORE_MENU.WEBSITE:

                break;
            case MORE_MENU.FEEDBACK:

                break;
        }
        // if(TargetComponent){
        //     this.props.navigator.push({
        //         component:TargetComponent,
        //         params:params
        //     })
        // }
    }

    render() {
        let content = <View>
            {ViewUtils.getSettingItems(() => this.onClick(MORE_MENU.WEBSITE), require("../../../res/images/ic_computer.png"), MORE_MENU.WEBSITE, {tintColor:'#2196F3'})}
            <View style={GlobalStyles.line} />
            {ViewUtils.getSettingItems(() => this.onClick(MORE_MENU.Author), require("../my/img/ic_insert_emoticon.png"), MORE_MENU.Author, {tintColor:'#2196F3'})}
            <View style={GlobalStyles.line} />
            {ViewUtils.getSettingItems(() => this.onClick(MORE_MENU.FEEDBACK), require("../../../res/images/ic_feedback.png"), MORE_MENU.FEEDBACK, {tintColor:'#2196F3'})}
            <View style={GlobalStyles.line} />

        </View>
        return this.renderView(content, {
            'name':'GitHub Popular',
            'description':'hello',
            'avatar':'https://avatars2.githubusercontent.com/u/34976796?s=460&v=4',
            'backgroundPic':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536230076903&di=17f254429f626fb9095e1ca451e28d61&imgtype=0&src=http%3A%2F%2F2e.zol-img.com.cn%2Fproduct%2F68_940x705%2F936%2FcenVrT34XWnzA.jpg'
        })
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