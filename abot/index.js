const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const arduino = '5b9bccbf65b3142c3c717d4e';

port = 9899;

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

var x = new XMLHttpRequest();
x.open('POST', `http://192.168.0.102:${port}`, false);
x.setRequestHeader('Content-Type', 'application/json');
x.onreadystatechange = function(){
	
}
x.onload = function(){
	
}
x.onreadystatechange = function(){
	if(x.readyState == 4 && x.status == 200){
		if (!initializer) {
		x.open('POST', `http://192.168.0.102:${port}/arduinoRegister`, false);
		x.setRequestHeader('Content-Type', 'application/json');
		x.send(JSON.stringify({"key":  arduino}));
		initializer = true;
	}
	if(iterator%5000 == 0){
		x.open('POST', `http://192.168.0.102:${port}/reviveArduino`, false);
		x.setRequestHeader('Content-Type', 'application/json');
		x.send(JSON.stringify({"key":  arduino}));
	}
	iterator++;
	}
}
x.send();
