export default class ArrayUtils {
    static updateArray = (array, item) => {
        for (let i = 0, len = array.length; i < len; i++) {
            var temp = array[i];
            if(temp === item){
                array.splice(i, 1);
                return ;
            }
        }
        array.push(item);
    }
    static cloneArray = (array) => {
        if(!array) return [];
        let newArray = [];
        for (let i = 0, len = array.length; i < len; i++) {
            newArray[i] = array[i]
        }
        return newArray;
    }

    static isEqual = (arr1, arr2) => {
        if(!(arr1 && arr2)) return false;
        if(arr1.length !== arr2.length){
            console.log('arr1.len=', arr1.length);
            console.log('arr2.len=', arr2.length);
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if(arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
}