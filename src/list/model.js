/**
 * Created by qing on 15-5-5.
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var each = require('../util/each');
    var indexOf = require('../util/indexOf');
    var taskTool = require('../data/task');

    var model = {};

    var Emitter = require('../util/Emitter');

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(model);

    // 设置筛选类型
    model.setType = function (type) {
        model.type = type;
    };


    // 设置分类
    model.setCategory = function (categoryId) {
        model.category = categoryId;
    };

    // 返回分类
    model.getCategory = function () {
        return   model.category || 'category0';
    };

    // 添加当前选中的任务号
    model.setCurrentTask = function (id) {
        model.currentTask = id;
    };

    model.getCurrentTask = function () {
        return model.currentTask;
    };

    model.getTasks = function () {

        // 查询所有数据
        var list = taskTool.query(model.category, model.type, true);

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

        return {
            current: model.currentTask,
            list: list
        };
    };

    taskTool.on('add', function (task) {
        model.current = task.id;
        // 避免添加的任务显示不出来
        model.type = 'all';
        model.emit('change');
    });

    taskTool.on('remove', function () {
        model.emit('change', true);
    });


    taskTool.on('update reload', function () {
        model.emit('change');
    });

    return model;
});
