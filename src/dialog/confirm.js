/**
 * @file confirm 分类添加或者修改对话框
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var bind = require('eform-dom/bind');
    var parse = require('eform-dom/parse');
    var classTool = require('eform-dom/class');

    var confirmNote = document.getElementById('confirm-title');
    var confirmDialog = document.getElementById('confirm');
    var mask = document.getElementById('mask');

    var successCallback = null;

    var confirm = {
        // 打开对话框
        show: function (title, success) {
            successCallback = success;
            classTool.removeClass(mask, 'hidden');
            confirmNote.innerHTML = title || '请确认';
            classTool.removeClass(confirmDialog, 'hidden');
        },
        // 关闭对话框
        hide: function () {
            classTool.addClass(confirmDialog, 'hidden');
            classTool.addClass(mask, 'hidden');
        }
    };

    // 绑定取消按钮
    bind(confirmDialog, 'click', function (e) {
        e.preventDefault();
        confirm.hide();
    }, null, '[data-role=close]');

    // 绑定确认按钮
    bind(confirmDialog, 'click', function (e) {
        e.preventDefault();
        confirm.hide();
        successCallback && successCallback();
    }, null, '[data-role=confirm]');

    return confirm;
});
