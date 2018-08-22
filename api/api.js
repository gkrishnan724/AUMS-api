const express = require('express');
const aums = require('./routes/aums-route');

var router = express.Router();


//This section will contain routes to different api used in the camel bot, one of them would be aums.
router.get('/',function(req,res){
    res.send('Welcome to the Camel bot API');
});



//All api calls made to the aums service will go through here.
router.use('/aums',aums);


//To do: Add a docs section for making api-docs
module.exports = router;
