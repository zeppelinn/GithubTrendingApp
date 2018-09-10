import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View,
    Linking
} from 'react-native';
import Popover from '../common/Popover';
import PropTypes from 'prop-types';
import AboutPage from '../pages/about/AboutPage';
import CustomTagsPage from '../pages/my/CustomTagsPage';
import { FLAG_LANGUAGE } from '../expend/dao/LanguageDao';
import SortKeyPage from '../pages/my/SortKeyPage';
/**
 * 更多菜单
 */
export const MORE_MENU = {
    CUSTOM_LANGUAGE:'自定义语言',
    SORT_LANGUAGE:'语言排序',
    CUSTOM_THEME:'自定义主题',
    CUSTOM_KEY:'自定义标签',
    SORT_KEY:'标签排序',
    REMOVE_KEY:'标签移除',
    Author:'关于作者',
    ABOUT:'关于',
    WEBSITE:'Website',
    FEEDBACK:"反馈",
    SHARE:"分享",

}
export default class MoreMenu extends Component{
    constructor(props){
        super(props);
        this.state = {
            isVisiable:false,
            buttonRect:{},
        }
    }

    static propTypes = {
        contentStyle:View.propTypes.style,
        menus:PropTypes.array.isRequired,
        anchorView:PropTypes.func
    }

    /**
     * 打开更多菜单
     */
    open = () => {
        this.showPopover()
    }

    onMoreMenuSelected = (tab) => {
        this.closePopover();
        let TargetComponent, params = {...this.props, menuType:tab}
        switch (tab) {
            case MORE_MENU.ABOUT:
                TargetComponent = AboutPage;
                break;
            case MORE_MENU.Author:
                
                break;
            case MORE_MENU.CUSTOM_KEY:
                TargetComponent = CustomTagsPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.CUSTOM_LANGUAGE:
                TargetComponent = CustomTagsPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.CUSTOM_THEME:
                
                break;
            case MORE_MENU.REMOVE_KEY:
                TargetComponent = CustomTagsPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.SORT_KEY:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.SORT_LANGUAGE:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.FEEDBACK:
                var url = 'mailto://myheadisradio@gmail.com';
                Linking.canOpenURL(url)
                    .then(supported => {
                        if(!supported){
                            console.log('Can\' handle url:', url);
                        }else{
                            return Linking.openURL(url);
                        }
                    })
                    .catch(err => console.log('open url failed:', err));
                break;
            case MoreMenu.SHARE:
                
                break;
        }
        if(TargetComponent){
            this.props.navigator.push({
                component:TargetComponent,
                params:params
            })
        }
    }

    showPopover = () => {
        if(!this.props.anchorView) return ;
        let anchorView = this.props.anchorView();
        anchorView.measure((ox, oy, width, height, px, py) => {
            this.setState({
                buttonReact:{x:px, y:py, width:width, height:height},
                isVisible:true
            })
        })
    }

    closePopover = () => {
        this.setState({
            isVisible:false
        })
    }

    renderMoreMenu = () => {
        return <Popover
            contentMarginRight={15}
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonReact}
            onClose={this.closePopover}
            placement={'bottom'}
            contentStyle={{backgroundColor:"#343434", opacity:0.82}}>
                {this.props.menus.map((result, i, arr) => {
                    return <TouchableOpacity key={i} underlayColor='transparent' onPress={() => this.onMoreMenuSelected(arr[i])} >
                    <Text style={{fontSize:18, color:'white', fontWeight:"400", padding:8}} >
                        {arr[i]}
                    </Text>
                </TouchableOpacity>})}
            </Popover>
    }

    render(){
        return this.renderMoreMenu()
    }
}