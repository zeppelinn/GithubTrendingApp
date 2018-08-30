import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expend/dao/DataRepository';

export default class TrendingPage extends React.Component{
    constructor(props){
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state = {
            result:''
        }
    }

    onLoad = () => {
        let url = `https://github.com/trending/${this.text}`;
        this.dataRepository.fetchRepository(url)
            .then(result => {
                if(result){
                    this.setState({
                        result:result
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    render(){
        return (
            <View style={styles.container} >
                <NavigationBar
                    title={'GithubTrendingTest'}
                />
                <TextInput
                    style={{height:30, borderWidth:1}}
                    onChangeText={(text) => this.text = text}
                />
                <View>
                    <Text style={styles.text} onPress={() => this.onLoad()} >
                        加载
                    </Text>
                    <Text>
                        {JSON.stringify(this.state.result)}
                    </Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    text:{
        fontSize:22
    }
})