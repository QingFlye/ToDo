/**
 * @file confirm 分类添加或者修改对话框
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var bind = require('../util/bind');
    var classTool = require('../util/class');

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
    }, '[data-role=close]');

    // 绑定确认按钮
    bind(confirmDialog, 'click', function (e) {
        e.preventDefault();
        confirm.hide();
        successCallback && successCallback();
    }, '[data-role=confirm]');

    return confirm;
});
