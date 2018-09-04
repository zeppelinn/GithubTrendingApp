import React, { Component } from 'react'
import {
    View,
    WebView,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native'
import NavigationBar from '../common/NavigationBar';
import ViewUtils from './util/ViewUtils';
import FavoriteDao from '../expend/dao/FavoriteDao';

export default class RepositoryDetail extends Component {
    constructor(props){
        super(props);
        this.url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url : `https://github.com/${this.props.projectModel.item.fullName}`;
        this.title = this.props.projectModel.item.full_name ? this.props.projectModel.item.full_name : this.props.projectModel.item.fullName;
        this.favoriteDao = new FavoriteDao(this.props.flag);
        console.log('constructor -> ', this.props.projectModel.isFavorite)
        this.state = {
            url:this.url,
            title:this.title,
            canGoBack:false,
            isFavorite:this.props.projectModel.isFavorite,
            favouriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
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

    setFavoriteState = (isFavorite) => {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite:isFavorite,
            favouriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
        })
    }

    onFavorIconPressed = () => {
        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite)
        var key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if(projectModel.isFavorite){
            this.favoriteDao.saveFavorItem(key, JSON.stringify(projectModel.item))
        }else{
            this.favoriteDao.removeFavorItem(key);
        }
    }

    rightButton = () => {
        return <TouchableOpacity 
            onPress={() => this.onFavorIconPressed()}
        >
            <Image
                source={this.state.favouriteIcon}
                style={{height:20, width: 20, marginRight:10}}
            />
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={{flex:1}} >
                <NavigationBar
                    title={this.state.title}
                    leftButton={
                        ViewUtils.getLeftButton(() => this.onBack())
                    }
                    rightButton = {
                        this.rightButton()
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