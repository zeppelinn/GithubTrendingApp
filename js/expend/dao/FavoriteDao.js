import {
    AsyncStorage,
} from 'react-native';

export var FAVORITE_KEY_PREFIX = 'favorite_'

export default class FavoriteDao{
    constructor(flag){
        this.flag = flag;
        this.favorKey = FAVORITE_KEY_PREFIX + flag
    }


    /**
     * 保存收藏的项目
     * @param key 项目id(或者项目名称)
     * @param value 收藏项目
     * @param callback 回调
     * 
     * */ 
    saveFavorItem = (key, value, callback) =>{
        console.log('save key -> ', key);
        console.log('save value -> ', value);
        AsyncStorage.setItem(key, value, (error, result) => {
            if(!error){
                this.updateFavorKeys(key, true);
            }else{
                console.log(error);
            }
        })
    }

    /** 
     * 更新Favorite的Key集合 
     * @param key
     * @param isAdd true为添加 false为删除
     * */
    
    updateFavorKeys = (key, isAdd) => {
        AsyncStorage.getItem(this.favorKey, (error, result) => {
            if(!error){
                var favorKeys = [];
                if(result){
                    favorKeys = JSON.parse(result);
                }
                var index = favorKeys.indexOf(key);
                if(isAdd){
                    if(index === -1) favorKeys.push(key);
                }else{
                    if(index !== -1) favorKeys.splice(index, 1);
                }
                AsyncStorage.setItem(this.favorKey, JSON.stringify(favorKeys))
            }
        })
    }

    /**
     * 移除已经保存的项目
     * @param key 
     * */ 
    removeFavorItem = (key) => {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updateFavorKeys(key, false);
            }
        })
    }

    /**
     * 获取收藏项目对应key
     * 
    */
    getFavorKey = () => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favorKey, (error, res) => {
                if(!error){
                    try {
                        resolve(JSON.parse(res));
                    } catch (e) {
                        reject(e)
                    }
                }else{
                    reject(error);
                }
            })
        })
    }

    /**
     * 获取所有的用户收藏的项目
     * 
    */
   getAllItems = () => {
       return new Promise((resolve, reject) => {
           this.getFavorKey().then(keys => {
               var items = [];
               if(keys){
                   AsyncStorage.multiGet(keys, (err, storage) => {
                        try {
                            for (let i = 0; i < storage.length; i++) {
                                items.push(storage[i][1]);
                            }
                            resolve(items)
                        } catch (error) {
                            reject(error);
                        }
                   })
               }else{
                   resolve(items);
               }
           })
           .catch(error => {
               reject(error);
           })
       })
   }

}