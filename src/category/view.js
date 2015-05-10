/**
 * Created by qing on 15-5-5.
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var Emitter = require('eform-emitter');

    var etpl = require('etpl');

    var bind = require('eform-dom/bind');
    var parse = require('eform-dom/parse');
    var classTool = require('eform-dom/class');

    var tpl = require('./category.tpl');

    // 在使用etpl之前，需要提前编译模板
    etpl.compile(tpl);

    // 然后声明view对象
    var view = {};

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(view);

    //首先我们要找到容器
    var container = document.getElementById('category-items');

    view.draw = function (categories) {
        // 利用etpl的render方法绘制页面html
        // 将HTML塞进页面中
        container.innerHTML = etpl.render('category', categories);
    };

    var categoryDialog = require('../dialog/category');

    // 绑定添加按钮的事件
    bind(document.getElementById('category-add'), 'click', function () {
        categoryDialog.show('', function (value) {
            view.emit('add', value);
        });
    });

    // 绑定文件夹点击事件
    bind(container, 'click', function () {

        if (classTool.hasClass(this, 'active')) {
            return;
        }

        view.emit('change', this.getAttribute('data-id'));
    }, null, 'dt');

    // 绑定文件点击事件（不重绘以加快效率）
    bind(container, 'click', function () {

        if (classTool.hasClass(this, 'active')) {
            return;
        }

        view.emit('change', this.getAttribute('data-id'));

    }, null, 'dd');

    // 绑定所有任务点击事件（不重绘以加快效率）
    bind(container, 'click', function () {
        if (classTool.hasClass(this, 'active')) {
            return;
        }

        view.emit('change', this.getAttribute('data-id'));
    }, null, 'h3');


    var confirmDialog = require('../dialog/confirm');

    // 绑定删除按钮
    bind(container, 'click', function (e) {
        e.stopPropagation();

        var me = this;

        confirmDialog.show('删除不可恢复，确定要删除吗？', function () {
            view.emit('remove', me.parentNode.getAttribute('data-id'));
        });

    }, null, '.btn');

    return view;
});
