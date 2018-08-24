import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native'

import NavigationBar from './js/common/NavigationBar';

export default class Girl extends Component {

    constructor(props){
        super(props);
        this.state = {
            gift:""
        }
    }

    renderButton(style, source) {
        return (
            <TouchableOpacity 
                onPress={
                    () => {
                        this.props.navigator.pop();
                    }
                }
            >
                <Image style={style} source={source} ></Image>
            </TouchableOpacity>
        )
    }
    render() {

        return (
            <View style={styles.container} >
                <NavigationBar
                    title={'Girl'}
                    style={{
                        backgroundColor:"#ee6363"
                    }}
                    leftButton = {
                        // <TouchableOpacity>
                        //     <Image style={{width:25, height:25, marginLeft:12}} source={require('./res/images/ic_arrow_back_white_36pt.png')} ></Image>
                        // </TouchableOpacity>
                        this.renderButton({width:25, height:25, marginLeft:12}, require('./res/images/ic_arrow_back_white_36pt.png'))
                    }
                    rightButton = {
                        // <TouchableOpacity>
                        //     <Image style={{width:25, height:25, marginRight:12}} source={require('./res/images/ic_star.png')} ></Image>
                        // </TouchableOpacity>
                        this.renderButton({width:25, height:25, marginRight:12}, require('./res/images/ic_star.png'))
                    }
                >
                </NavigationBar>
                <Text style={styles.text} >I am a girl</Text>
                <Text style={styles.text} >{ this.props.gift }</Text>
                <Text style={styles.text} 
                    onPress={() => {
                        this.props.callback('坦克');
                        this.props.navigator.pop();
                    }}
                >感谢</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    text:{
        fontSize:22
    }
})