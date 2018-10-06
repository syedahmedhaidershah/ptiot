const ioHost = "http://192.168.1.102";
const iPort = 9997
const io = require("socket.io-client"), ioClient = io.connect(ioHost + ":" + iPort);
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const serverIo = require("socket.io")(http), ioServer = serverIo.listen(9996), server = require('./server/index')(ioServer);
global.ioServer = serverIo;

socket = require('./socket')(ioClient);
