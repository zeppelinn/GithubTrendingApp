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
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';

export default class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props, (dict) => this.updateState(dict), FLAG_ABOUT.flag_about)
    }

    updateState = (dict) => {
        this.setState(dict)
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
        return this.aboutCommon.renderView(content, {
            'name':'GitHub Popular',
            'description':'hello',
            'avatar':'https://avatars2.githubusercontent.com/u/34976796?s=460&v=4',
            'backgroundPic':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536230076903&di=17f254429f626fb9095e1ca451e28d61&imgtype=0&src=http%3A%2F%2F2e.zol-img.com.cn%2Fproduct%2F68_940x705%2F936%2FcenVrT34XWnzA.jpg'
        })
    }
}