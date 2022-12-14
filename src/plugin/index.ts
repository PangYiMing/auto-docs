import { transformFromAstSync } from '@babel/core';
import { parse } from '@babel/parser';
import autoDocumentPlugin from './auto-document-plugin';
import fs from 'fs';
import path from 'path';

/**
 * 将js或者ts里面的代码转为文档
 * @param tPath 需要处理的文件
 * @param outputDir 输出文件的目录
 */
export default function transformDocs(
    tPath: string,
    outputDir: string,
    options: any
) {
    const { singleFile, singleFileName } = options;
    const sourceCode = fs.readFileSync(tPath, {
        encoding: 'utf-8',
    });

    const ast = parse(sourceCode, {
        sourceType: 'unambiguous',
        plugins: ['typescript', 'jsx'],
    });

    const { code } = transformFromAstSync(ast, sourceCode, {
        filename: tPath.split(path.sep).at(-1),
        plugins: [
            [
                autoDocumentPlugin,
                {
                    outputDir,
                    fileName: tPath.split(path.sep).at(-1).split('.')[0],
                    format: 'markdown', // html / json
                    singleFile: singleFile,
                    singleFileName,
                },
            ],
        ],
    });
}
// test code
// const tPath = path.join(__dirname, '../sourceCode.ts');
// const tPath = path.join(__dirname, './auto-document-plugin.ts');
// const outputDir = path.resolve(__dirname, './docs');
// transformDocs(tPath, outputDir);
