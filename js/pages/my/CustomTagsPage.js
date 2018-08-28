import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    Image
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../util/ViewUtils'
import LanguageDao, {FLAG_LANGUAGE} from '../../expend/dao/LanguageDao';
import CheckBox from 'react-native-check-box';
import ArrayUtils from '../util/ArrayUtils';

export default class CustomTagsPage extends Component {
    constructor(props){
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            dataArray:[],
        }
        this.changeValues = [];
    }

    componentDidMount = () => {
        this.loadTags();
    }

    onLeftButtonBack = () => {
        if(this.changeValues.length === 0){
            this.props.navigator.pop();
            return ;
        }
        this.languageDao.save(this.state.dataArray);
        this.props.navigator.pop();
    }

    // 请求从数据库或keys.json文件中获取自定义标签类型
    loadTags = () => {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    dataArray:result
                });
            })
            .catch(err => {
                console.log('CustomTagPage 加载数据异常-->', err);
            })
    }

    saveTags = () => {
        this.languageDao.save(this.state.dataArray)
    }

    // 处理每个checkbox的点击事件，更新每个checkbox的isChecked状态
    onClickCheckBox = (data) => {
        data.checked = !data.checked;
        this.setState({
            dataArray:this.updateItemInArray(data)
        })
        ArrayUtils.updateArray(this.changeValues, data)
    }

    updateItemInArray = (data) => {
        let array = this.state.dataArray.slice(0);
        for (let i = 0; i < array.length; i++) {
            if(array[i].name === data.name){
                array[i].checked = data.checked;
            }
        }
        return array;
    }

    // 渲染checkBox
    renderCheckBox = (data) => {
        let leftText = data.name;
        return (
            <CheckBox
                style={{
                    flex:1,
                    padding:10
                }}
                onClick={() => this.onClickCheckBox(data)}
                leftText={leftText}
                checkedImage={<Image 
                    source={require('./img/ic_check_box.png')}
                    style={{tintColor:"#6495ed"}}
                    />}
                unCheckedImage={<Image 
                    source={require('./img/ic_check_box_outline_blank.png')}
                    style={{tintColor:"#6495ed"}}
                    />}
                isChecked={data.checked}
            >
            </CheckBox>
        )
    }

    renderTags = ()=> {
        if(!this.state.dataArray || this.state.dataArray.length === 0){
            return ;
        }else{
            let len = this.state.dataArray.length;
            let tags = [];
            for (let i = 0, l = len - 2; i < l; i += 2) {
                tags.push(
                    <View key={i}>
                        <View style={styles.item} >
                            {this.renderCheckBox(this.state.dataArray[i])}
                            {this.renderCheckBox(this.state.dataArray[i + 1])}
                        </View>
                        <View style={styles.line} ></View>
                    </View>
                )
            }
            tags.push(
                <View key={len - 1}>
                    <View style={styles.item} >
                        {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                        {this.renderCheckBox(this.state.dataArray[len - 1])}
                    </View>
                    <View style={styles.line} ></View>
                </View>
            )
            return tags;
        }
    }



    render() {
        let rightButton = <TouchableOpacity
            onPress={() => this.saveTags()}
        >
            <View style={{marginRight:10}} >
                <Text style={styles.title} >
                    保存
                </Text>
            </View>
        </TouchableOpacity>

        return (
            <View style={styles.container} >
                <NavigationBar
                    title={'自定义标签'}
                    leftButton={ViewUtils.getLeftButton(() => {
                        this.onLeftButtonBack();
                    })}
                    rightButton={rightButton}
                >
                </NavigationBar>
                <ScrollView>
                    {this.renderTags()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    tip:{
        fontSize:29
    },
    title:{
        fontSize:20,
        color:'white',
        
    },
    line:{
        height:0.3,
        backgroundColor:'darkgrey'
    },
    item:{
        flexDirection:'row',
        alignItems:'center'
    }
})