/**
 * @title baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */


define(function () {

    var date = +new Date();

    var random = (Math.random() + '').slice(2);

    // 生成随机Key
    function expando(name) {
        return name + date + random;
    }

    return expando;
});
