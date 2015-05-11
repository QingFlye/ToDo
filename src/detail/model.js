/**
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {


    var extend = require('../util/extend');

    var taskDal = require('../data/task');

    var Emitter = require('../util/Emitter');

    var model = {

        // 是否编辑状态
        isedit: false,

        // 为新任务时，任务的分类
        category: null,

        // 当前的任务
        task: null,

        // 使用已经存在的任务初始化
        initWithTask: function (taskid) {
            model.isedit = false;
            model.task = taskDal.item(taskid);
            model.emit('change', model.task, model.isedit, false);
        },

        // 使用分类初始化添加
        initWithCategory: function (categoryId) {
            model.isedit = true;
            model.category = categoryId || 'category0';

            var date = new Date();
            var year = ('0000' + date.getFullYear()).slice(-4);
            var month = ('00' + (date.getMonth() + 1)).slice(-2);
            var day = ('00' + date.getDate()).slice(-2);

            model.task = {
                id: '',
                title: '',
                date: year + '-' + month + '-' + day.slice(-2),
                content: ''
            };

            model.emit('change', model.task, model.isedit, true);
        },

        // 设置编辑状态
        setEdit: function (type) {
            model.isedit = type;
            model.emit('change', model.task, model.isedit, false);
        },

        // 删除任务
        deleteTask: function () {
            // 由于删除肯定会导致列表变化，不需要出发事件
            taskDal.remove(model.task.id);
        },

        // 完成任务
        finishTask: function () {
            // 由于完成任务肯定会导致列表变化，不需要触发事件
            model.task.finished = true;
            taskDal.update(model.task.id, model.task);
        },

        // 保存任务
        saveTask: function (data) {

            model.isedit = false;

            var old = model.task;

            var task = extend({}, model.task, data);

            if (task.id) {
                model.task = taskDal.update(task.id, task);
                // 如果只是改变了内容，则列表不会被刷新，这时候我们要刷新我们的任务
                if (task.date === old.date && task.title === old.title) {
                    model.emit('change', model.task, model.isedit, false);
                }
            }
            else {
                // 插入一定会造成列表刷新
                model.task = taskDal.insert(task.title, task.date, task.content, model.category);
                model.emit('change', model.task, model.isedit, false);
            }
        }
    };

    Emitter.mixin(model);

    return model;

});
