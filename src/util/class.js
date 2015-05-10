/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */


define(function (require) {

    var trim = require('./trim');

    var rclass = /[\t\r\n\f]/g;

    var rnotwhite = /\S+/g;

    // 添加样式
    function addClass(elem, classname) {

        var classes = classname && classname.match(rnotwhite);

        if (classes) {

            // replace防止elem的className是多个并且有换行之类的，两边加空为了方便删除不会留下两个空格。
            var cur = elem
                && elem.nodeType === 1
                && (elem.className ? (' ' + elem.className + ' ').replace(rclass, ' ') : ' ');

            if (cur) {

                // 防止增加的classname为多个出现重复的。
                for (var i = 0, l = classes.length; i < l; i++) {
                    var clazz = classes[i];
                    if (cur.indexOf(' ' + clazz + ' ') < 0) {
                        cur += clazz + ' ';
                    }
                }

                // 如果相同则不进行改变，以减少页面重绘
                var finalValue = trim(cur);
                if (elem.className !== finalValue) {
                    elem.className = finalValue;
                }
            }
        }
    }

    // 删除样式
    function removeClass(elem, classname) {

        var classes = classname && classname.match(rnotwhite);

        if (classes) {

            // replace防止elem的className是多个并且有换行之类的，两边加空为了方便删除不会留下两个空格。
            var cur = elem
                && elem.nodeType === 1
                && (elem.className ? (' ' + elem.className + ' ').replace(rclass, ' ') : ' ');

            if (cur) {

                // 防止删除的classname为多个出现重复的。
                for (var i = 0, l = classes.length; i < l; i++) {
                    var clazz = classes[i];
                    if (cur.indexOf(' ' + clazz + ' ') >= 0) {
                        cur = cur.replace(' ' + clazz + ' ', ' ');
                    }
                }

                // 如果没有传classname 则删除该元素全部样式。
                var finalValue = classname ? trim(cur) : '';
                if (elem.className !== finalValue) {
                    elem.className = finalValue;
                }
            }
        }
    }

    // 判断是存在样式
    function hasClass(elem, classname) {
        return !!(elem.nodeType === 1
            && (' ' + elem.className + ' ').replace(rclass, ' ').indexOf(' ' + classname + ' ') >= 0);
    }

    return {
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass
    };
});
