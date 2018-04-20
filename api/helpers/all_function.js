"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');
const push_notifications=require('./push_notifications');
//+++++++++++++++++++++++++++++++++++++++ FOR ANDRIOD ++++++++++++++++++++++++++++++++++++++

exportFuns.send_device_token_using_user_id = (user_id,message_data) => {
    let db = new Mongo;

    let searchPattern = {
        user_id:  db.makeID(user_id)
    };
   console.log(searchPattern);
    return db.connect(config.mongoURI)
    .then(function() {		
         db.find('user_device_tokens',searchPattern).then(function(token_data){
         // console.log(token_data);
            for(var i=0;i<token_data.length;i++)
                {
					
                  //console.log(i);
                    
                    if(token_data[i].device_type == 'android')
                    { 
					var messagePattern = 
                    { 
                        to: token_data[i].device_token, data: {},
                        data: message_data
                    }; 
						//console.log(messagePattern);
						console.log(token_data[i].device_type);
                        push_notifications.sendForAndriod(messagePattern); 
                    }
                    if(token_data[i].device_type == 'ios')
                    {
					var messagePattern = 
                    { 
                        to: token_data[i].device_token, data: {},
                        notification: message_data
                    }; 
						//console.log(token_data[i].device_token);
                        push_notifications.sendForIOS(token_data[i].device_token,messagePattern.notification); 
                    }  
                    
                //console.log(token_data);
                }  
            });
        }); 
};

//+++++++++++++++++++++++++++++++++++++++ FOR IOS ++++++++++++++++++++++++++++++++++++++



module.exports = exportFuns;