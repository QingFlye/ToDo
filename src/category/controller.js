/**
 * Created by qing on 15-5-5.
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
        init: function () {
            // 初始化model
            model.init();
        }
    };

    Emitter.mixin(controller);

    // 绑定view的add事件来添加一个分类
    view.on('add', function (title) {
        // 去model里面添加分类
        model.addCategory(title);
    });

    // 监视view的改变事件
    view.on('change', function (categoryId) {
        // 去model里面设置分类
        model.setCurrentCategory(categoryId)
    });

    // 监视view的删除事件
    view.on('remove', function (categoryId) {
        model.removeCategory(categoryId)
    });

    // 页面的拖放事件
    view.on('move', function (id, parent) {
        model.moveTaskOrCategory(id, parent);
    });

    // 监视模型的改变事件
    model.on('change', function (id) {
        // 加载所有分类数据
        var categories = model.getCategories();

        // 绘制页面
        view.draw(categories);

        // 如果还更改了选择的分类，触发分类方法
        if (typeof id !== 'undefined') {
            controller.emit('change', id);
        }
    });

    return controller;
});
