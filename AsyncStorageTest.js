import React, { Component } from 'react'
import {
    View,
    AsyncStorage,
    TextInput,
    Text,
    StyleSheet
} from 'react-native';
import NavigationBar from './js/common/NavigationBar';
import Toast, {DURATION} from 'react-native-easy-toast';

const KEY = 'test';

export default class AsyncStorageTest extends Component {

    save = () => {
        AsyncStorage.setItem(KEY, this.text, (err) => {
            if(!err){
                this.toast.show('保存成功', DURATION.LENGTH_SHORT);
            }else{
                this.toast.show('保存失败', DURATION.LENGTH_SHORT);
            }
        })
    }

    remove = () => {
        AsyncStorage.removeItem(KEY, (err) => {
            if(!err){
                this.toast.show('移除成功', DURATION.LENGTH_SHORT);
            }else{
                this.toast.show('移除失败', DURATION.LENGTH_SHORT);
            }
        })
    }

    fetch = () => {
        AsyncStorage.getItem(KEY, (err, result) => {
            if(!err){
                if(result){
                    this.toast.show(result, DURATION.LENGTH_SHORT);
                }else{
                    this.toast.show(KEY + "不存在", DURATION.LENGTH_SHORT);
                }
            }else{
                this.toast.show('取出失败：' + err, DURATION.LENGTH_SHORT);
            }
        })
    }

    render() {
        return (
            <View style={{flex:1}} >
                <NavigationBar
                    title={'AsyncStorageTest'}
                >
                </NavigationBar>
                <TextInput 
                    style={{
                        borderWidth:1,
                        height:40
                    }}
                    onChangeText={(text) => this.text = text}
                />
                <View style={{flexDirection:'row'}} >
                    <Text
                        style={styles.tips}
                        onPress={() => this.save()}
                    >
                        保存
                    </Text>
                    <Text
                        style={styles.tips}
                        onPress={() => this.remove()}
                    >
                        移除
                    </Text>
                    <Text
                        style={styles.tips}
                        onPress={() => this.fetch()}
                    >
                        取出
                    </Text>
                </View>
                <Toast ref={toast => this.toast = toast} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tips:{
        margin:10,
        fontSize:20
    }
})