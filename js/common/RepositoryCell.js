import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

export default class RepositoryCell extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.container} >
                <View style={styles.cell_container} >
                    <Text style={styles.title} >{this.props.data.full_name}</Text>
                    <Text style={styles.description} >{this.props.data.description}</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}} >
                        <View style={{flexDirection:'row', alignItems:'center'}} >
                            <Text>Author:</Text>
                            <Image 
                                source={{uri:(this.props.data.owner.avatar_url)}}
                                style={{height:22, width:22}}
                            >
                            </Image>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}} >
                            <Text>Stars:</Text>
                            <Text>{this.props.data.stargazers_count}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}} >
                            <Image style={{width:22, height:22}} source={require('../../res/images/ic_star.png')} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    title:{
        fontSize:16,
        marginBottom:2,
        color:"#212121"
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:"#757575",
        
    },
    container:{
        flex:1,
    },
    cell_container:{
        backgroundColor:"white",
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:3,
        borderWidth:0.5,
        borderColor:"#dddddd",
        borderRadius:2,
        /* 设置ios下的阴影 start*/
        shadowColor:'gray',
        shadowOffset:{width:0.5, height:0.5},
        shadowOpacity:0.4,
        shadowRadius:1,
        /* 设置ios下的阴影 end*/

        /* 设置android下的阴影 start*/
        elevation:2
        /* 设置android下的阴影 end*/
    }
})