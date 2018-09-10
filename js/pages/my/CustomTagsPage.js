import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../util/ViewUtils'
import LanguageDao, {FLAG_LANGUAGE} from '../../expend/dao/LanguageDao';
import CheckBox from 'react-native-check-box';
import ArrayUtils from '../util/ArrayUtils';
import {MORE_MENU} from '../../common/MoreMenu'
import { ACTION_HOME, FLAG_TAB } from '../HomePage';

export default class CustomTagsPage extends Component {
    constructor(props){
        super(props);
        this.languageDao = new LanguageDao(this.props.flag);
        this.state = {
            dataArray:[],
            deleteArray:[],
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
        Alert.alert('提示', '是否保存此次修改？', 
            [
                {text:'不保存', onPress:() => {
                    this.props.navigator.pop();
                }},
                {text:'保存', onPress:() => {
                    this.languageDao.save(this.state.dataArray);
                    this.props.navigator.pop();
                }}
            ]
        )
        
    }

    // 请求从数据库或keys.json文件中获取自定义标签类型
    loadTags = () => {
        this.languageDao.fetch()
            .then(result => {
                let tempArray = [];
                for (let i = 0; i < result.length; i++) {
                    let item = {
                        name: result[i].name,
                        isChecked:false
                    }
                    tempArray.push(item);
                }
                this.setState({
                    dataArray:result,
                    deleteArray:tempArray
                });
            })
            .catch(err => {
                console.log('CustomTagPage 加载数据异常-->', err);
            })
    }

    saveTags = () => {
        if(this.changeValues.length === 0){
            this.props.navigator.pop();
            return ;
        }
        if(this.props.isRemoveTags){
            let array = this.state.dataArray.slice(0);
            for (let i = 0; i < this.changeValues.length; i++) {
                for (let j = 0; j < array.length; j++) {
                    console.log('array ->', array[j].name, ' change ->', this.changeValues[i].name);
                    if(array[j].name === this.changeValues[i].name){
                        this.setState({
                            dataArray:this.state.dataArray.splice(j, 1)
                        })
                    }
                }
            }
        }
        this.languageDao.save(this.state.dataArray);
        var jumpToType = this.props.flag === FLAG_LANGUAGE.flag_key ? FLAG_TAB.flag_popularTab : FLAG_TAB.flag_trendingTab
        DeviceEventEmitter.emit('ACTION_HOME', ACTION_HOME.A_RESTART, {selectedTab:jumpTab});
        // this.props.navigator.pop();
    }

    // 处理每个checkbox的点击事件，更新每个checkbox的isChecked状态
    onClickCheckBox = (data) => {
        data.checked = !data.checked;
        this.props.isRemoveTags ? 
        this.setState({
            dataArray:this.updateItemInArray(data)
        }) : 
        this.setState({
            deleteArray:this.updateItemInArray(data)
        })
        ArrayUtils.updateArray(this.changeValues, data)
        console.log("this.changeValues.length -> ", this.changeValues.length);
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

    getRenderItem = (index) => {
        return this.props.isRemoveTags ? this.state.deleteArray[index] : this.state.dataArray[index];
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
                            {this.renderCheckBox(this.getRenderItem(i))}
                            {this.renderCheckBox(this.getRenderItem(i + 1))}
                        </View>
                        <View style={styles.line} ></View>
                    </View>
                )
            }
            tags.push(
                <View key={len - 1}>
                    <View style={styles.item} >
                        {len % 2 === 0 ? this.renderCheckBox(this.getRenderItem(len - 2)) : null}
                        {this.renderCheckBox(this.getRenderItem(len - 1))}
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
                    {this.props.isRemoveTags ? "删除" : "保存"}
                </Text>
            </View>
        </TouchableOpacity>

        let title = this.props.isRemoveTags ? '删除自定义标签':"自定义标签";
        title = this.props.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        title = this.props.menuType === MORE_MENU.REMOVE_KEY ? '标签移除' : title
        return (
            <View style={styles.container} >
                <NavigationBar
                    title={title}
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