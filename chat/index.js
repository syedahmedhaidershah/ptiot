const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const port = 80;

app.get('*', (req,res) =>{
	res.send(req.query);
	console.log(req.query);
});

app.listen(port, () => {
	console.log(`We are live on ${port}`);
});
