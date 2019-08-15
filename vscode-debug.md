# 1. 单独的 JS 文件

```
{
  "version": "0.2.0",
  "configurations": [
    // 调试指定的js文件
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}\\a.js"
    },
    // 调试任意打开的js文件
    {
      "type": "node",
      "request": "launch",
      "name": "debug active file",
      "program": "${file}"
    }
  ]
}
```

# 2. Node服务

**launch.json**

```
// 直接运行入口文件进行调试
{
  "type": "node",
  "request": "launch",
  "name": "launch server",
  "program": "${workspaceFolder}/index.js"
},
// 使用nodemon运行入口文件进行调试，支持实时修改编译
{
  "type": "node",
  "request": "launch",
  "name": "launch nodemon",
  "runtimeExecutable": "nodemon",
  "program": "${workspaceFolder}/index.js",
  "restart": true,
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
},
// 使用npm运行script
{
  "type": "node",
  "request": "launch",
  "name": "launch via NPM",
  "runtimeExecutable": "npm",
  "runtimeArgs": [
    "run-script",
    "debug"
  ],
  "port": 5858
}
```

**package.json**

```
"scripts:{
  ...
  "debug": "cross-env NODE_ENV=development nodemon --inspect-brk=5858 index.js",
}
```

# 3. 前后端在同一工程中

**launch.json**

```
{
  "version": "0.2.0",
  "configurations": [  
    {
      "type": "chrome",
      "request": "attach",
      "name": "attach chrome",
      "port": 9222,
      "url": "http://localhost:4000",
      "webRoot": "${workspaceFolder}/public"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "launch chrome",
      "url": "http://localhost:4000",
      "webRoot": "${workspaceFolder}/public"
    }
  ]
}
```

1. 先运行node服务
2. attach：需要先打开网页到 http://localhost:4000，再启动调试
3. launch：需要先关闭所有的chrome进程，再启动调试

# 4. create-react-app调试

**launch.json**

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Chrome",
      "port": 9222,
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

1. 先运行node服务
2. attach：需要先打开网页到 http://localhost:4000，再启动调试
3. launch：需要先关闭所有的chrome进程，再启动调试

# 5. ant-design-pro调试

**launch.json**

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Chrome",
      "port": 9222,
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:8000",
      "sourceMaps": true,
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

# 6. vue-cli调试

参考：https://cn.vuejs.org/v2/cookbook/debugging-in-vscode.html

