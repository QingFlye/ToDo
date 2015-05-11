/**
 * @file baidu ife task0003--todolist
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

    //首先我们要找到容器
    var container = document.getElementById('detail');
    var confirmDialog = require('../dialog/confirm');

    // 然后声明view对象
    var view = {

        // 绘制页面
        draw: function (task, isedit, isnew) {

            // 是把任务设置为空，则清空
            if (!task) {
                container.innerHTML = '';
                return;
            }

            // 利用etpl的render方法绘制页面html
            // 将HTML塞进页面中
            container.innerHTML = etpl.render('task', {
                isnew: isnew,
                isedit: isedit,
                title: task.title || '',
                finished: task.finished || false,
                date: task.date || '',
                content: task.content || '',
                list: task.content && task.content.split(/\r?\n/) || []
            });
        },

        // 正在编辑中对话框
        editConfirm: function (success) {
            confirmDialog.show('当前正在编辑任务，是否放弃？', success);
        }
    };

    Emitter.mixin(view);

    // 给container委托编辑事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        view.emit('edit');
    }, '[data-role=edit]');


    // 给container委托完成事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        confirmDialog.show('完成的任务无法再次编辑，是否确认', function () {
            view.emit('finish');
        });
    }, '[data-role=finish]');

    // 给container委托删除事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        confirmDialog.show('删除的任务无法恢复，是否确认删除', function () {
            view.emit('delete');
        });
    }, '[data-role=delete]');

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
    }, '[data-role=confirm]');

    // 给container委托取消事件
    bind(container, 'click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        confirmDialog.show('是否放弃当前输入的内容', function () {
            view.emit('cancel');
        });
    }, '[data-role=cancel]');

    return view;
});
