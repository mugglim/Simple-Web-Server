# Simple Web Server

Simple Web Server with Node.js for studying TCP Socket.

<img src="https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=JavaScript&logoColor=F7DF1E"> <img src="https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=Node.js&logoColor=F7DF1E">

## Setup

### 1) Install package

```
npm install
```

### 2) Set environment variables

```bash
# /.env
SERVER_IP=<your-server-socket-ip>       # default: 127.0.0.1
SERVER_PORT=<your-server-socket-port>   # default: 80
```

### 3) Run server socket

```bash
npm run server
```

### 4) Open browser!

```bash
# examples
http://127.0.0.1:80/index.html
http://127.0.0.1:80/dog1.jpg
http://127.0.0.1:80/dog2.jpg
```

## Ref.

-   http://www.kocw.net/home/cview.do?mty=p&kemId=1169634
-   https://www.w3.org/Protocols/rfc2616/rfc2616.html
-   https://developer.mozilla.org/ko/docs/Learn/Server-side/Node_server_without_framework
