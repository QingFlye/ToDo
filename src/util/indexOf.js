/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function () {

    // 查找元素在数组中的位置
    function indexOf(arr, elem, i) {
        var len;

        if (arr) {
            if (arr.indexOf) {
                return arr.indexOf(elem, i);
            }

            len = arr.length;
            i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

            for (; i < len; i++) {
                if (i in arr && arr[i] === elem) {
                    return i;
                }
            }
        }

        return -1;
    }

    return indexOf;
});
