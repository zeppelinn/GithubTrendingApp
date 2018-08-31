import React, { Component } from 'react'
import {
    View,
    WebView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar';
import ViewUtils from './util/ViewUtils';

export default class RepositoryDetail extends Component {
    constructor(props){
        super(props);
        this.url = this.props.item.html_url ? this.props.item.html_url : `https://github.com/${this.props.item.fullName}`;
        this.title = this.props.item.full_name ? this.props.item.full_name : this.props.item.fullName;
        console.log(this.props.item);
        this.state = {
            url:this.url,
            title:this.title,
            canGoBack:false,

        }
    }

    onBack = () => {
        if(this.state.canGoBack){
            this.webView.goBack();
        }else{
            this.props.navigator.pop();
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
        })
    }

    render() {
        return (
            <View style={{flex:1}} >
                <NavigationBar
                    title={this.state.title}
                    leftButton={
                        ViewUtils.getLeftButton(() => this.onBack())
                    }
                >
                </NavigationBar>
                <WebView
                    ref={webView => this.webView = webView}
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                    startInLoadingState={true}
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