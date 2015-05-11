/**
 * Created by qing on 15-5-5.
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */
define(function (require) {

    var Emitter = require('../util/Emitter');

    var etpl = require('etpl');

    var tpl = require('./list.tpl');

    // 在使用etpl之前，需要提前编译模板
    etpl.compile(tpl);

    var bind = require('../util/bind');
    var classTool = require('../util/class');

    //首先我们要找到容器
    var container = document.getElementById('list-items');
    var type = document.getElementById('list-type');

    var view = {
        draw: function (tasks) {
            // 利用etpl的render方法绘制页面html
            // 将HTML塞进页面中
            container.innerHTML = etpl.render('list', tasks);

            // 切换type
            // 这地方由于状态保留，不用重绘
            for (var node = type.firstChild; node; node = node.nextSibling) {

                if (node.nodeName === 'SPAN') {
                    if (node.getAttribute('data-role') === tasks.type) {
                        classTool.addClass(node, 'active');
                    }
                    else {
                        classTool.removeClass(node, 'active');
                    }
                }
            }
        }
    };

    Emitter.mixin(view);

    // 绑定切换功能
    bind(container, 'click', function () {

        if (classTool.hasClass(this, 'active')) {
            return;
        }

        for (var node = this.parentNode.firstChild; node; node = node.nextSibling) {

            if (node.nodeName === 'DD') {
                if (node === this) {
                    classTool.addClass(node, 'active');
                }
                else {
                    classTool.removeClass(node, 'active');
                }
            }
        }

        view.emit('change', this.getAttribute('data-id'));
    }, 'dd');

    // 绑定tab功能
    bind(type, 'click', function () {

        if (classTool.hasClass(this, 'active')) {
            return;
        }

        // 这地方由于状态保留，不用重绘
        for (var node = type.firstChild; node; node = node.nextSibling) {

            if (node.nodeName === 'SPAN') {
                if (node === this) {
                    classTool.addClass(node, 'active');
                }
                else {
                    classTool.removeClass(node, 'active');
                }
            }
        }

        view.emit('type', this.getAttribute('data-role'));
    }, 'span');

    // 绑定添加按钮的事件
    bind(document.getElementById('list-add'), 'click', function () {
        view.emit('add');
    });

    // 绑定DD的drag事件
    bind(container, 'drag', function (e) {
        e.dragTarget = this;
    }, 'dd');

    // 用于修复DIV不支持drag的问题
    if ('dragDrop' in container) {
        bind(container, 'mousemove', function (e) {
            var target = e.target;

            if ('dragDrop' in target) {
                target.dragDrop();
            }
        }, 'dd');
    }

    return view;
});