/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var Emitter = require('../util/Emitter');

    var etpl = require('etpl');

    var tpl = require('./detail.tpl');

    // 在使用etpl之前，需要提前编译模板
    etpl.compile(tpl);

    var bind = require('../util/bind');

    // 这我们要实现两个功能
    // 1. 根据draw函数提供的参数，画一个页面
    // 2. 在用户点击按钮的时候，做出响应

    //首先我们要找到容器
    var container = document.getElementById('detail');

    // 然后声明view对象
    var view = {};

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(view);

    // 绘制一个任务
    view.draw = function (task, isedit) {

        // 如果当前不是编辑状态，又没有任务，则清空
        if (!task) {
            container.innerHTML = '';
            return;
        }

        // 利用etpl的render方法绘制页面html
        // 将HTML塞进页面中
        container.innerHTML = etpl.render('task', {
            isedit: isedit,
            title: task.title || '',
            finished: task.finished || false,
            date: task.date || '',
            content: task.content || '',
            list: task.content && task.content.split(/\r?\n/) || []
        });
    };


    // 给container委托编辑事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        view.emit('edit');
    }, null, '[data-role=edit]');

    var confirmDialog = require('../dialog/confirm');

    // 正在编辑中对话框
    view.editConfirm = function (success) {
        confirmDialog.show('当前正在编辑任务，是否放弃？', success);
    };

    // 给container委托完成事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        confirmDialog.show('完成的任务无法再次编辑，是否确认', function () {
            view.emit('finish');
        });
    }, null, '[data-role=finish]');

    // 给container委托删除事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        confirmDialog.show('删除的任务无法恢复，是否确认删除', function () {
            view.emit('delete');
        });
    }, null, '[data-role=delete]');

    // 给container委托确认事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();

        var title = document.getElementById('form-title').value || '';
        var date = document.getElementById('form-date').value || '';
        var content = document.getElementById('form-content').value || '';

        var success = true;

        // 标题
        if (!title || title.length > 20) {
            document.getElementById('form-title-error').innerHTML
                = title ? '任务标题不能超过20字' : '任务标题必需输入';
            success = false;
        }
        else {
            document.getElementById('form-title-error').innerHTML = '';
        }

        // 日期
        if (!date) {
            document.getElementById('form-date-error').innerHTML
                = '任务日期必须输入！';
            success = false;
        }
        else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            document.getElementById('form-date-error').innerHTML
                = '任务日期的格式应当为yyyy-MM-dd！';
            success = false;
        }
        else {
            document.getElementById('form-date-error').innerHTML = '';
        }

        // 内容
        if (!content) {
            document.getElementById('form-content-error').innerHTML
                = '任务内容必须输入！';
            success = false;
        }
        else if (content.length > 1000) {
            document.getElementById('form-content-error').innerHTML
                = '任务内容不能超过1000字！';
            success = false;
        }
        else {
            document.getElementById('form-content-error').innerHTML = '';
        }

        if (!success) {
            return;
        }

        confirmDialog.show('是否保存任务', function () {
            var title = document.getElementById('form-title').value || '';
            var date = document.getElementById('form-date').value || '';
            var content = document.getElementById('form-content').value || '';
            view.emit('confirm', {
                title: title,
                date: date,
                content: content
            });
        });
    }, null, '[data-role=confirm]');

    // 给container委托取消事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        confirmDialog.show('是否放弃当前输入的内容', function () {
            view.emit('cancel');
        });
    }, null, '[data-role=cancel]');

    return view;
});
