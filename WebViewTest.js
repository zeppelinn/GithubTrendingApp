import React, { Component } from 'react'
import {
    View,
    WebView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native'
import NavigationBar from './js/common/NavigationBar';

const URL = 'https://www.google.com';

export default class WebViewTest extends Component {

    constructor(props){
        super(props);
        this.state = {
            url:URL,
            title:'',
            canGoBack:false,

        }
    }

    goBack = () => {
        if(this.state.canGoBack){
            this.webView.goBack();
        }
    }

    go = () => {
        this.setState({
            url:this.text
        })
    }

    onNavigationStateChange = (e) => {
        this.setState({
            canGoBack:e.canGoBack,
            title:e.title,
        })
    }

    render() {
        return (
            <View style={{flex:1}} >
                <NavigationBar
                    title={'WebViewTest'}
                >
                </NavigationBar>
                <View style={styles.row} >
                    <Text onPress={() => this.goBack()} style={styles.button} >
                        返回
                    </Text>
                    <TextInput
                        style={styles.input}
                        defaultValue={URL}
                        onChangeText={(text) => {
                            this.text = text;
                        }}
                    >

                    </TextInput>
                    <Text onPress={() => this.go()} style={styles.button} >
                        Go
                    </Text>
                </View>
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row:{
        flexDirection:'row',
        alignItems:'center',
        margin:10
    },
    input:{
        height:40,
        flex:1,
        borderWidth:0.5,
        margin:2
    },
    button:{
        fontSize:20
    }
});