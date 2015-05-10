/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var each = require('./each');
    var type = require('./type');


    var rvalue = /^(?:number|string|boolean|regexp)$/;

    // 克隆一个朴素对象
    function clone(obj, deep) {

        // 值类型、函数不需要进行复制
        if (obj == null || typeof obj !== 'object') {
            return obj;
        }

        var t = type(obj);

        // number、string、boolean的包装类型和正则表达式直接返回对应的值
        if (rvalue.test(t)) {
            return obj.valueOf();
        }

        // 日期不是只读的，需要重新生成一个日期对象
        if (t === 'date') {
            return new Date(+obj);
        }

        // 对于array/error/object需要进行一次遍历赋值
        var ret = t === 'array' ? [] : t === 'error' ? new Error() : {};

        each(obj, function (k, v) {
            ret[k] = deep ? clone(v, true) : v;
        });

        return ret;

    }

    return clone;
});
