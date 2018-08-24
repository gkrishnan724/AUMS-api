const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api/api');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// Here, I will be responding the static files regarding the PWA.
// This is where the front-end will be residing. 

app.get('/',function(req,res){
    res.send('Welcome to Camel..');
});


// API Calls.
app.use('/api',api);


// Handle 404
app.use(function(req, res) {
    res.status(400).json({
        error:"Page not found"
    });
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).json({
        error:error
    });
});

app.listen(3000,function(){
    console.log('Server started at port 3000..');
});


