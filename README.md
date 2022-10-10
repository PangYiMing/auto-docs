# autoDocs

根据注释自动生成文档

## 例子

cmd:

```
autoDocs
```

会打印树状图到控制台，其中的 js,ts,jsx,tsx 文件，会被用来生成文档：

```
dirTree
  │
  ├─lib
  │  │
  │  └dirTree.js
  │
  ├─README.md
  │
  ├─conf.js
  │
  └─tree.js
```

支持的参数

```
// autoDocs -t 路径 -d 层级 -i 忽略列表
// 默认值 -t ./（当前目录）
// 默认值 -d -1 （无限层级）
// 默认值 -i .git,node_modules
autoDocs -t /Users/xxx/workspace  -d 2 -i .git,node_modules

```

## 安装

```
npm install -g auto-docs
```
