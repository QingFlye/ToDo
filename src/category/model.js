/**
 * Created by qing on 15-5-5.
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var each = require('eform-lang/each');

    var categoryDal = require('../data/category');
    var taskDal = require('../data/task');

    var model = {};

    var Emitter = require('eform-emitter');

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(model);

    // 获取全部的分类列表
    model.getCategories = function () {

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
    };

    // 添加分类函数
    model.addCategory = function (title) {

        var current = model.current;

        // 当前没有选中任何分类或者选中的是默认分类
        if (!current || current === 'category0') {
            return categoryDal.insert(title, null);
        }

        var category = categoryDal.item(current);

        // 如果当前分类是一级分类，则给当前一级分类添加一个子分类
        if (category.parent == null) {
            return categoryDal.insert(title, category.id);
        }

        // 不然给当前分类的父亲分类添加一个子分类
        return categoryDal.insert(title, category.parent);
    };

    // 删除分类函数
    model.removeCategory = function (id) {

        var removedItems = categoryDal.remove(id);

        var old = model.current;

        // 处理删除当前的情况
        each(removedItems, function (_, item) {
            if (item.id === model.current) {
                model.current = null;
            }
        });

        return old !== model.current;
    };

    // 设置当前激活的分类的id
    model.setCurrentCategory = function (id) {
        var old = model.current;
        model.current = id;
        return old !== model.current;
    };

    // 获取当前激活的分类的ID
    model.getCurrentCategory = function () {
        return model.current || null;
    };

    // 监视任务的增删事件，刷新列表
    taskDal.on('add update remove', function () {
        model.emit('change');
    });

    return model;
});
