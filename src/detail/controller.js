/**
 * @file baidu ife task0003--todolist
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

    // currentTaskTd:表示当前要显示的任务编号
    controller.init = function (currentTaskId) {

        // 当前正在编辑任务
        if (model.isedit) {
            view.editConfirm(function () {
                // 1.和model要任务详情
                var task = model.setTask(currentTaskId);
                // 2. 让view画出任务信息
                view.draw(task, false);
            });
        }
        else {
            // 1.和model要任务详情
            var task = model.setTask(currentTaskId);
            // 2. 让view画出任务信息
            view.draw(task, false);
        }
    };

    // 点击添加按钮
    controller.add = function (id) {

        // 当前正在编辑任务
        if (model.isedit) {
            view.editConfirm(function () {
                var task = model.setTask();

                // 让view画一个空的输入对象
                view.draw(task, true);

                model.setCategory(id);
            });
        }
        else {
            model.setCategory(id);

            var task = model.setTask();

            // 让view画一个空的输入对象
            view.draw(task, true);
        }
    };

    // 当view告诉我们内容发生变化的时候：1.告诉model关于task内容发生改变 2.询问model是否告诉外面任务发生改变
    view.on('edit', function () {

        model.setEdit(true);

        var task = model.getTask();

        view.draw(task, true);
    });

    view.on('cancel', function () {

        model.setEdit(false);

        view.draw(task, false);
    });

    // 当点击完成的时候，我们需要对任务设置完成
    view.on('finish', function () {
        // 由于只能从未完成设置为完成，所以状态一定会发生变化
        model.finishTask();
        // 重新绘制页面
        view.draw(model.getTask());
    });

    // 当点击完成的时候，我们需要对任务设置完成
    view.on('delete', function () {
        // 删除之后当前任务一定会变化，等待list刷新
        model.deleteTask();
    });

    view.on('confirm', function (data) {
        model.updateTask(data);
        // 重新绘制页面
        view.draw(model.getTask());
    });

    return controller;
});
