var Client = require('ftp');
 
var c = new Client();
c.on('ready', function() {
    c.put('../rtsp_receiver_h264', 'foo.remote-copy.txt', function(err) {
        if (err) throw err;
        c.end();
    });
});
// connect to localhost:21 as anonymous
c.connect({
    host : "localhost",
    port : 21,
    user : "admin",
    password: "admina"
});