module.exports = function (io) {
    io.on('connection', function (socket) {
        socket.emit("connected", {
            error: false,
            type : "connection",
            message :  "success"
        });
        global.msgsocket = socket;
    });
}