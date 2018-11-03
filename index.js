const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const httpIns = http.createServer(app);
const socket = require("socket.io")(httpIns);
var socketHandler = null, appHandler = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const socketPort = 9899;
const appPort = 80;

socketHandler = require("./app/socket")(socket);

socket.listen(socketPort, () => {
	console.log(`Socket is live on port ${socketPort}`);
});
app.listen(appPort, () => {
	appHandler = require("./app/routes")(app, __dirname);
	console.log(`App is live on port ${appPort}`);
});
