import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native'
import NavigationBar from './js/common/NavigationBar';
import GitHubTrending from 'GitHubTrending';

export default class TrendingTest extends React.Component{
    constructor(props){
        super(props);
        this.githubTrending = new GitHubTrending();
        this.state = {
            result:''
        }
    }

    onLoad = () => {
        let url = `https://github.com/trending/${this.text}`;
        this.githubTrending.fetchTrending(url)
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