"use strict";
/*
 * @Author: pym
 * @Date: 2022-10-10 14:59:42
 * @LastEditors: pym
 * @Description: TODO xxx
 * @LastEditTime: 2022-10-10 17:49:30
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const parser_1 = require("@babel/parser");
const auto_document_plugin_1 = __importDefault(require("./auto-document-plugin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * 将js或者ts里面的代码转为文档
 * @param tPath 需要处理的文件
 * @param outputDir 输出文件的目录
 */
function transformDocs(tPath, outputDir, options) {
    const { singleFile, singleFileName } = options;
    const sourceCode = fs_1.default.readFileSync(tPath, {
        encoding: 'utf-8',
    });
    const ast = (0, parser_1.parse)(sourceCode, {
        sourceType: 'unambiguous',
        plugins: ['typescript'],
    });
    const { code } = (0, core_1.transformFromAstSync)(ast, sourceCode, {
        plugins: [
            [
                auto_document_plugin_1.default,
                {
                    outputDir,
                    fileName: tPath.split(path_1.default.sep).at(-1).split('.')[0],
                    format: 'markdown',
                    singleFile: singleFile,
                    singleFileName,
                },
            ],
        ],
    });
}
exports.default = transformDocs;
// test code
// const tPath = path.join(__dirname, '../sourceCode.ts');
// const tPath = path.join(__dirname, './auto-document-plugin.ts');
// const outputDir = path.resolve(__dirname, './docs');
// transformDocs(tPath, outputDir);
