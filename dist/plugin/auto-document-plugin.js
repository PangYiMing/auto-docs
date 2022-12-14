"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const doctrine_1 = __importDefault(require("doctrine"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const renderer_1 = __importDefault(require("./renderer"));
function parseComment(commentStr) {
    if (!commentStr) {
        return;
    }
    return doctrine_1.default.parse(commentStr, {
        unwrap: true,
    });
}
function generate(docs, format = 'json') {
    if (format === 'markdown') {
        return {
            ext: '.md',
            content: renderer_1.default.markdown(docs),
        };
    }
    else if (format === 'html') {
        return {
            ext: '.html',
            // content: renderer.html(docs),
        };
    }
    else {
        return {
            ext: '.json',
            // content: renderer.json(docs),
        };
    }
}
function resolveType(tsType) {
    const typeAnnotation = tsType.typeAnnotation;
    if (!typeAnnotation) {
        if (tsType.type) {
            return transformType(tsType.type);
        }
        return;
    }
    return transformType(typeAnnotation.type);
}
function transformType(type) {
    switch (type) {
        case 'TSStringKeyword':
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSBooleanKeyword':
            return 'boolean';
        default:
            return;
    }
}
const autoDocumentPlugin = (0, helper_plugin_utils_1.declare)((api, options, dirname) => {
    api.assertVersion(7);
    return {
        pre(file) {
            file.set('docs', []);
        },
        visitor: {
            FunctionDeclaration(path, state) {
                var _a, _b;
                let comment = (path.node.leadingComments &&
                    parseComment((_a = path.node.leadingComments.at(-1)) === null || _a === void 0 ? void 0 : _a.value)) ||
                    (path.parent &&
                        path.parent.type === 'ExportDefaultDeclaration' &&
                        path.parent.leadingComments &&
                        parseComment((_b = path.parent.leadingComments.at(-1)) === null || _b === void 0 ? void 0 : _b.value));
                const doc = {
                    type: 'function',
                    name: path.get('id').toString(),
                    params: path.get('params').map(paramPath => {
                        return {
                            name: paramPath.toString(),
                            type: resolveType(paramPath.getTypeAnnotation()),
                        };
                    }),
                    return: resolveType(path.get('returnType').getTypeAnnotation()) || 'void',
                    doc: comment,
                };
                if (doc.doc) {
                    const docs = state.file.get('docs');
                    docs.push(doc);
                    state.file.set('docs', docs);
                }
            },
            ClassDeclaration(path, state) {
                var _a;
                const classInfo = {
                    type: 'class',
                    name: path.get('id').toString(),
                    constructorInfo: {},
                    methodsInfo: [],
                    propertiesInfo: [],
                };
                if (path.node.leadingComments) {
                    classInfo.doc = parseComment((_a = path.node.leadingComments.at(-1)) === null || _a === void 0 ? void 0 : _a.value);
                }
                path.traverse({
                    ClassProperty(path) {
                        classInfo.propertiesInfo.push({
                            name: path.get('key').toString(),
                            type: resolveType(path.getTypeAnnotation()),
                            doc: [
                                path.node.leadingComments,
                                path.node.trailingComments,
                            ]
                                .filter(Boolean)
                                .map(comment => {
                                return parseComment(comment.value);
                            })
                                .filter(Boolean),
                        });
                    },
                    ClassMethod(path) {
                        var _a;
                        if (path.node.kind === 'constructor') {
                            classInfo.constructorInfo = {
                                params: path.get('params').map(paramPath => {
                                    return {
                                        name: paramPath.toString(),
                                        type: resolveType(paramPath.getTypeAnnotation()),
                                        doc: path.node.leadingComments &&
                                            parseComment(path.node.leadingComments.at(-1)
                                                .value),
                                    };
                                }),
                            };
                        }
                        else {
                            const methodDoc = {
                                name: path.get('key').toString(),
                                doc: path.node.leadingComments &&
                                    parseComment((_a = path.node.leadingComments.at(-1)) === null || _a === void 0 ? void 0 : _a.value),
                                params: path.get('params').map(paramPath => {
                                    return {
                                        name: paramPath.toString(),
                                        type: resolveType(paramPath.getTypeAnnotation()),
                                    };
                                }),
                                return: resolveType(path
                                    .get('returnType')
                                    .getTypeAnnotation()) || 'void',
                            };
                            if (methodDoc.doc) {
                                classInfo.methodsInfo.push(methodDoc);
                            }
                        }
                    },
                });
                if (classInfo.doc || classInfo.methodsInfo.length) {
                    const docs = state.file.get('docs');
                    docs.push(classInfo);
                    state.file.set('docs', docs);
                }
            },
        },
        post(file) {
            const docs = file.get('docs');
            const res = generate(docs, options.format);
            fs_extra_1.default.ensureDirSync(options.outputDir);
            if (options.singleFile) {
                fs_extra_1.default.appendFileSync(path_1.default.join(options.outputDir, options.singleFileName + res.ext), res.content);
                return;
            }
            if (res.content) {
                fs_extra_1.default.writeFileSync(path_1.default.join(options.outputDir, options.fileName + res.ext), res.content);
            }
        },
    };
});
exports.default = autoDocumentPlugin;
