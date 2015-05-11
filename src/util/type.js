/**
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function () {
    var class2type = {};
    var toString = class2type.toString;

    'Boolean Number String Function Array Date RegExp Object Error'.replace(/\w+/g, function (name) {
        class2type['[object ' + name + ']'] = name.toLowerCase();
    });

    // 获取变量的类型
    function type(obj) {
        if (obj == null) {
            return obj + '';
        }

        if (typeof obj === 'object' || typeof obj === 'function') {
            return class2type[toString.call(obj)] || 'object';
        }

        return typeof obj;
    }

    return type;
});
