const fr = require("face-recognition");

const win = new fr.ImageWindow();
var exitcheck = false;

while(true){
    try{
        const fs = require('fs');
        const screenshot = require('screenshot-stream');

        const stream = screenshot('http://192.168.1.102:9499', '1024x768', { crop: true });

        stream.pipe(fs.createWriteStream('1.png'));
    } catch (ex){
        exitcheck = true;
    }
    if(!stream || exitcheck){
        return false;
    }
}
// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const process = require('process');
// const port = 9898;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.listen(process.env.PORT || port, () => {

// });