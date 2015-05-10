/**
 * @file category 分类添加或者修改对话框
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var bind = require('eform-dom/bind');
    var parse = require('eform-dom/parse');
    var classTool = require('eform-dom/class');

    var categoryNote = document.getElementById('category-note');
    var categoryDialog = document.getElementById('dialog-category');
    var mask = document.getElementById('mask');
    var categoryTitle = document.getElementById('category-title');

    var successCallback = null;

    var category = {
        // 打开对话框
        show: function (title, success) {
            successCallback = success;
            classTool.removeClass(mask, 'hidden');
            categoryTitle.value = title || '';
            categoryNote.innerHTML = title ? '重命名分类' : '新增分类';
            classTool.removeClass(categoryDialog, 'hidden');
        },
        // 关闭对话框
        hide: function () {
            classTool.addClass(categoryDialog, 'hidden');
            classTool.addClass(mask, 'hidden');
        }
    };

    // 绑定取消按钮
    bind(categoryDialog, 'click', function (e) {
        e.preventDefault();
        category.hide();
    }, null, '[data-role=close]');

    // 绑定确认按钮
    bind(categoryDialog, 'click', function (e) {
        e.preventDefault();
        category.hide();
        successCallback && successCallback(categoryTitle.value);
    }, null, '[data-role=confirm]');

    // 绑定表单的提交事件
    bind(categoryDialog, 'submit', function (e) {
        e.preventDefault();
        category.hide();
        successCallback && successCallback(categoryTitle.value);
    }, null, 'form');

    return category;
});
