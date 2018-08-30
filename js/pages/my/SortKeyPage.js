import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableHighlight,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import LanguageDao, { FLAG_LANGUAGE } from '../../expend/dao/LanguageDao';
import ArrayUtils from '../util/ArrayUtils'
import SortableListView from 'react-native-sortable-listview'
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'

export default class SortKeyPage extends Component {

    constructor(props){
        super(props);
        this.dataArray = [];   //从数据库或keys.json文件中获取的标签资源
        this.sortResultArray = [];   //经过排序之后重组的标签
        this.originalCheckedArray = [];   //原始的选中的标签
        this.state = {
            checkedArray: [],
        }
    }
    
    componentDidMount = () => {
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch().then((result)=> {
            this.getCheckedItems(result);
        }).catch((error)=> {
            console.log(error);
        });
    }

    getCheckedItems(result) {
        this.dataArray = ArrayUtils.cloneArray(result);
        let checkedArray = [];
        for (let i = 0, j = result.length; i < j; i++) {
            let data = result[i];
            if (data.checked)checkedArray.push(data);
        }
        this.setState({
            checkedArray: checkedArray
        })
        this.originalCheckedArray = ArrayUtils.cloneArray(checkedArray);
    }

    onBack = () => {
        if(ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)){
            this.props.navigator.pop();
            return ;
        }else{
            Alert.alert('提示', '是否保存此次修改？', 
                [
                    {text:'不保存', onPress:() => {
                        this.props.navigator.pop();
                    }},
                    {text:'保存', onPress:() => {
                        this.getSortedResult();
                        this.languageDao.save(this.sortResultArray);
                        this.props.navigator.pop();
                    }}
                ]
            )
        }
    }

    saveTags = () => {
        if(ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)){
            this.props.navigator.pop();
            return ;
        }else{
            this.getSortedResult();
            this.languageDao.save(this.sortResultArray);
            this.props.navigator.pop();
        }
    }

    getSortedResult = () => {
        this.sortResultArray = ArrayUtils.cloneArray(this.dataArray);
        for (let i = 0; i < this.originalCheckedArray.length; i++) {
            let item = this.originalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i])
        }
    }

    render() {
        let rightButton = <TouchableOpacity 
                            onPress={() => this.saveTags()}>
                            <View style={{marginRight:10}} >
                                <Text style={styles.title} >
                                    保存
                                </Text>
                            </View>
                        </TouchableOpacity>
        return (
            <View style={styles.container} >
                <NavigationBar
                    title={'标签排序'}
                    leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                    rightButton={rightButton}
                />
                <SortableListView
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={(e) => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow={row => <SortCell data={row}/>}
                >

                </SortableListView>
            </View>
        )
    }
}

class SortCell extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                delayLongPress={500}
                style={styles.cellstyle}
                {...this.props.sortHandlers}
            >
                <View style={styles.row} >
                    <Image source={require('./img/ic_sort.png')} style={styles.image} />
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    cellstyle:{
        padding:15,
        backgroundColor:"#f8f8f8",
        borderBottomWidth:1,
        borderColor:"#eee"
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
    },
    image:{
        tintColor:'#2196F3',
        width:16, 
        height:16,
        marginRight:10
    },
    title:{
        fontSize:20,
        color:'white',
    },
})
