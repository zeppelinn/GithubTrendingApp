import {
    AsyncStorage
} from 'react-native';

export default class DataRepository {
    // 获取网络资源
    fetchNetRepository(url){
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(result => {
                    if(!result){
                        reject(new Error('ResponseData is empty!'));
                        return ;
                    }
                    resolve(result.items);
                    this.saveRepository(url, result.items, (error) => {
                        console.log('本地存储失败', error);
                    });
                })
                .catch(error => {
                    reject(error);
                })
        })
    }

    // 获取本地存储的数据
    fetchLocalRepository = (url) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if(!error){
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                }else{
                    reject(error);
                }
            })
        })
    }

    // 获取Github仓库数据
    fetchRepository = (url) => {
        return new Promise((resolve, reject) => {
            this.fetchLocalRepository(url)
                .then(result => {
                    if(result){
                        console.log('获取本地数据成功');
                        resolve(result);
                    }else{
                        console.log('本地数据为空');
                        this.fetchNetRepository(url)
                            .then(result => {
                                resolve(result);
                            })
                            .catch(e => {
                                reject(e);
                            })
                    }
                })
                .catch(e => {
                    console.log('本地数据获取异常', e);
                    this.fetchNetRepository(url)
                        .then(result => {
                            resolve(result);
                        })
                        .catch(e => {
                            reject(e);
                    })
                })
        })
    }

    saveRepository = (url, items, callback) => {
        if(url === null || items === null) return 
        console.log('saveRepository url->', url, ' items->', items);
        let wrapData = {items:items, update_date:new Date().getTime()};
        console.log('本地存储 ->', wrapData);
        AsyncStorage.setItem(url, JSON.stringify(wrapData), (error) => callback(error));
    }

    // 判断新的数据跟存储在数据库中的数据的时间戳，如果新数据的时间戳比本地数据的时间戳大超过4个小时，则说明本地数据已过期
    checkDate = (longTime) => {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if(currentDate.getMonth() !== targetDate.getMonth()) return false;
        if(currentDate.getDay() !== targetDate.getDay()) return false;
        if(currentDate.getHours() - targetDate.getHours() > 4) return false;
        return true;
    }

}