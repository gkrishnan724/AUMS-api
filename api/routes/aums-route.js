const express = require('express');
const Session = require('../modules/Aums');

var router = express.Router();

router.get('/',function(req,res){
    res.send('Welcome to the AUMS api for camel.')
});

router.post('/grades',function(req,res){

});

router.post('/attendance',function(req,res){

});

router.post('/marks',function(req,res){

});

router.post('/assignments',function(req,res){

});

router.post('/registration',function(req,res){

});

router.post('/dues',function(req,res){

});

router.post('/feedback',function(req,res){

});




module.exports = router;
