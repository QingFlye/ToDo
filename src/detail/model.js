/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var model = {};

    var extend = require('../util/extend');

    var taskTool = require('../data/task');

    var Emitter = require('../util/Emitter');

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(model);

    // 设置当前的任务
    model.setTask = function setTask(currentTaskId) {

        if (!currentTaskId) {
            model.isedit = true;
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            return model.task = {
                id: '',
                title: '',
                date: ('0000' + year).slice(-4) + '-' + ('00' + month).slice(-2) + '-' + ('00' + day).slice(-2),
                content: ''
            };
        }
        model.isedit = false;
        return model.task = taskTool.item(currentTaskId);
    };

    // 设置是否正在编辑
    model.setEdit = function (type) {
        model.isedit = type;
    };

    // 删除任务
    model.deleteTask = function () {
        taskTool.remove(model.task.id);
    };

    // 完成任务
    model.finishTask = function () {
        model.task.finished = true;
        taskTool.update(model.task.id, model.task);
    };

    model.setCategory = function (id) {
        model.category = id;
    };


    model.updateTask = function (data) {

        var task = extend(model.task, data);

        if (task.id) {
            model.task = taskTool.update(task.id, task);
        }
        else {
            model.task = taskTool.insert(task.title, task.date, task.content, model.category);
        }

        model.isedit = false;
    };

    model.getTask = function () {
        return  model.task;
    };

    return model;

});
