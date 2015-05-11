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

    // 这我们要实现三个功能
    // 1. 根据draw函数提供的参数，画一个页面
    // 2. 在用户点击添加按钮的时候，做出响应
    // 3. 用户点击单个任务的时候做出响应
    // 4. 用户切换tab的时候刷新页面

    // 然后声明view对象
    var view = {};

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(view);

    //首先我们要找到容器
    var container = document.getElementById('list-items');

    view.draw = function (tasks) {
        // 利用etpl的render方法绘制页面html
        // 将HTML塞进页面中
        container.innerHTML = etpl.render('list', tasks);
    };

    bind(container, 'click', function () {

        // 原生的状态列表
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
    bind(document.getElementById('list-type'), 'click', function () {

        // 原生的tab怎么实现
        if (classTool.hasClass(this, 'active')) {
            return;
        }

        for (var node = this.parentNode.firstChild; node; node = node.nextSibling) {

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