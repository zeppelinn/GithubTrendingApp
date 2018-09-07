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

    // 判断新的数据跟存储在数据库中的数据的时间戳，如果新数据的时间戳比本地数据的时间戳大超过4个小时，则说明本地数据已过期
    static checkDate = (longTime) => {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if(currentDate.getMonth() !== targetDate.getMonth()) return false;
        if(currentDate.getDay() !== targetDate.getDay()) return false;
        if(currentDate.getHours() - targetDate.getHours() > 4) return false;
        return true;
    }

}