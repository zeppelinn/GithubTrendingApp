import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
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
}