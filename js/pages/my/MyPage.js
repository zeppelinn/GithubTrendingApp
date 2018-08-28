import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import CustomTagsPage from './CustomTagsPage';

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
                            params:{...this.props}
                        })
                    }}    
                >
                    自定义标签
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