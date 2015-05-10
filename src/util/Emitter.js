/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */


define(function (require) {

    var extend = require('./extend');

    function Emitter() {
    }

    // 触发事件
    Emitter.prototype.emit = function (type) {
        if (!this._events) {
            this._events = {};
        }

        var handler = this._events[type];

        if (!handler) {
            return false;
        }

        var len = arguments.length;
        var args = new Array(len - 1);
        for (var i = 1; i < len; i++) {
            args[i - 1] = arguments[i];
        }
        var listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) {
            listeners[i].apply(this, args);
        }
        return true;
    };

    Emitter.prototype.on = function (type, listener) {

        if (typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }

        if (!this._events) {
            this._events = {};
        }

        if (!this._events[type]) {
            this._events[type] = [];
        }

        this._events[type].push(listener);

        return this;
    };

    // 绑定一次
    Emitter.prototype.once = function (type, listener) {

        if (typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }

        var self = this;

        function g() {
            self.off(type, g);
            listener.apply(this, arguments);
        }

        g.listener = listener;
        this.on(type, g);
        return this;
    };

    // 移除监听函数
    Emitter.prototype.off = function (type, listener) {

        if (typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }

        if (!this._events || !this._events[type]) {
            return this;
        }
        var list = this._events[type];

        var length = list.length;
        var position = -1;

        for (var i = length; i-- > 0;) {
            if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
                position = i;
                break;
            }
        }

        if (position < 0) {
            return this;
        }

        if (list.length === 0) {
            delete this._events[type];
        }

        return this;
    };

    // 将Emitter混入到其它的对象中
    Emitter.mixin = function (obj) {
        return extend(obj, Emitter.prototype);
    };

    return Emitter;
});