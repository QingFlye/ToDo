/**
 * Created by qing on 15-5-5.
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var Emitter = require('../util/Emitter');

    var model = require('./model');
    var view = require('./view');

    var controller = {
        init: function (currentCategory) {
            model.setCategory(currentCategory);
        }
    };

    Emitter.mixin(controller);

    controller.init = function (currentCategory) {
        // 设置当前分类
        model.setCategory(currentCategory);
    };


    // 点击add按钮的时候
    view.on('add', function () {
        controller.emit('add', model.getCategory());
    });

    // 切换了类型的时候
    view.on('type', function (type) {
        model.setType(type);
    });

    // 切换了类型的时候
    view.on('change', function (id) {
        model.setCurrentTask(id);
    });

    // 绑定模型修改事件
    model.on('change', function () {

        // 获取列表数据
        var tasks = model.getTasks();

        // 告诉view渲染列表
        view.draw(tasks);
    });

    // 当前任务变更事件
    model.on('current', function (id) {
        controller.emit('change', id);
    });

    return controller;
});
