const express = require('express');
const Session = require('../modules/Aums');

var router = express.Router();


router.get('/',function(req,res){
    res.send('AUMS service for camel bot..')
});

//Missing field middleware
router.use(function(req,res,next){
    let missing = [];    
    if(!req.body.username){
        missing.push('username');
    }
    if(!req.body.password){
        missing.push('password');
    }
    if((req.path == '/grades' || req.path == '/attendance'  || req.path == '/marks' || req.path == '/registration')  && (!req.body.options || !req.body.options.sem)){
        missing.push('sem');
    }
    if((req.path == '/assignments') && (!req.body.options || !req.body.options.code)){
        missing.push('code');
    }
    if(missing.length > 0){
        res.status(400).json({
            message:missing.toString()+' fields are missing'
        });
    }
    next();
});

router.post('/login',function(req,res){
    
    var session = new Session(req.body.username,req.body.password);
    try{
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
    }
    catch(err){
        next(err);
    }
}); 

router.post('/grades',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    try{
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
    }
    catch(err){
        next(err);
    }
});

router.post('/attendance',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    try{
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
    }
    catch(err){
        next(err);
    }
});

router.post('/marks',function(req,res){
    try{
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
    }
    catch(err){
        next(err);
    }
});

router.post('/assignments',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    try{
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
    }
    catch(err){
        next(err);
    }
});

router.post('/registration',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    try{
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
    }
    catch(err){
        next(err);
    }
});

router.post('/dues',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    try{
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
    }
    catch(err){
        next(err);
    }
});

router.post('/feedback',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies);
    try{
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
    }
    catch(err){
        next(err);
    }
});

router.post('/announcements',function(req,res){
    var session = new Session(req.body.username,req.body.password,req.body.cookies)
    try{
        session.getAnnouncements().then(function(data){
            res.status(200).json({
                cookies:session.sessionCookies,
                data:data
            });
        },function(err){
            res.status(err.error).json({
                message:err.message
            });
        });
    }
    catch(err){
        next(err);
    }
});

//Error handler in production mode.
router.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: "Internal server error",
        error:{}
    });
    
});

module.exports = router;
