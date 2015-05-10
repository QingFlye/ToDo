/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function () {


    function returnFalse() {
        return false;
    }

    function returnTrue() {
        return true;
    }

    // 可读写的事件类
    function Event(src, prop) {
        if (src && src.type) {
            this.originEvent = src;
            this.type = src.type;

            // 用来修正可能因为祖先元素事件被设置成阻止默认行为状态
            if (src.defaultPrevent
                || src.defaultPrevented === undefined
                && src.returnValue === false) {
                this.isDefaultPrevented = returnTrue;
            }

        }
        else {
            this.type = src;
        }

        for (var x in prop) {
            if (prop.hasOwnProperty(x)) {
                this[x] = prop[x];
            }
        }

        this.timeStemp = src && src.timeStemp || new Date().getTime();
    }

    Event.prototype = {
        constructor: Event,

        isDefaultPrevented: returnFalse,

        isPropagationStopped: returnFalse,

        isImmediatePropagationStopped: returnFalse,

        preventDefault: function () {

            var e = this.originEvent;

            this.isDefaultPrevented = returnTrue;

            if (!e) {
                return;
            }

            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                // 兼容 IE9-
                e.returnValue = false;
            }
        },

        stopPropagation: function () {

            var e = this.originEvent;

            this.isPropagationStopped = returnTrue;

            if (!e) {
                return;
            }

            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                // 兼容IE9-
                e.cancelBubble = true;
            }
        },

        stopImmediatePropagation: function () {

            var e = this.originEvent;

            this.isImmediatePropagationStopped = returnTrue;

            if (e && e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }

            // 降级阻止冒泡
            this.stopPropagation();
        }
    };

    var rkeyEvent = /^key/;
    var rmouseEvent = /^(?:mouse|pointer|contextmenu)|click|wheel/i;
    var rtouchEvent = /^touch/;
    var props = ('altKey bubbles cancelable ctrlKey currentTarget eventPhase '
        + 'metaKey relatedTarget shiftKey target timeStamp view which').split(' ');

    var fixHooks = {};

    var keyHooks = {
        props: 'char charCode key keyCode'.split(' '),
        filter: function (event, original) {

            // 处理事件which的值，统一which，通过which来判断按键
            if (!event.which) {
                event.which = original.keyCode != null ? original.keyCode : original.charCode;
            }

            return event;
        }
    };

    var mouseHooks = {

        props: ('button buttons clientX clientY pageX pageY fromElement offsetX offsetY '
            + 'screenX screenY toElement').split(' '),

        filter: function (event, original) {
            var button = original.button;

            // 计算丢失的pageX/Y（前提：保证clientX/Y可用）,兼容IE
            if (event.pageX == null && event.clientX != null) {
                var ownTarget = event.target.ownerDocument || document;
                var doc = ownTarget.documentElement;
                var body = ownTarget.body;

                event.pageX = original.clientX
                    + (doc && doc.scrollLeft || body && body.scrollLeft || 0)
                    - (doc && doc.clientLeft || body && body.clientLeft || 0);

                event.pageY = original.clientY
                    + (doc && doc.scrollTop || body && body.scrollTop || 0)
                    - (doc && doc.clientTop || body && body.clientTop || 0);
            }

            // 给click事件添加which属性：1 === left(左键)  2 === middle(滚轮)  3 === right(右键)
            // button没有标准化，只是微软自己最初定义的属性，所以不能直接使用
            // 所以IE鼠标点击事件不存在e.which，但是button属性记录了鼠标按键的规则，通过button修正which
            // IE button 1 === left(左键)   4 === middle(滚轮)   2 === right(右键)
            if (!event.which && button !== undefined) {
                switch (button) {
                    case 1:
                        event.which = 1;
                        break;
                    case 2:
                        event.which = 3;
                        break;
                    case 4:
                        event.which = 2;
                        break;
                    default:
                        event.which = 0;
                }
            }

            // 统一鼠标滚轮事件的参数
            // IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
            // firefox DOMMouseScroll detail 下3 上-3
            // firefox wheel detlaY 下3 上-3
            // IE9-11 wheel deltaY 下40 上-40
            // chrome wheel deltaY 下100 上-100
            event.wheelDelta = original.wheelDelta || ((original.deltaY || original.detail) > 0 ? -120 : 120);

            return event;
        }
    };

    var touchHooks = {
        props: mouseHooks.props.concat(('touches changedTouches').split(' '))
    };

    // 修正一个event
    function fix(event) {
        if (event.isMiniEvent) {
            return event;
        }

        var type = event.type;
        var fixHook = fixHooks[type];
        var newEvent = new Event(event);

        // 处理fixHook不存在
        if (!fixHook) {
            if (rkeyEvent.test(type)) {
                fixHook = keyHooks;
            }
            else if (rmouseEvent.test(type)) {
                fixHook = mouseHooks;
            }
            else if (rtouchEvent.test(type)) {
                fixHook = touchHooks;
            }
            else {
                fixHook = {};
            }
            fixHooks[type] = fixHook;

        }

        var copy = fixHook.props ? props.concat(fixHook.props) : props;
        var i = copy.length;

        while (i--) {
            var prop = copy[i];
            newEvent[prop] = event[prop];
        }

        // 兼容：Cordova 2.5(webkit)、IE8-事件没有target
        // 所有的事件都有target，但是Cordova deviceready没有
        // IE9-使用srcElement而不是target
        if (!newEvent.target) {
            newEvent.target = event.srcElement || document;
        }

        // 兼容：Safari 6.0+ Chrome < 28
        // target 不能是文本节点
        if (newEvent.target.nodeType === 3) {
            newEvent.target = event.target.parent;
        }

        return fixHook.filter ? fixHook.filter(newEvent, event) : newEvent;
    }

    var whitespace = '[\\x20\\t\\r\\n\\f]';

    var rattributeQuotes = new RegExp('=' + whitespace + '*([^\\]\'"]*?)' + whitespace + '*\\]', 'g');

    var rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g');

    var docElem = document.documentElement;

    var nativeMatches = docElem.matches
        || docElem.webkitMatchesSelector
        || docElem.mozMatchesSelector
        || docElem.oMatchesSelector
        || docElem.msMatchesSelector;

    // 绑定事件 TODO 这地方兼容到IE8，如果要到IE6这要改
    function bind(elem, type, handler, data, selector) {

        var fn = function (e) {

            e = fix(e);

            var curTarget = e.target;

            if (selector) {

                // 解决部分浏览器引号出错的问题
                selector = selector.replace(rtrim, '$1').replace(rattributeQuotes, '=\'$1\']');

                while (curTarget && curTarget !== elem && !e.isPropagationStopped()) {

                    if (curTarget.nodeType === 1 && nativeMatches.call(curTarget, selector)) {
                        handler.call(curTarget, e);
                    }

                    curTarget = curTarget.parentNode
                }
            }
            else {
                handler.call(elem, e);
            }
        };

        if (elem.addEventListener) {
            elem.addEventListener(type, fn, false);
        }
        else {
            elem.attachEvent('on' + type, fn);
        }

        return fn;
    }

    return bind;

});
