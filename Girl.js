import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

export default class Girl extends Component {

    constructor(props){
        super(props);
        this.state = {
            gift:""
        }
    }

  render() {
    return (
        <View style={styles.container} >
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
        backgroundColor:"red",
        flex:1,
        justifyContent:"center"
    },
    text:{
        fontSize:22
    }
})