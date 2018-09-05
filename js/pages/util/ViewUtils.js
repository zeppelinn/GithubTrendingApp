import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    StyleSheet
} from 'react-native';

export default class ViewUtils{
    static getLeftButton = (callback)=> {
        return <TouchableOpacity
            style={{padding:8}}
            onPress={callback}
        >
            <Image
                source={require('../../../res/images/ic_arrow_back_white_36pt.png')}
                style={{height:26, width:26}}
            />
        </TouchableOpacity>
    }

    /**
     * 获取设置页的Item
     * @param callBack  单击item的回调
     * @param icon      左侧图标
     * @param text      文本
     * @param tintStyle 图标着色
     * @param expandableIcon 右侧图标
     */
    static getSettingItems(callBack, icon, text, tintStyle, expandableIcon) {
        return (
            <TouchableHighlight onPress={callBack} >
                <View style={styles.setting_item_container} >
                            <View style={{flexDirection:'row', alignItems:'center'}} >
                                <Image resizeMode='stretch' style={[{width:16, height:16, marginRight:10}, tintStyle]} source={icon} />
                                <Text>{text}</Text>
                            </View>
                            <Image source={expandableIcon ? expandableIcon : require('../../../res/images/ic_tiaozhuan.png')}
                                    style={[{
                                        marginRight:10,
                                        height:22,
                                        width:22
                                    }, {tintColor:'#2196F3'}]}
                            />
                        </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    setting_item_container:{
        backgroundColor:'white',
        padding:10,
        height:60,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row'
    },
    item:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:"center",
        height:60,
        padding:10
    }
})