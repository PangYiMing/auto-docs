"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(docs) {
    let str = '';
    docs.forEach(doc => {
        var _a, _b;
        if (!doc) {
            return;
        }
        if (doc.type === 'function') {
            str = transformFunc(str, doc);
        }
        else if (doc.type === 'class') {
            str += '##' + doc.name + '\n';
            str += ((_a = doc.doc) === null || _a === void 0 ? void 0 : _a.description) + '\n';
            if (Array.isArray((_b = doc.doc) === null || _b === void 0 ? void 0 : _b.tags)) {
                doc.doc.tags.forEach(tag => {
                    str +=
                        tag.name +
                            ': ' +
                            (tag.description
                                ? tag.description.replace(':', '')
                                : '') +
                            '\n';
                });
            }
            str += '> new ' + doc.name + '(';
            if (doc.params) {
                str += doc.params
                    .map(param => {
                    return param.name + ': ' + param.type;
                })
                    .join(', ');
            }
            str += ')\n';
            str += '#### Properties:\n';
            if (doc.propertiesInfo) {
                doc.propertiesInfo.forEach(param => {
                    str += '- ' + param.name + ':' + param.type + '\n';
                });
            }
            str += '#### Methods:\n';
            if (doc.methodsInfo) {
                doc.methodsInfo.forEach(param => {
                    str = transformFunc(str, param, 5);
                });
            }
            str += '\n';
        }
        str += '\n';
    });
    return str;
}
exports.default = default_1;
function stringRepeate(params, len) {
    if (len <= 0) {
        return '';
    }
    let str = '';
    for (let i = 0; i < len; i++) {
        str += params;
    }
    return str;
}
function transformFunc(str, doc, titileDeep = 2) {
    var _a, _b;
    str += stringRepeate('#', titileDeep) + ' ' + doc.name + '\n';
    str += (((_a = doc.doc) === null || _a === void 0 ? void 0 : _a.description) || '') + '\n';
    if (Array.isArray((_b = doc.doc) === null || _b === void 0 ? void 0 : _b.tags)) {
        doc.doc.tags.forEach(tag => {
            str +=
                (tag.name || tag.title) +
                    ': ' +
                    (tag.description ? tag.description.replace(':', '') : '') +
                    '\n';
        });
    }
    str += '>' + doc.name + '(';
    if (doc.params) {
        str += doc.params
            .map(param => {
            return param.name + ': ' + param.type;
        })
            .join(', ');
    }
    str += ')' + ':' + doc.return + '\n';
    str +=
        stringRepeate('#', titileDeep + 1 < 4 ? 4 : titileDeep + 1) +
            ' Parameters:\n';
    if (doc.params && doc.params.length) {
        str += doc.params
            .map(param => {
            return '- ' + param.name + '(' + param.type + ')';
        })
            .join('\n');
    }
    else {
        str += 'null\n';
    }
    str += '\n';
    return str;
}
