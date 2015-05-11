/**
 * @file category 分类信息存储
 * @file baidu ife task0003--todolist
 * @author 青青flye（QingFlye)
 * @email  2542229389@qq.com
 */

define(function (require) {

    var guid = require('../util/guid');
    var each = require('../util/each');
    var extend = require('../util/extend');
    var clone = require('../util/clone');
    var expando = require('../util/expando');

    var Emitter = require('../util/Emitter');

    var categoryDal = {};

    // 只要将Emitter混入到对象中，对象就可以使用事件了,添加3个函数：on(绑定）,off（解绑）,emit（触发）
    Emitter.mixin(categoryDal);

    var storage = require('./storage');

    // 由于每一次分类中使用的分类编号都必须不一样，加一个时间戳来保持唯一性
    var prefix = expando('category').slice(0, 17);

    // 所有分类编号的一个列表
    var categories = storage.getItem('categories') || [
        {
            // 分类编号
            id: 'category0',

            // 分类的名称
            title: '默认分类',

            // 任务是不是可以修改
            readonly: true,

            // 默认分类的编号最低
            order: 0,

            // 分类的父分类
            parent: null
        }
    ];

    // 编号索引
    var categoryMap = null;

    // 分类级别索引
    var levelMap = null;

    // 生成新的索引
    function build() {

        categoryMap = {};

        levelMap = {};

        // 生成分类编号的索引和一二级分类的层级索引
        each(categories, function (i, item) {

            categoryMap[item.id] = i;

            var parent = item.parent;

            if (parent == null) {
                levelMap[item.id] = levelMap[item.id] || {};
            }
            else {
                levelMap[parent] = levelMap[parent] || {};
                levelMap[parent][item.id] = true;
            }
        });

        storage.setItem('categories', categories);
    }

    // 第一次生成索引
    build();

    // 根据分类编号获取分类对象
    categoryDal.item = function (id) {
        return categories[categoryMap[id]];
    };

    // 添加一个分类
    categoryDal.insert = function (title, parent) {

        // 1. 生成任务对象
        var category = {

            // 分类编号
            id: guid(prefix),

            // 分类的名称
            title: title,

            // 任务是不是可以修改，用户添加的都是可以修改的
            readonly: false,

            // 分类的排序，默认排序值都会设置为0
            order: 0,

            // 分类的父分类
            parent: parent || null
        };

        // 2. 保存任务对象
        categories.push(category);

        // 3. 重新编译索引
        build();

        // 4. 触发变更事件
        categoryDal.emit('add', category = clone(category));

        // 5. 返回分类对象
        return category;
    };

    // 更新一个分类，也可以用于添加一个编号已知的分类
    categoryDal.update = function (categoryId, category) {

        // 1. 如果id对应的元素不存在，则直接进行插入覆盖
        categoryId = categoryId || category.id;

        var index = categoryMap[categoryId];
        var old = categories[index];

        // 2. 处理不替换的情况
        if (index == null) {
            categories.push(category);
        }
        else {
            // 3. 处理替换的情况
            category = categories[index] = extend({}, old, category);
        }

        // 4. 重新编译索引
        build();

        // 5. 触发变更事件
        if (index == null) {
            categoryDal.emit('add', category = clone(category));

        }
        else {
            categoryDal.emit('update', category = clone(category), old);
        }

        // 6. 返回分类对象
        return category;
    };

    // 根据编号删除分类
    categoryDal.remove = function (categoryId) {

        // 1. 查询索引
        var index = categoryMap[categoryId];

        // 2. 处理不存在的情况
        if (index == null) {
            return null;
        }

        // 3. 获取全部要删除的分类的索引
        var indexes = [index];

        each(levelMap[categoryId], function (id) {
            indexes.push(categoryMap[id]);
        });

        // 4. 对indexs进行排序
        indexes.sort(function (a, b) {
            return b - a;
        });

        // 5. 删除所有元素
        var items = [];
        each(indexes, function (_, i) {
            items.push.apply(items, categories.splice(i, 1));
        });

        // 6. 重新编译索引
        build();

        // 7. 触发删除事件
        categoryDal.emit('remove', items);

        // 6. 返回删除的分类对象
        return items;
    };

    // 根据条件查询分类（返回的是一个副本，如果要更新数据，需要调用insert/update/remove/order）
    categoryDal.query = function (parent, ordered, grouped) {

        var list = [];

        // 1. 如果传递了parent，不关注grouped参数
        if (parent) {
            each(levelMap[parent], function (id) {
                list.push(clone(categories[categoryMap[id]]));
            });
        }

        // 2. 如果不分组，则直接返回categories
        else if (!grouped) {
            list = clone(categories, true);
        }

        // 3. 递归生成分组列表
        else {
            each(levelMap, function (id) {
                var item = clone(categories[categoryMap[id]]);
                item.children = categoryDal.query(id, ordered, false);
                list.push(item);
            });
        }

        if (ordered) {
            // 首先使用order属性倒序，order相同时使用id倒序
            list.sort(function (a, b) {
                var order = b.order - a.order;
                var aid = +a.id.slice(11);
                var bid = +b.id.slice(11);
                return order ? order : bid - aid;
            });
        }

        return list;
    };

    return categoryDal;
});
