import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import HTMLView from 'react-native-htmlview';

export default class TrendingCell extends Component {
    render() {
        let description = `<p>${this.props.data.description}</p>`
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.onSelected()} >
                <View style={styles.cell_container} >
                    <Text style={styles.title} >{this.props.data.fullName}</Text>
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {}}
                        stylesheet={{
                            p:styles.description,
                            a:styles.description
                        }}
                    />
                    <Text style={styles.description} >{this.props.data.meta}</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}} >
                        <View style={{flexDirection:'row', alignItems:'center'}} >
                            <Text style={styles.description} >Build by:</Text>
                            {this.props.data.contributors.map((result, i, arr) => {
                                    console.log(this.props.data.contributors);
                                return <Image 
                                    source={{uri:arr[i]}}
                                    style={{height:22, width:22}}
                                    key={i}
                                />
                            })}
                            
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
    },
})