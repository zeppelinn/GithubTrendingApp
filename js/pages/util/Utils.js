export default class Utils{

    /**
     * 检查item的id是否在items中
     */
    static checkFavor = (item, items) => {
        for (let i = 0; i < items.length; i++) {
            let id = item.id ? item.id.toString() : item.fullName;
            if (id === items[i]) {
                return true;
            }
        }
        return false;
    }
}