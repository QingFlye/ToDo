/**
 * Created by qing on 15-5-5.
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var Emitter = require('../util/Emitter');

    var model = require('./model');
    var view = require('./view');

    var controller = {};

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(controller);

    controller.init = function (currentCategory) {

        // 1.设置当前分类
        model.setCategory(currentCategory);

        // 2.获取列表数据
        var tasks = model.getTasks();

        // 3. 告诉view渲染列表
        view.draw(tasks);

        // 4. 触发第一项的change事件
        var id = model.getCurrentTask();
        id && controller.emit('change', id);
    };


    // 点击add按钮的时候
    view.on('add', function () {
        controller.emit('add', model.getCategory());
    });

    // 切换了类型的时候
    view.on('type', function (type) {

        // 1.设置当前类型
        model.setType(type);

        // 2.获取列表数据
        var tasks = model.getTasks();

        // 3. 告诉view渲染列表
        view.draw(tasks);
    });

    // 切换了类型的时候
    view.on('change', function (id) {

        // 1.设置当前选中的元素
        model.setCurrentTask(id);

        controller.emit('change', id);
    });

    // 绑定模型修改事件
    model.on('change', function (fource) {

        // 21.获取列表数据
        var tasks = model.getTasks();

        // 3. 告诉view渲染列表
        view.draw(tasks);

        if (fource) {
            var id = model.getCurrentTask();
            controller.emit('change', id);
        }

    });


    return controller;
});
