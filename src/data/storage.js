/**
 * @file storage 用于数据存储
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function () {

    // 本地使用localStorage来存储数据
    var localStorage = window.localStorage;

    // 给localStorage加一个memory cache
    var cache = {};

    // 扩展localStorage以支持JSON
    return {

        // 获取数据
        getItem: function (key) {
            return key in cache ? cache[key] : JSON.parse(localStorage.getItem(key));
        },

        // 设置数据
        setItem: function (key, value) {

            // 要注意，不能用localStorage来存储undefined
            if (value == null) {
                value = null;
            }

            // 保存数据
            localStorage.setItem(key, JSON.stringify(cache[key] = value));
        },

        // 删除数据
        removeItem: function (key) {
            delete cache[key];
            localStorage.removeItem(key);
        },

        // 清空数据
        clear: function () {
            cache = {};
            localStorage.clear();
        }
    };
});
