import {
    AsyncStorage,
} from 'react-native'
import DataRepository, {FLAG_STORAGE} from './DataRepository'
import Utils from '../../pages/util/Utils'

var itemMap = new Map();

export default class RepositoryUilts{
    constructor(about_common){
        this.about_common = about_common;
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my)
    }

    /**
     * 获取指定url下的数据
     * @param url
    */
    fetchResository = (url) => {
        this.dataRepository.fetchRepository(url)
            .then(result => {
                if(result){
                    this.updateData(url, result);
                    if (!Utils.checkDate(result.update_date)) {
                        return this.dataRepository.fetchNetRepository(url);
                    }
                }
            })
            .then(items => {
                if(items){
                    this.updateData(url, items);
                }
            })
            .catch(error => {
            })
    }

    /**
     * 更新数据
     * @param k
     * @param v
     */
    updateData = (k, v) => {
        itemMap.set(k, v);
        var arr = [];
        for(var value of itemMap.values()){
            arr.push(value);
        }
        console.log('updateData onNotifiedDataChanged ---> ', arr)
        this.about_common.onNotifiedDataChanged(arr);
    }

    /**
     * 批量获取url对应的数据
     */
    fetchResositories = (urls) => {
        if(urls){
            for (let i = 0; i < urls.length; i++) {
                var url = urls[i];
                fetchResository(url);
            }
        }
    }


}