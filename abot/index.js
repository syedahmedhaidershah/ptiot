const testFolder = './';
const fs = require('fs');
const r = new RegExp(/[.][n][o][d][e][-][x][m][l][h][t][t][p][r][e][q][u][e][s][t][-][s][y][n][c][-]/);

function delxhrs(){
	fs.readdir(testFolder, (err, files) => {
	  files.forEach(file => {
	  	if(r.test(file)){
	  		fs.unlink(file, console.log(`Deleted files - ${file}`));
	  	}
	  });
	});
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const arduino = '5bb7759836afc323c82c2ffc';

const port = 9899;
const httpIp = 'http://192.168.1.102';

var initializer= false;
var iterator = 0;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json({extended : true}));


app.post("/", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.send({
		msg : "systemok.",
		key: arduino
	});
});
app.post("/update", (req, res) =>  {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.send({
		msg : "received"
	});
});

delxhrs();
var x = new XMLHttpRequest();
x.open('POST', `${httpIp}:${port}`, false);
x.setRequestHeader('Content-Type', 'application/json');
x.onreadystatechange = function(){
	
}
x.onload = function(){
	if (!initializer) {
		x.open('POST', `${httpIp}:${port}/arduinoRegister`, false);
		x.send(JSON.stringify({"key":  arduino}));
		initializer = true;
	}
	if(iterator%10 == 0){
		x.open('POST', `${httpIp}:${port}/reviveArduino`, false);
		x.send(JSON.stringify({"key":  arduino}));
	}
	iterator++;
}
x.onreadystatechange = function(){
	// if(x.readyState == 4 && x.status == 200){
	// 	console.log(x.responseText);
	// }
}
x.send(JSON.stringify({}));
