export default class Utils{

    /**
     * 检查item的id是否在items中
     */
    static checkFavor = (item, items) => {
        for (let i = 0; i < items.length; i++) {
            if (item.id.toString() === items[i]) {
                return true;
            }
        }
        return false;
    }
}