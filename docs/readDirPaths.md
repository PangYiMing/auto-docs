## readFileSystem

readFileSystemProps: dirPath 指定 tree 的根目录
callback 遇到文件或者文件夹的回调
maxDeep 最大回调次数，默认-1（无限层级请设为-1） ——可选
deep 当前深度 ——可选

> readFileSystem({
> dirPath,
> callback,
> maxDeep,
> deep = 1,
> parent = {},
> singleFile
> }: undefined):void

#### Parameters:

-   {
    dirPath,
    callback,
    maxDeep,
    deep = 1,
    parent = {},
    singleFile
    }(undefined)
