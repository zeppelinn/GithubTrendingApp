import RepositoryDetail from "../RepositoryDetail";

export default class ActionUtils{
    /**
     * 点击跳转到项目仓库网页
     */
    static onRepositorySelected = (params) => {
        var {navigator} = params;
        navigator.push({
            component:RepositoryDetail,
            params:{
                ...params
            }
        })
    }

    /**
     * 收藏或取消收藏某个项目
     */
    static onFavorite = (favoriteDao, item, isFavorite) => {
        let key = item.fullName || item.id
        if(isFavorite){
            favoriteDao.saveFavorItem(key.toString(), JSON.stringify(item))
        }else{
            favoriteDao.removeFavorItem(key.toString());
        }
    }

}