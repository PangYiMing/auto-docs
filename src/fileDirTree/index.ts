import path from 'path';
import { walkSync } from '../utils/readDirPaths';
import transformDocs from '../plugin/index';
import { execAbortArr, strNotIncludeStringInArr } from '../utils/utils';

import { Command } from 'commander';
import fs from 'fs';

// TODO 支持合并成一个文件
// TODO 支持本地文件路径在md里展示
// 支持单文件,单文件可以指定文件名字

// TODO 支持子参数，单层的
const program = new Command();
program
    .option('-t, --target <type>', 'Specify target path')
    .option(
        '-s, --single <fileName>',
        'Whether to use single file mode,can specify fileName'
    )
    .option('-d, --deep <type>', 'option:specify max deep, etc.: 2 ')
    .option(
        '-i, --ignore <type>',
        'Option: specify ignore dirs, etc.: .git,node_modules. default .git,node_modules'
    );

program.parse();

const options = program.opts();
// const { target, deep, ignore } = options;
if (!options.target) {
    options.target = process.cwd();
}
if (!options.deep) {
    options.deep = '-1';
}
// TODO 支持空字符串
if (!options.ignore) {
    options.ignore = '.git,node_modules';
}
options.fileName = 'docs';

if (options.single !== true) {
    if (typeof options.single === 'string') {
        options.fileName = options.single || 'docs';
        options.single = true;
    } else {
        options.single = false;
    }
}
// const options = {
//     target: 'D:\\work\\tripdocs-js-sdk',
//     deep: '-1',
//     ignore: '.git,node_modules',
//     single: false,
//     fileName : 'docs'
// };
console.log(options);

// TODO 如果指定层级在当前行无下一个子元素应该为空格缩进，如果当前行是最后一个子元素应该是回车符号+空格缩进，如果其他，应该是竖线+空格缩进
// const dirPath = path.resolve(__dirname, '../../');

let abortArr: string[] = execAbortArr(
    options.ignore
        ? options.ignore.split(',')
        : ['.git', 'node_modules', 'docs']
);

let isFirst = true;
const target = options.target ? path.resolve(options.target) : process.cwd();
const outFilePath = path.resolve(target, 'docs');

// 清空文件夹
walkSync({
    dirPath: outFilePath,
    callback: filePath => {
        fs.unlinkSync(filePath);
    },
});

function callback(
    filePath: string,
    stat: any,
    treeOpt: { deep: number; isEnd: boolean; parent: any; singleFile: boolean }
) {
    const { deep, isEnd, parent, singleFile } = treeOpt;
    if (isFirst) {
        console.log(options.target.split(path.sep).pop());
    }
    if (filePath && strNotIncludeStringInArr(filePath, abortArr)) {
        let printStr = '  ';
        if (!parent.isEndArr) {
            parent.isEndArr = [];
        }
        for (let i = 0; i < parent.isEndArr.length; i++) {
            const isEndEL = parent.isEndArr[i];
            printStr = printStr + (isEndEL ? '     ' : '│    ');
        }

        printStr = printStr + (isEnd ? '└─' : '├─');
        console.log(printStr + filePath.split(path.sep).pop());
        // TODO 对.d.ts文件进行排除
        if (
            stat.isFile() &&
            ['js', 'ts', 'jsx', 'tsx'].includes(getEndWith(filePath))
        ) {
            // 避免处理名字中有两个点的文件
            // 避免处理名字中点在最前面的文件
            const fName = filePath.split(path.sep).pop();
            const index = fName.indexOf('.');
            const condition = index > 0 && fName.indexOf('.', index + 1) === -1;
            if (condition) {
                transformDocs(filePath, outFilePath, {
                    singleFile,
                    singleFileName: options.fileName,
                });
            }
        }
    }
    isFirst = false;
}

function getEndWith(str: string): string {
    const endWith = str.indexOf('.') ? str.split('.').at(-1) : '';
    return endWith;
}
walkSync({
    dirPath: target,
    callback,
    maxDeep: options.deep ? parseInt(options.deep, 10) : -1,
    singleFile: options.single,
});
