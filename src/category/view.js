/**
 * Created by qing on 15-5-5.
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var Emitter = require('../util/Emitter');

    var etpl = require('etpl');

    var bind = require('../util/bind');
    var classTool = require('../util/class');

    var tpl = require('./category.tpl');

    // 在使用etpl之前，需要提前编译模板
    etpl.compile(tpl);

    // 首先我们要找到容器
    var container = document.getElementById('category-items');

    // 然后声明view对象
    var view = {
        draw: function (categories) {

            // 利用etpl的render方法绘制页面html
            // 将HTML塞进页面中
            container.innerHTML = etpl.render('category', categories);
        }
    };

    Emitter.mixin(view);

    var categoryDialog = require('../dialog/category');

    // 绑定添加按钮的事件
    bind(document.getElementById('category-add'), 'click', function () {
        categoryDialog.show('', function (value) {
            view.emit('add', value);
        });
    });

    // 点击事件
    function handleClick() {
        if (classTool.hasClass(this, 'active')) {
            return;
        }
        view.emit('change', this.getAttribute('data-id'));
    }

    // 绑定文件夹/文件/所有任务点击事件
    bind(container, 'click', handleClick, 'dt');
    bind(container, 'click', handleClick, 'dd');
    bind(container, 'click', handleClick, 'h3');

    var confirmDialog = require('../dialog/confirm');

    // 绑定删除按钮
    bind(container, 'click', function (e) {
        e.stopPropagation();
        var me = this;
        confirmDialog.show('删除不可恢复，确定要删除吗？', function () {
            view.emit('remove', me.parentNode.getAttribute('data-id'));
        });
    }, '.btn');

    // 绑定DD的drag事件
    bind(container, 'drag', function (e) {
        e.dragTarget = this;
    }, 'dd');

    // 绑定dragenter事件
    bind(container, 'dragenter', function (e) {
        e.preventDefault();
    }, 'dl');

    // 绑定dragover事件
    bind(container, 'dragover', function (e) {
        e.preventDefault();
    }, 'dl');

    function handleDrop(e) {
        e.preventDefault();

        // 拖拽的源对象
        var form = e.dragTarget;

        // 没有拖拽的目标
        if (!form) {
            return;
        }

        // 如果把自己拖到自己的父亲里面，直接返回
        if (form.parentNode === this) {
            return;
        }

        var id = form.getAttribute('data-id');

        // 没有form的id，不处理
        if (!id) {
            return;
        }

        var parent = this.getAttribute('data-id');

        // 触发移动事件
        view.emit('move', id, parent);
    }

    // 绑定drop事件
    bind(container, 'drop', handleDrop, 'dd');
    bind(container, 'drop', handleDrop, 'dt');


    // 用于修复DIV不支持drag的问题
    function handleMouseMouve(e) {
        var target = e.target;

        if ('dragDrop' in target) {
            target.dragDrop();
        }
    }

    // 绑定drop事件
    bind(container, 'mousemove', handleMouseMouve, 'dd');

    return view;
});
