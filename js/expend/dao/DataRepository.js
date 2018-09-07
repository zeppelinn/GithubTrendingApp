import {
    AsyncStorage
} from 'react-native';
import GitHubTrending from 'GitHubTrending';
import Utils from '../../pages/util/Utils';

export var FLAG_STORAGE = {flag_popular:'popular', flag_trending:'trending', flag_my:'my'}

export default class DataRepository {

    constructor(flag){
        this.flag = flag;
        if(this.flag === FLAG_STORAGE.flag_trending){
            this.trending = new GitHubTrending();
        }
    }

    // 获取网络资源
    fetchNetRepository(url){
        return new Promise((resolve, reject) => {
            if(this.flag === FLAG_STORAGE.flag_trending){
                this.trending.fetchTrending(url)
                    .then(result => {
                        if(!result){
                            reject(new Error('ResponseData is empty!'));
                            return ;
                        }
                        this.saveRepository(url, result, (error) => {
                            console.log('本地存储失败', error);
                        });
                        resolve(result);
                    })
                    .catch(error => {

                    })
            }else{
                fetch(url)
                .then(response => response.json())
                .then(result => {
                        if(!result){
                            reject(new Error('ResponseData is empty!'));
                            return ;
                        }
                        let items = this.flag === FLAG_STORAGE.flag_popular ? result.items : result;
                        resolve(items);
                        this.saveRepository(url, items, (error) => {
                            console.log('本地存储失败', error);
                        });
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
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
                        console.log('获取本地数据成功 ', result);
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
        if(url === null || items === null) return ;
        console.log('saveRepository url->', url, ' items->', items);
        let wrapData = {items:items, update_date:new Date().getTime()};
        console.log('本地存储 ->', wrapData);
        AsyncStorage.setItem(url, JSON.stringify(wrapData), (error) => callback(error));
    }

}