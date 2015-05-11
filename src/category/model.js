/**
 * Created by qing on 15-5-5.
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var each = require('../util/each');
    var Emitter = require('../util/Emitter');

    var categoryDal = require('../data/category');
    var taskDal = require('../data/task');

    var model = {

        // 初始化方法
        init: function () {
            model.emit('change', null);
        },

        // 设置当前激活的分类的id
        setCurrentCategory: function (id) {
            // 不同才变更
            if (model.current !== id) {
                model.current = id;
                model.emit('change', id);
            }
        },

        // 获取全部的分类列表
        getCategories: function () {

            var currentFirst = false;
            var currentSecond = false;

            if (model.current) {
                var current = categoryDal.item(model.current);
                if (current.parent) {
                    currentFirst = current.parent;
                    currentSecond = current.id;
                }
                else {
                    currentFirst = current.id;
                }
            }

            var data = {
                count: 0,
                currentFirst: currentFirst,
                currentSecond: currentSecond,
                categories: categoryDal.query(null, true, true)
            };

            each(data.categories, function (_, item) {

                item.count = taskDal.count(item.id);

                // 添加二级分类
                each(item.children, function (_, item2) {
                    item2.count = taskDal.count(item2.id);
                    item.count += item2.count;
                });

                data.count += item.count;
            });

            return data;
        },

        // 添加分类函数
        addCategory: function (title) {

            var current = model.current;

            // 当前没有选中任何分类或者选中的是默认分类
            if (!current || current === 'category0') {
                categoryDal.insert(title, null);
            }
            else {
                var category = categoryDal.item(current);

                // 如果当前分类是一级分类，则给当前一级分类添加一个子分类
                // 不然给当前分类的父亲分类添加一个子分类
                categoryDal.insert(title, category.parent || category.id);
            }

            // 添加肯定不会对外界发生变化
            model.emit('change');
        },

        // 更新分类名称
        renameCategory: function (id, newName) {

            categoryDal.update(id, {
                title: newName
            });

            // 更新分类名称肯定不会对外界发生变化
            model.emit('change');
        },

        // 删除分类函数
        removeCategory: function (id) {

            var removedItems = categoryDal.remove(id);

            var old = model.current;

            // 处理删除当前的情况
            each(removedItems, function (_, item) {
                if (item.id === model.current) {
                    model.current = null;
                }
            });

            // 如果当前分类被删除了，还要通知外边被删除了
            if (old !== model.current) {
                model.emit('change', model.current);
            }
            else {
                model.emit('change');
            }
        },

        // 移动分类
        moveTaskOrCategory: function (id, parent) {

            // 移动的是任务
            if (/^task/i.test(id)) {
                taskDal.update(id, {
                    category: parent
                });
                return;
            }

            var category = categoryDal.item(parent);

            parent = category.parent || category.id;

            // 不能把分类移动到默认中
            if (parent === 'category0') {
                return;
            }

            categoryDal.update(id, {
                parent: parent
            });

            // 分类的变化不会引起当前选中项目的变更，但是可能引起子类数据的变化
            // 由于判断子类是否变化比较复杂，我们认为都发生了变化
            model.emit('change', model.current);
        }
    };

    // 监视任务的增删事件，刷新列表
    taskDal.on('add remove', function () {
        model.emit('change');
    });

    // 监视
    taskDal.on('update', function (task, old) {
        // 如果分类不变，就不刷新
        if (old && task.category === old.category) {
            return;
        }
        model.emit('change');
    });

    Emitter.mixin(model);

    return model;
});
