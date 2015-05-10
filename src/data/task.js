/**
 * @file task 任务信息的存储
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */


define(function (require) {

    var guid = require('eform-lang/guid');
    var each = require('eform-lang/each');
    var clone = require('eform-lang/clone');
    var expando = require('eform-lang/expando');
    var extend = require('eform-lang/extend');

    var Emitter = require('eform-emitter');

    var categoryDal = require('./category');

    var taskDal = {};

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(taskDal);

    var storage = require('./storage');

    // 由于每一次任务中使用的任务编号都必须不一样，加一个时间戳来保持唯一性
    var prefix = expando('task').slice(0, 17);

    // 所有任务编号的一个列表
    var tasks = storage.getItem('tasks') || [];

    // 编号索引
    var taskMap = null;

    // 分类索引
    var categoryMap = null;

    // 数量索引
    var countMap = null;

    // 生成新的索引
    function build() {

        taskMap = {};
        categoryMap = {};
        countMap = {};

        // 生成分类编号的索引和一二级分类的层级索引
        each(tasks, function (i, item) {

            // 缓存编号
            taskMap[item.id] = i;

            // 缓存分类
            var category = item.category;
            categoryMap[category] = categoryMap[category] || {};
            categoryMap[category][item.id] = true;

            // 缓存数量
            countMap[category] = countMap[category] || 0;
            countMap[category]++;
        });

        storage.setItem('tasks', tasks);
    }

    // 第一次生成索引
    build();

    // 根据任务编号获取任务对象
    taskDal.item = function (id) {
        return tasks[taskMap[id]];
    };


    // 添加一个任务
    taskDal.insert = function (title, date, content, category) {

        // 1. 生成任务对象
        var task = {

            // 任务编号
            id: guid(prefix),

            // 任务标题
            title: title || '',

            // 任务日期
            date: date || '',

            // 任务内容
            content: content || '',

            // 任务是否已经完成
            finished: false,

            // 分类编号，如果真的没有分类，使用默认分类
            category: category || 'category0'
        };

        // 2. 保存任务对象
        tasks.push(task);

        // 3. 重新编译索引
        build();

        // 4. 触发变更事件
        taskDal.emit('add', task = clone(task));

        // 5. 返回分类对象
        return task;
    };

    // 更新一个任务，也可以用于添加一个编号已知的任务
    taskDal.update = function (taskId, task) {

        // 1. 如果id对应的元素不存在，则直接进行插入覆盖
        var id = taskId || task.id;

        var index = taskMap[id];

        // 2. 处理不替换的情况
        if (index == null) {
            tasks.push(task);
        }
        else {
            // 3. 处理替换的情况
            task = extend(tasks[index], task);
        }

        // 4. 重新编译索引
        build();

        // 5. 触发变更事件
        taskDal.emit('update', task = clone(task));

        // 6. 返回任务对象
        return task;
    };

    // 根据编号删除分类
    taskDal.remove = function (taskId) {

        // 1. 查询索引
        var index = taskMap[taskId];

        // 2. 处理不存在的情况
        if (index == null) {
            return null;
        }

        // 3.删除任务
        var task = tasks.splice(index, 1)[0];

        // 4. 重新编译索引
        build();

        // 5. 触发删除事件
        taskDal.emit('remove', task);

        // 6. 返回删除的任务对象
        return task;
    };

    // 查询(哪个分类下的哪种状态的分类)
    taskDal.query = function (categoryId, state, ordered) {

        var list = [];

        each(categoryId ? categoryMap[categoryId] : taskMap, function (id) {

            var task = tasks[taskMap[id]];

            // 处理任务是否完成的状态
            if (state === 'finished' && !task.finished || state === 'unfinished' && task.finished) {
                return;
            }

            list.push(clone(task));
        });

        if (ordered) {
            // 按日期倒序，日期如果相同，按id倒序
            list.sort(function (a, b) {
                var alist = a.date.split('-');
                var blist = b.date.split('-');
                var order = new Date(blist[0], blist[1], blist[2]) - new Date(alist[0], alist[1], alist[2]);
                return order ? order : b.id.localeCompare(a.id);
            })
        }

        return list;
    };

    // 查询某一个分类下的任务数
    taskDal.count = function (category) {
        return category ? countMap[category] || 0 : tasks.length;
    };

    // 添加分类删除触发器
    categoryDal.on('remove', function (categories) {
        each(categories, function (_, category) {
            var list = taskDal.query(category.id, null, false);
            each(list, function (_, task) {
                tasks[taskMap[task.id]].category = task.category = 'category0';
            })
        });

        taskDal.emit('reload');

        build();
    });

    return taskDal;
});
