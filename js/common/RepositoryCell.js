import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

export default class RepositoryCell extends Component {

    constructor(props){
        super(props);
        this.state = {
            isFavorite:this.props.projectModel.isFavorite,
            favouriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    setFavoriteState = (isFavorite) => {
        this.setState({
            isFavorite,
            favouriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    onFavouriteIconPressed = () => {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavouriteIconPressed(this.props.projectModel.item, !this.state.isFavorite);
    }

    render() {
        let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;
        let favorIcon = <TouchableOpacity onPress={() => this.onFavouriteIconPressed()}>
            <Image style={{width:22, height:22, tintColor:"#2196F3"}} source={this.state.favouriteIcon}/>
        </TouchableOpacity>
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.onSelected()} >
                <View style={styles.cell_container} >
                    <Text style={styles.title} >{item.full_name}</Text>
                    <Text style={styles.description} >{item.description}</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}} >
                        <View style={{flexDirection:'row', alignItems:'center'}} >
                            <Text>Author:</Text>
                            <Image 
                                source={{uri:(item.owner.avatar_url)}}
                                style={{height:22, width:22}}
                            >
                            </Image>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}} >
                            <Text>Stars:</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}} >
                            {favorIcon}
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