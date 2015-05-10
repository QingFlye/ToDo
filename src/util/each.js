/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var type = require('./type');

    // 遍历数组或者对象并执行回调函数
    function each(obj, callback) {
        var value;
        var i;
        if (type(obj) === 'array') {
            i = 0;
            for (var length = obj.length; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
                }
            }
        }
        else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    value = callback.call(obj[i], i, obj[i]);
                    if (value === false) {
                        break;
                    }
                }
            }
        }
        return obj;
    }

    return each;
});
