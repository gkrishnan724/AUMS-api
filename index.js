const SlackBot = require('slackbots');
// const axios = require('axios');

const bot = new SlackBot({
    token: 'xoxb-378297102566-376862591377-b5cNBeyLE33hHqgHpmJ0uF9S',
    name: 'camel'
});

//Start handleer

bot.on('start',function(){
    params = {
        
    }
    bot.postMessageToChannel('general', 'Hey there this is @Camel your personal Assistant! :)', params);
});
