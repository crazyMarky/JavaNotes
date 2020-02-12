# Q：使用postman发送这个请求经历了什么？

```
GET /v1/newCommunityVisitor/h5/me/visitor/count/list?newCommunityId=5c283577ec9d7e0007815f8c http/1.1 
hack: test  
agentId: 5bc4002f9d5cd5000665b9cc 
host: api-b-dev.kanfangjilu.com
```


## HTTP报文

### 特点
- HTTP的报文是明文传输的，没有加密（HTTP/2以前）

### HTTP请求报文的结构


### HTTP响应报文的结构


## HTTP的历史，什么时间什么人什么地点创建的？

- HTTP/0.9 HTTP 于 1990 年问世。那时的 HTTP 并没有作为正式的标准被建立。 现在的 HTTP 其实含有 HTTP/1.0 之前版本的意思，因此被称为 HTTP/0.9。 

- HTTP/1.0 HTTP 正式作为标准被公布是在 1996 年的 5 月，版本被命名为 HTTP/1.0，并记载于 RFC1945。

-   HTTP/1.1 1997 年 1 月公布的 HTTP/1.1 是目前主流的 HTTP 协议版本。

-  HTTP/2 2015年发布，拥有更高的性能与安全性。

## HTTP的不同版本，有啥区别？
- HTTP/0.9 
    - 只能支持文本传输，只允许客户端发送GET这一种请求

- HTTP/1.0 
    - 请求与响应支持头部。
    - 响应对象不只限于超文本
    - 支持GET、HEAD、POST方法。
    - 缓存机制以及身份认证

- HTTP/1.1
    - 默认开启Connection：keep-alive，减少建立和关闭TCP连接的消耗
    - 虚拟主机的功能（HOST域）
    - 支持断点续传功能

- HTTP/2
    - 二进制分帧，帧是基于这个新协议通信的最小单位，采用二进制编码
    - 多路复用，允许同时通过单一的HTTP/2.0连接发起多重的请求-响应消息
    - 头部压缩，
    - 服务端推送










