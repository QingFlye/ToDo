/**
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var Emitter = require('../util/Emitter');

    var model = require('./model');
    var view = require('./view');

    var controller = {

        // 初始化函数
        init: function (currentTaskId) {

            if (model.isedit) {
                view.editConfirm(function () {
                    model.isedit = false;
                    model.initWithTask(currentTaskId);
                });
            }
            else {
                model.initWithTask(currentTaskId);
            }
        },

        // 添加函数
        add: function (categoryId) {

            if (model.isedit) {
                view.editConfirm(function () {
                    model.isedit = false;
                    model.initWithCategory(categoryId);
                });
            }
            else {
                model.initWithCategory(categoryId);
            }
        }
    };

    Emitter.mixin(controller);

    // 设置当前状态为编辑状态
    view.on('edit', function () {
        model.setEdit(true);
    });

    // 设置当前状态为非编辑状态
    view.on('cancel', function () {
        model.setEdit(false);
    });

    // 当点击完成的时候，我们需要对任务设置完成
    view.on('finish', function () {
        model.finishTask();
    });

    // 点击删除
    view.on('delete', function () {
        model.deleteTask();
    });

    // 点击保存
    view.on('confirm', function (data) {
        model.saveTask(data);
    });

    // 当模型发生变化的时候，重绘页面
    model.on('change', function (task, isedit, isnew) {
        view.draw(task, isedit, isnew);
    });

    return controller;
});
