import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import CustomTagsPage from './CustomTagsPage';
import SortKeyPage from './SortKeyPage';
import {FLAG_LANGUAGE} from '../../expend/dao/LanguageDao'

export default class MyPage extends Component {
    render() {
        return (
            <View style={styles.container} >
                <NavigationBar
                    title={'我的'}
                >
                </NavigationBar>
                <Text
                    style={styles.tip}
                    onPress={() => {
                        this.props.navigator.push({
                            component:CustomTagsPage,
                            params:{...this.props, isRemoveTags:false, flag:FLAG_LANGUAGE.flag_key}
                        })
                    }}    
                >
                    自定义标签
                </Text>
                <Text
                    style={styles.tip}
                    onPress={() => {
                        this.props.navigator.push({
                            component:SortKeyPage,
                            params:{...this.props, flag:FLAG_LANGUAGE.flag_key}
                        })
                    }}    
                >
                    标签排序
                </Text>
                <Text
                    style={styles.tip}
                    onPress={() => {
                        this.props.navigator.push({
                            component:SortKeyPage,
                            params:{...this.props, flag:FLAG_LANGUAGE.flag_language}
                        })
                    }}    
                >
                    语言排序
                </Text>
                <Text
                    style={styles.tip}
                    onPress={() => {
                        this.props.navigator.push({
                            component:CustomTagsPage,
                            params:{...this.props, isRemoveTags:true, flag:FLAG_LANGUAGE.flag_key}
                        })
                    }}    
                >
                    标签删除
                </Text>
                <Text
                    style={styles.tip}
                    onPress={() => {
                        this.props.navigator.push({
                            component:CustomTagsPage,
                            params:{...this.props, isRemoveTags:true, flag:FLAG_LANGUAGE.flag_language, isRemoveTags:false}
                        })
                    }}    
                >
                    自定义语言
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    tip:{
        fontSize:29
    }
})