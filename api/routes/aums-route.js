const express = require('express');
const Session = require('../modules/Aums');

var router = express.Router();


router.get('/',function(req,res){
    res.send('AUMS service for camel bot..')
});


router.post('/login',function(req,res){
    var session = new Session(req.body.username,req.body.password);
    session.login(session.username,session.password).then(function(){
        res.status(200).json({
            cookies:session.sessionCookies,
            URLS:session.urls
        });
    },function(err){
        res.status(err.error).json({
            message: err.message
        });
    });
}); 

router.post('/grades',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    session.getGrades(req.body.options.sem).then(function(data){
        res.status(200).json({
            cookies:session.sessionCookies,
            data:data
        });
    },function(err){
        res.status(err.error).json({
            message: err.message
        });
    });
});

router.post('/attendance',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    session.getAttendance(req.body.options.sem).then(function(data){
        res.status(200).json({
            cookies:session.sessionCookies,
            data:data
        });
    },function(err){
        res.status(err.error).json({
            message: err.message
        });
    });
});

router.post('/marks',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    session.getMarks(req.body.options.sem).then(function(data){
        res.status(200).json({
            cookies:session.sessionCookies,
            data:data
        });
    },function(err){
        res.status(err.error).json({
            message: err.message
        });
    });
});

router.post('/assignments',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    session.getAssignment(req.body.options.code).then(function(data){
        res.status(200).json({
            cookies:session.sessionCookies,
            data:data
        });
    },function(err){
        res.status(err.error).json({
            message: err.message
        });
    });
});

router.post('/registration',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    session.showRegistrationStatus(req.body.options.sem).then(function(data){
        res.status(200).json({
            cookies:session.sessionCookies,
            data:data
        });
    },function(err){
        res.status(err.error).json({
            message: err.message
        });
    });
});

router.post('/dues',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    session.getAllDues().then(function(data){
        res.status(200).json({
            cookies:session.sessionCookies,
            data:data
        });
    },function(err){
        res.status(err.error).json({
            message: err.message
        });
    });
});

router.post('/feedback',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    session.checkFeedback().then(function(data){
        res.status(200).json({
            cookies:session.sessionCookies,
            data:data
        });
    },function(err){
        res.status(err.error).json({
            message: err.message
        });
    });
});

module.exports = router;
