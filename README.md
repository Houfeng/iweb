###介绍
iweb 一个用于前端开发工具，
可以在文件发生变化时，实时刷新页面或实时无刷新的更新 “样式、图片” 等资源。

###安装
```javascript
[sudo] npm install iweb -g
```

###更新
```javascript
[sudo] npm update iweb -g
```

###启动
```javascript
cd <工作目录>
iweb [port]
```

###工具
iweb 启动后可以直接在浏览器中访问 locahost[:端口]/-dev/tools

提供了如下工具:

1. Inspector（基于 weinre 的页面检查工具）
2. Reloader (实时刷新，在工具页能看到所有连接中的页面)


同时，在 tools 页面，还会生成访问地址的 QRCode (二维码)，
移动设备可以扫描访问，省去输入的麻烦。