module.exports = function (io) {
    io.on('connection', function (socket) {
    	socket.on('disconnect', function () {
            socket.emit({
	    		error : false,
	    		msg : "disconnected"
	    	});
        });
    });
    io.on('forward', function(d){
        console.log(d);
    	global.ioServer.sockets.emit( d.id, d.data);

    });
}