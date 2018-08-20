import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import Girl from './Girl';

export default class Boy extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gift:""
        }
    }

    render(){
        return (
            <View style={styles.container} >
                <Text style={styles.text} > I am a boy </Text>
                <Text
                    style={styles.text}
                    onPress={() => {
                        this.props.navigator.push({
                            component:Girl,
                            params:{
                                gift:"飞机",
                                callback: (return_gift) => {
                                    this.setState({
                                        gift: return_gift
                                    })
                                }
                            }
                        })
                    }}
                    >
                    送飞机
                </Text>
                <Text style={styles.text} >收到了 {this.state.gift} </Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"grey",
        flex:1,
        justifyContent:"center"
    },
    text:{
        fontSize:22
    }
})