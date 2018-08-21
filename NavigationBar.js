import React ,{ PropTypes }from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
} from 'react-native';

const NAVBAR_HEIGHT_ANDROID = 50;
const NAVBAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = 20;
const StatusBarShape = {
    backgroundColor:PropTypes.string,
    barStyle:PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    hidden:PropTypes.bool,
}

export default class NavigationBar extends React.Component{
    // 为组件指定属性，并为属性添加类型检查，来规范属性的类型
    static propTypes = {
        style:View.propTypes.style,
        title:PropTypes.string,
        titleView:PropTypes.element,
        hide:PropTypes.bool,
        leftButton:PropTypes.element,
        rightButton:PropTypes.element,
        statusBar:PropTypes.shape(StatusBarShape),
    }

    // 设置属性默认值
    static defaultProps = {
        statusBar:{
            barStyle:'light-content',
            hidden:false,
        }
    }

    constructor(props){
        super(props);
        this.state = {
            title:'',
            hide:false
        }
    }

    render(){
        let statusBar = <View style={[styles.statusBar, this.props.statusBar]} >
                <StatusBar {...this.props.statusBar} />
            </View>
        let titleView = this.props.titleView ? this.props.titleView : <Text style={styles.title} >{this.props.title}</Text>
        let content =
        <View style = {styles.navBar} >
            {this.props.leftButton}
            <View style={styles.titleViewContainer} >
                {titleView}
            </View>
            {this.props.rightButton}
        </View>;

        return (
            <View style={[styles.container, this.props.style]} >
                {statusBar}
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'grey'
    },
    navBar: {
        justifyContent:'space-between',
        alignItems:'center',
        height:Platform.OS === 'ios' ? NAVBAR_HEIGHT_IOS : NAVBAR_HEIGHT_ANDROID,
        flexDirection:'row'
    },
    titleViewContainer:{
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        left:40,
        right:40,
        top:0,
        bottom:0,
    },
    title:{
        fontSize:20,
        color:"white",

    },
    statusBar: {
        height:Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    }
})