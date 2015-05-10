/**
 * Created by qing on 15-5-5.
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var Emitter = require('eform-emitter');

    var model = require('./model');
    var view = require('./view');

    var controller = {};

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(controller);

    // 初始化函数
    controller.init = function () {

        // 加载所有分类数据
        var categories = model.getCategories();

        // 绘制页面
        view.draw(categories);

        // 告诉外界数据已经改变
        controller.emit('change', model.getCurrentCategory());
    };

    // 绑定view的add事件来添加一个分类
    view.on('add', function (title) {
        // 1. 去model里面添加分类
        model.addCategory(title);

        // 加载所有分类数据
        var categories = model.getCategories();

        // 绘制页面
        view.draw(categories);
    });

    // 监视view的改变事件
    view.on('change', function (categoryId) {
        if (model.setCurrentCategory(categoryId)) {
            controller.emit('change', model.getCurrentCategory());
        }

        // 加载所有分类数据
        var categories = model.getCategories();

        // 绘制页面
        view.draw(categories);
    });

    // 监视view的删除事件
    view.on('remove', function (categoryId) {

        if (model.removeCategory(categoryId)) {
            controller.emit('change', model.getCurrentCategory());
        }

        // 加载所有分类数据
        var categories = model.getCategories();

        // 绘制页面
        view.draw(categories);
    });

    // 监视模型的改变事件
    model.on('change', function () {
        // 加载所有分类数据
        var categories = model.getCategories();

        // 绘制页面
        view.draw(categories);
    });

    return controller;
});
