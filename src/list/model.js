/**
 * Created by qing on 15-5-5.
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var each = require('../util/each');
    var taskTool = require('../data/task');

    var Emitter = require('../util/Emitter');

    var model = {

        // 当前筛选类型
        type: 'all',

        // 当前列表分类
        category: null,

        // 设置筛选类型
        setType: function (type) {
            model.type = type;
            model.emit('change');
        },

        // 设置分类
        setCategory: function (categoryId) {
            model.category = categoryId;
            model.emit('change');
        },

        // 返回分类
        getCategory: function () {
            return model.category || 'category0';
        },

        // 添加当前选中的任务号
        setCurrentTask: function (id) {

            if (model.currentTask !== id) {
                model.currentTask = id;
                model.emit('current', id);
            }
        },

        // 获取当前分类
        getCurrentTask: function () {
            return model.currentTask;
        },

        getTasks: function () {

            var old = model.currentTask;

            // 查询所有数据
            var list = taskTool.query(model.category, model.type, true, true);

            if (list.length) {
                // 设置当前选中的任务
                if (!model.currentTask) {
                    model.currentTask = list[0].id;
                }
                else {
                    var flag = false;
                    each(list, function () {
                        if (this.id === model.currentTask) {
                            flag = true;
                            return false;
                        }
                    });

                    // 当前任务已经失效
                    if (!flag) {
                        model.currentTask = list[0].id;
                    }
                }
            }
            else {
                model.currentTask = null;
            }

            if (old !== model.currentTask) {
                model.emit('current', model.currentTask);
            }

            return {
                type: model.type,
                current: model.currentTask,
                list: list
            };
        }
    };

    Emitter.mixin(model);

    taskTool.on('add', function (task) {
        model.currentTask = task.id;

        if (model.type === 'finished') {
            model.type = 'all';
        }

        model.emit('change');
    });

    taskTool.on('remove', function () {
        model.emit('change');
    });

    taskTool.on('update', function (task, old) {
        if (!old
            || task.date !== old.date
            || task.title !== old.title
            || task.category !== old.category
            || task.finished !== old.finished) {
            model.emit('change');
        }
    });

    return model;
});
