const express = require("express");
var app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const createPdf = require('./createPdf');

const port = process.env.PORT || 3300;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('access-Control-Allow-Origin', '*');
    next();
});

createPdf(app);

http.listen(port, function(){
    console.log('listening on *: ' + port);
});