# 单独的 JS 文件

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

# Node服务

```
{
  "type": "node",
  "request": "launch",
  "name": "launch server",
  "program": "${workspaceFolder}/index.js"
},
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