/**
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function () {

    // 合并多个对象到第一个对象
    function extend(target, args) {
        target = target || {};

        var i = 1;

        // 只传进来target时候直接返回target
        if (arguments.length === i) {
            return target;
        }

        for (; i < arguments.length; i++) {
            args = arguments[i];
            if (args != null) {
                for (var name in args) {
                    if (args.hasOwnProperty(name) && args[name] !== undefined) {
                        target[name] = args[name];
                    }
                }
            }
        }

        return target;
    }

    return extend;
});
