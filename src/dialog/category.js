/**
 * @file category 分类添加或者修改对话框
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var bind = require('../util/bind');
    var classTool = require('../util/class');

    var categoryNote = document.getElementById('category-note');
    var categoryDialog = document.getElementById('dialog-category');
    var mask = document.getElementById('mask');
    var categoryTitle = document.getElementById('category-title');
    var categoryError = document.getElementById('category-error');

    var successCallback = null;

    var category = {
        // 打开对话框
        show: function (title, success) {
            successCallback = success;
            classTool.removeClass(mask, 'hidden');
            categoryTitle.value = title || '';
            categoryNote.innerHTML = title ? '重命名分类' : '新增分类';
            categoryError.innerHTML = '';
            classTool.removeClass(categoryDialog, 'hidden');

            try {
                // 尝试聚焦输入元素
                categoryTitle.focus();
            }
            catch (e) {
            }
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
        var value = categoryTitle.value;

        // 必填验证
        if (!value) {
            categoryError.innerHTML = '分类标题必须填写';
            return;
        }

        // 最大长度验证
        if (value.length > 10) {
            categoryError.innerHTML = '分类标题不能超过10个字符';
            return;
        }

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
