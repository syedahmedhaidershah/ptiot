module.exports = function (ioServer) {
    ioServer.on('connection', function (socket) {
        socket.emit("connected", {
            error: false,
            type : "connection",
            message :  "success"
        });
    });
}