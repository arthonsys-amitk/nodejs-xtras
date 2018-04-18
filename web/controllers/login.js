"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
    {login} = require('../models'),
    {crypto} = require('../helpers'),
    {sendmail} = require('../helpers');

var exportFuns = {},
    web = {};

/***************************login**************************** */

web.login = (req, res)=>{
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
        if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
        {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
		res.render('admin/login');
	}else
	{
	 res.redirect('/admin/dashboard')     
	}
};

/***************************End login**************************** */

// authenticate a user
var authenticateUser = (email, password)=>{

  return login.getUserByEmail(email)
  .then(function(authUser){
    if( password == crypto.decrypt(_.trim(authUser.password)) ){
      return authUser;
    } else {
      return null;
    }
  });
};

/***************************login process**************************** */

web.login_process = (req, res)=>{
	 var email=req.body.email;
	 var password=req.body.password;


 	 login.check_email_exist(email).then(function(emailresult) {
              
              if(emailresult != null) 
              {
                  // fire a query to the DB and check if the credentials are valid
                  authenticateUser(email, password)
                  .then(function(userObj){

                    if (userObj){
                      return userObj;
                    }
                  })
                  .then(function(userObj){

                    if (! userObj) {
                    	req.session.alert_data = { alert_type: "danger", alert_msg: "Username and Password didn't matched." };
                        res.redirect('/admin');

                    } else {
						req.session.user_data=userObj;
						req.session.alert_data = { alert_type: "success", alert_msg: "Successfully logined." };
                        res.redirect('/admin/dashboard')                    
                    }
                  });

              } else {
                  req.session.alert_data = { alert_type: "danger", alert_msg: "Username and Password didn't matched." };
                        res.redirect('/admin');
              } 
          });  
};



/***************************End login**************************** */
web.dashboard = (req, res)=>{
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
		req.flash("error","Session Limeout");
		res.locals.messages = req.flash();
		res.redirect('/admin');
	}else{
	if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
        {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
	res.render('admin/dashboard',{"user_data":req.session.user_data});
	}
};
web.logout = (req, res)=>{
	req.session.destroy();
	req.session = null
	res.redirect('/admin');
};

/***************************login**************************** */

web.profile = (req, res)=>{
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
	res.redirect('/admin');
	}else{
	if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
        {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
	login.getUser(req.session.user_data._id).then(function(result){
	res.render('admin/profile',{"user_data":req.session.user_data,'profile_data':result});
	})
	}
};

/***************************End login**************************** */

/***************************change_password**************************** */

web.change_password = (req, res)=>{
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
	res.redirect('/admin');
	}else{
	//	res.send('dsfsdf');
	res.render('admin/profile',{"user_data":req.session.user_data});
	}
};

/***************************End change_password**************************** */

/***************************update_password**************************** */

web.update_password = (req, res)=>{
	login.check_user_old_password(req.body.user_id,crypto.encrypt(_.trim(req.body.old_password))).then(function(user_result){
		if(user_result!=''){
			login.updatePassword(req.body.user_id,crypto.encrypt(_.trim(req.body.new_password))).then(function(new_password_result){
				console.log(new_password_result);
				if(new_password_result!=0){
					res.send('Password changed');
				}else{
					res.send('Password not changed');
				}
			});
		}else{
			res.send('Old password not match');
		}

	});
    
	
};

/***************************End update_password******************************/

/***************************Update profile***********************************/

web.update_profile = (req, res)=>{
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
		res.redirect('/admin');
	}else
	{
		req.session.alert_data = { alert_type: "success", alert_msg: "Successfully Updated." };
		login.update_profile(req.body,req.files).then(function(update_result){
			if(update_result!=null)
			{
				req.session.flash_msg={"msg":"Profile updated Successfully","type":"success"};
				login.getUser(req.session.user_data._id).then(function(result){
				req.session.user_data=result;
				res.redirect('/admin/profile');
				});
			}else
			{
				req.flash("msg","Profile not update");
				res.locals.messages = req.flash();
				login.getUser(req.session.user_data._id).then(function(result){
				res.redirect('/admin/profile');
				});
			}
		});
	}
};

/***************************End Update profile**************************** */


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
