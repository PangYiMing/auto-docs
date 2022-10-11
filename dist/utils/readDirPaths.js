"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkSync = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 *
 * @param walkSyncProps
 *  dirPath 指定tree的根目录
 *  callback 遇到文件或者文件夹的回调
 *  maxDeep 最大回调次数，默认-1（无限层级请设为-1）  ——可选
 * @returns
 */
function walkSync({ dirPath, callback, maxDeep, singleFile, }) {
    readFileSystem({
        dirPath,
        callback,
        maxDeep,
        deep: 1,
        singleFile,
    });
}
exports.walkSync = walkSync;
/**
 *
 * @param readFileSystemProps
 *  dirPath 指定tree的根目录
 *  callback 遇到文件或者文件夹的回调
 *  maxDeep 最大回调次数，默认-1（无限层级请设为-1）  ——可选
 *  deep 当前深度  ——可选
 * @returns
 */
function readFileSystem({ dirPath, callback, maxDeep, deep = 1, parent = {}, singleFile, }) {
    if (typeof dirPath !== 'string') {
        return;
    }
    else if (!fs_1.default.existsSync(dirPath)) {
        console.error('readFileSystem fs error, file no exist', {
            dirPath,
            callback,
            maxDeep,
            deep,
            singleFile,
        });
        return;
    }
    if (typeof maxDeep !== 'number') {
        maxDeep = -1;
    }
    else if (maxDeep === 0) {
        console.error('readFileSystem maxDeep error, maxDeep invail', {
            dirPath,
            callback,
            maxDeep,
            deep,
            singleFile,
        });
        return;
    }
    if (typeof deep !== 'number') {
        deep = 1;
    }
    else if (deep <= 0) {
        console.error('readFileSystem deep error, deep invail', {
            dirPath,
            callback,
            maxDeep,
            deep,
            singleFile,
        });
        return;
    }
    if (typeof callback !== 'function') {
        callback = function () { };
    }
    const fileArr = fs_1.default.readdirSync(dirPath);
    fileArr.forEach(function (name, index) {
        var filePath = path_1.default.join(dirPath, name);
        var stat = fs_1.default.statSync(filePath);
        const isEnd = fileArr.length - 1 === index;
        if (stat.isFile()) {
            callback(filePath, stat, {
                deep,
                isEnd,
                parent,
                singleFile,
            });
        }
        else if (stat.isDirectory()) {
            callback(filePath, stat, {
                deep,
                isEnd,
                parent,
                singleFile,
            });
            if (maxDeep < 0 || maxDeep > deep) {
                if (!parent.isEndArr) {
                    parent.isEndArr = [];
                }
                readFileSystem({
                    dirPath: filePath,
                    singleFile,
                    callback,
                    maxDeep,
                    deep: deep + 1,
                    parent: Object.assign(Object.assign({}, parent), { isEnd, isEndArr: [...parent.isEndArr, isEnd] }),
                });
            }
        }
    });
}
