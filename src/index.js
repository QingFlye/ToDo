/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var category = require('./category/controller');
    var detail = require('./detail/controller');
    var list = require('./list/controller');


    // 初始化函数
    function init() {

        // 1.当分类列表加载完毕，继续加载任务列表
        category.on('change', function (currentCategory) {
            list.init(currentCategory);
        });

        // 2.当任务列表加载完毕，加载单个任务的内容详情
        list.on('change', function (currentTaskId) {
            detail.init(currentTaskId);
        });

        // 3.点击列表的add事件时，触发add方法
        list.on('add', function (id) {
            detail.add(id);
        });

        // 4.进入页面，首先初始化分类列表
        category.init();
    }

    return {
        init: init
    };
});
