import React, { Component } from 'react'
import {
    View,
    WebView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar';
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtils from '../pages/util/ViewUtils'

const URL = 'https://www.google.com';

export default class WebViewPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            url:this.props.url,
            title:this.props.title,
            canGoBack:false,

        }
    }

    goBack = () => {
        if(this.state.canGoBack){
            this.webView.goBack();
        }else{
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange = (e) => {
        this.setState({
            canGoBack:e.canGoBack,
        })
    }

    render() {
        return (
            <View style={GlobalStyles.titleContainer} >
                <NavigationBar
                    title={this.props.title}
                    leftButton={ViewUtils.getLeftButton(() => this.goBack())}
                >
                </NavigationBar>
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                />
            </View>
        )
    }
}