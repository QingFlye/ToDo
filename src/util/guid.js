/**
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function () {

    var index = 1;

    // 获取一个全局唯一标识
    function guid(prefix) {
        return (prefix || '') + index++;
    }

    return guid;
});
