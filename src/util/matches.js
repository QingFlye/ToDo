/**
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function () {

    var whitespace = '[\\x20\\t\\r\\n\\f]';

    var identifier = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+';

    // 用于匹配CSS属性转义字符
    var runescape = new RegExp('\\\\([\\da-f]{1,6}' + whitespace + '?|(' + whitespace + ')|.)', 'ig');

    // 用于处理CSS属性转义字符的替换函数
    var funescape = function (_, escaped, escapedWhitespace) {
        var high = '0x' + escaped - 0x10000;

        // NaN表示不转义
        if (isNaN(high) || escapedWhitespace) {
            return escaped;
        }

        if (high < 0) {
            return String.fromCharCode(high + 0x10000);
        }

        return String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
    };

    // 解码CSS属性转义字符
    function unescape(str) {
        return str.replace(runescape, funescape);
    }

    // 用于安全的去除选择器的空格
    var rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g');

    // 基本选择器
    var expr = {

        // ID选择器
        'ID': new RegExp('^#(' + identifier + ')'),

        // 类选择器
        'CLASS': new RegExp('^\\.(' + identifier + ')'),

        // 标签选择器
        'TAG': new RegExp('^(' + identifier + '|[*])'),

        // 属性选择器
        'ATTR': new RegExp('^\\['
            // 匹配属性名
            + whitespace + '*(' + identifier + ')(?:'
            // 匹配属性符号
            + whitespace + '*([*^$|!~]?=)'
            // 匹配属性值
            + whitespace + '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)\"|(' + identifier + '))|)'
            // 吸收多余的空白
            + whitespace + '*\\]')
    };

    /**
     * 对选择器进行词法分析
     * @param {string} selector 选择器字符串
     * @return {Array|null} 如果为空表示解析失败
     */
    function tokenize(selector) {

        var tokens = [];
        var matched;
        var match;

        while (selector) {

            // 处理基本选择器
            for (var type in expr) {

                if (expr.hasOwnProperty(type) && (match = expr[type].exec(selector))) {

                    matched = match.shift();

                    if (type === 'ATTR') {

                        match[0] = unescape(match[0]);
                        match[2] = unescape(match[2] || match[3] || match[4] || '');
                        match = match.slice(0, 3);
                        if (!match) {
                            throw new Error(matched + '解析失败');
                        }
                    }

                    tokens.push({
                        matched: matched,
                        value: match,
                        type: type
                    });

                    selector = selector.slice(matched.length);
                }
            }

            if (!matched) {
                break;
            }
        }

        if (selector) {
            throw new Error(selector + '解析失败');
        }

        return  tokens;
    }

    // 用于生成过滤器的函数
    var filter = {

        // 属性选择器
        'ATTR': function (name, operator, check) {

            if (operator === '~=') {
                var rcontains = new RegExp(whitespace + check + whitespace);
            }

            return function (elem) {

                // TODO IE67下对非data-atte会有BUG
                var result = elem.getAttribute(name);

                if (result == null) {
                    return operator === '!=';
                }

                if (!operator) {
                    return true;
                }

                result += '';

                switch (operator) {
                    case  '=':
                        return result === check;
                    case '!=':
                        return result !== check;
                    case '^=':
                        return check && result.indexOf(check) === 0;
                    case '*=':
                        return check && result.indexOf(check) > -1;
                    case '$=':
                        return check && result.slice(-check.length) === check;
                    case '~=':
                        return rcontains.test(' ' + result + ' ');
                    case '|=':
                        return result === check || result.slice(0, check.length + 1) === check + '-';
                    default :
                        return false;
                }
            };
        },

        // 类选择器
        'CLASS': function (className) {

            var pattern = new RegExp('(^|' + whitespace + ')' + className + '(' + whitespace + '|$)');

            return  function (elem) {
                return pattern.test(typeof elem.className === 'string' && elem.className || '');
            };
        },

        // ID选择器
        'ID': function (id) {

            // TODO 这办法在IE67下会出问题
            var attrId = unescape(id);

            return function (elem) {
                return elem.getAttribute('id') === attrId;
            };
        },

        // 标签选择器
        'TAG': function (nodeNameSelector) {

            var nodeName = unescape(nodeNameSelector).toLowerCase();

            return nodeNameSelector === '*' ? function () {
                return true;
            } : function (elem) {
                return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
            };
        }
    };

    // 将当前一个匹配数组打包成一个匹配函数
    function elementMatcher(matchers) {

        if (matchers.length > 1) {

            return function (elem, context) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context)) {
                        return false;
                    }
                }
                return true;
            };
        }

        return matchers[0];
    }

    // 使用一组token生成一个匹配函数
    function tokenMatcher(tokens) {

        var matchers = [];

        for (var i = 0, len = tokens.length; i < len; i++) {
            var token = tokens[i];
            matchers.push(filter[token.type].apply(null, token.value));
        }

        return elementMatcher(matchers);
    }

    // 编译生成一个匹配函数
    function compile(selector) {
        return tokenMatcher(tokenize(selector));
    }

    // 用于缓存编译函数
    var cache = {};

    // 匹配函数
    function matches(elem, selector) {

        // 对于非元素节点对象直接处理
        if (!elem || !elem.nodeType || elem.nodeType !== 1 || !selector) {
            return false;
        }

        // 去除多余的空白字符
        selector = selector.replace(rtrim, '$1');

        var macther = cache[selector] || (cache[selector] = compile(selector));

        return macther(elem);
    }

    return matches;
});