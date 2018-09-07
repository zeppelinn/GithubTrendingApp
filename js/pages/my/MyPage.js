import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableHighlight,
    Image
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import CustomTagsPage from './CustomTagsPage';
import SortKeyPage from './SortKeyPage';
import {FLAG_LANGUAGE} from '../../expend/dao/LanguageDao'
import { MORE_MENU } from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ViewUtils from '../util/ViewUtils';
import AboutPage from '../about/AboutPage'

export default class MyPage extends Component {

    onClick = (section) => {
        let TargetComponent, params = {...this.props, menuType:section}
        switch (section) {
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
        }
        if(TargetComponent){
            this.props.navigator.push({
                component:TargetComponent,
                params:params
            })
        }
    }

    getItem = (tag, icon, text) => {
        return ViewUtils.getSettingItems(() => this.onClick(tag), icon, text, {tintColor:'#2196F3'}, null);
    }

    render() {
        let navigationBar = <NavigationBar
                                title={'我的'}
                            />
        return (
            <View style={GlobalStyles.titleContainer} >
                {navigationBar}
                <ScrollView>
                    <TouchableHighlight
                        underlayColor="#D1D0CE"
                        onPress={() => {
                            this.onClick(MORE_MENU.ABOUT);
                        }}
                    >
                        <View style={[styles.item, {height:90}]} >
                            <View style={{flexDirection:'row', alignItems:'center'}} >
                                <Image style={[{width:40, height:40, marginRight:10}, {tintColor:'#2196F3'}]} source={require('../../../res/images/ic_trending.png')} />
                                <Text>GitHub Popular</Text>
                            </View>
                            <Image source={require('../../../res/images/ic_tiaozhuan.png')}
                                    style={[{
                                        marginRight:10,
                                        height:22,
                                        width:22
                                    }, {tintColor:'#2196F3'}]}
                            />
                        </View>
                    </TouchableHighlight>
                    {/* 趋势管理 */}
                    <View style={GlobalStyles.line} />
                    <Text style={styles.groupTitle} >趋势管理</Text>
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.CUSTOM_LANGUAGE, require('./img/ic_custom_language.png'), '自定义语言')}
                    <View style={GlobalStyles.line} />
                    {/* 语言排序 */}
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.SORT_LANGUAGE, require('./img/ic_swap_vert.png'), '语言排序')}
                    <View style={GlobalStyles.line} />
                    {/* 标签管理 */}
                    <Text style={styles.groupTitle} >标签管理</Text>
                    {this.getItem(MORE_MENU.CUSTOM_KEY, require('./img/ic_custom_language.png'), '自定义标签')}
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.SORT_KEY, require('./img/ic_swap_vert.png'), '标签排序')}
                    <View style={GlobalStyles.line} />
                    {/* 标签移除 */}
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.REMOVE_KEY, require('./img/ic_remove.png'), '标签移除')}
                    <View style={GlobalStyles.line} />
                    {/* 设置 */}
                    <Text style={styles.groupTitle} >设置</Text>
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.CUSTOM_THEME, require('./img/ic_view_quilt.png'), '自定义主题')}
                    <View style={GlobalStyles.line} />
                    {this.getItem(MORE_MENU.Author, require('./img/ic_insert_emoticon.png'), '关于作者')}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    item:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:"center",
        height:60,
        padding:10,
        backgroundColor:'white'
    },
    groupTitle:{
        marginLeft:10,
        marginTop:10,
        marginBottom:5,
        fontSize:12,
        color:'grey'
    }
})