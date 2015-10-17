### 介绍
iweb 一个用于前端开发工具，
可以在文件发生变化时，实时自动在浏览器中刷新页面，或者精确的识别不同类型更新内容，
更细粒度的实时无刷新的更新 "样式、图片" 等资源,
无需任何浏览器插件，无需手动添加 "client-script", 可以同时连接不限数量的多个设备。

GitHub: [https://github.com/Houfeng/iweb](https://github.com/Houfeng/iweb) (欢迎 star、fork)
iweb 基于 Nokit 开发，[Nokit 相关介绍参考这里](https://github.com/Houfeng/nokit), 主页: [http://houfeng.net/iweb/](http://houfeng.net/iweb/)
  
### 安装
```javascript
[sudo] npm install iweb -g
```

### 更新
```javascript
[sudo] npm update iweb -g
```

### 启动
```javascript
cd <工作目录>
iweb [port]
```
启动后用PC或移动设备的浏览器直接访问 "http://localhost[:端口]"，
在文件发生任何变化时，iweb 会即时完成浏览器端刷新或更新。

### 在手机中访问
在手机上输入一个 url 是比较麻烦的， 可以通过访问 "http://locahost[:端口]/-dev" 可以打开 “工具” 页面，
在这个面页会为本机的每一个 ip 生成一个 “二维码”，可以用手机扫描，轻松访问。

### 页面审查工具
iweb 提供一个，基于 weinre（[Nokit](https://github.com/Houfeng/nokit) 重写的版本）的页面检查工具。
可以通过访问 "http://locahost[:端口]/-dev" 可以打开 “工具” 页面，
然后点击 "Inspector" 打开，类似 chrome devtool 的 "页面审查工具"

