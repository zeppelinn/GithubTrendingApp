import HttpUtils from "../../../HttpUtils";

export default class DataRepository {
    fetchNetRepository(url){
        return HttpUtils.get(url);
    }
}