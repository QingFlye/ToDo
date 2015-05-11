/**
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function () {

    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    // 去掉字符串前后的空格和BOM
    function trim(str) {
        return str == null ? '' : (str + '').replace(rtrim, '');
    }

    return trim;
});
