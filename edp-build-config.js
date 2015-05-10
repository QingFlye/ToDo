exports.input = __dirname;

var path = require('path');
exports.output = path.resolve(__dirname, 'output');

// var moduleEntries = 'html,htm,phtml,tpl,vm,js';
// var pageEntries = 'html,htm,phtml,tpl,vm';

exports.getProcessors = function () {

    // 处理Less样式
    var lessProcessor = new LessCompiler({
        files: ['src/css/index.less']
    });

    // 处理一般CSS文件
    var cssCompressor = new CssCompressor({
        files: ['src/css/index.less']
    });

    // 处理tpl文件
    var html2jsPorcessor = new Html2JsCompiler({
        files: ['*.tpl'],
        extnames: 'tpl',
        combine: true
    });

    var html2jsClearPorcessor = new Html2JsCompiler({
        files: ['*.tpl'],
        extnames: 'tpl',
        clean: true
    });

    // 处理程序脚本（会处理非common的一级目录下的一级文件）
    var moduleProcessor = new ModuleCompiler({
        files: ['src/index.js']
    });

    //压缩JS（仅会处理src/js的当前目录和一级子目录中的js文件，请注意不要把无入口的模块写在这些目录中）
    var jsProcessor = new JsCompressor({
        files: ['src/index.js', 'src/html5.js']
    });

    //进行路径匹配（可以通过修改To参数来进行线上部署）
    var pathMapperProcessor = new PathMapper();

    var outputCleaner = new OutputCleaner({
        files: ['*.less', '*.js', '*.tpl', '!src/css/index.less', '!src/index.js', '!src/html5.js', /^dep\//]
    });

    return {
        'default': [
            lessProcessor, cssCompressor, html2jsPorcessor, moduleProcessor, jsProcessor, html2jsClearPorcessor,
            pathMapperProcessor, outputCleaner
        ],
        'release': [
            lessProcessor, cssCompressor, html2jsPorcessor, moduleProcessor, jsProcessor, html2jsClearPorcessor,
            pathMapperProcessor, outputCleaner
        ]
    };
};

exports.exclude = [
    'package.json',
    '*.iml',
    'README.md',
    'tool',
    '.idea',
    'doc',
    'test',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp'
];

exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[ key ] = processors[ key ];
    }
};

