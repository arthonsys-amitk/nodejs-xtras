"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
    {user} = require('../models'),
    {crypto} = require('../helpers'),
    {sendmail} = require('../helpers');

var exportFuns = {},
    api = {},
    web = {};

// nodejs geocoder for latitude, longitude
var NodeGeocoder = require('node-geocoder');
var options = {
                provider: 'google',
                httpAdapter: 'https',
                apiKey: 'AIzaSyCnHXmtGqz7eOZg2rW9U20KDit1tRF6rhU',
                formatter: null
              };
var geocoder = NodeGeocoder(options);

// authenticate a user
var authenticateUser = (email, password)=>{

  return user.getUserByEmail(email)
  .then(function(authUser){
    if( password == crypto.decrypt(_.trim(authUser.password)) ){
      return authUser;
    } else {
      return null;
    }
  });
};

// generate jwt token after login
var genToken = (user)=>{
  let expires = expiresIn(config.tokenExpiration);
  let token = jwt.encode({
    expires: expires,
    userID: user._id
  }, config.secret);

  return {
    token: token,
    expires: expires,
    user: user
  };
}

var expiresIn = (numDays)=>{
  let dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

// create admin initially
exportFuns.createAdmin = (objUser)=>{
  if ( ! _.has(objUser, 'email') || _.trim(objUser.email).length == 0 ){
    return undefined;
  }

  let adminData = {

      fullname : _.trim(objUser.fullname),
      user_role : _.trim(objUser.user_role),
      email : _.trim(objUser.email),
      phone: _.trim(objUser.phone),
      address: _.trim(objUser.address),
      latitude: _.trim(objUser.latitude),
      longitude: _.trim(objUser.longitude),
      password: crypto.encrypt(_.trim(objUser.password)),
      user_image: _.trim(objUser.user_image),
      facebook_login_id: _.trim(objUser.facebook_login_id),
      google_login_id: _.trim(objUser.google_login_id),
      social_login_data_status: _.trim(objUser.social_login_data_status),
      is_active: _.trim(objUser.is_active),
      is_deleted: _.trim(objUser.is_deleted),
      created_time: _.trim(objUser.created_time),
      modified_time: _.trim(objUser.modified_time)
  };

  return user.createUser(adminData);
};


//++++++++++++++++++++++++++++++++++++++++++ CODE FOR APIs +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * @api {post} /user_login User Login
 * @apiGroup User
 * @apiSuccess {String} email Email
 * @apiSuccess {String} password Password
 * @apiSuccess {String} device_token Device Token
 * @apiSuccess {String} device_type Device Type : android / ios
 * @apiSuccessExample {json} Success
 *    {
    "status": 200,
    "api_name": "user_login",
    "message": "You have login successfully.",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyMzg5MzM0NzA4LCJ1c2VySUQiOiI1YWJjN2Q4YzZlYmQ0MzEyZjRiM2QyMjkifQ.FDJQCRJxwKLe_k5aOroIWmeR7j7hrKCKcL8CSbfJPsc",
        "expires": 1522389334708,
        "user": {
            "_id": "5abc7d8c6ebd4312f4b3d229",
            "fullname": "rahul soni",
            "user_role": 2,
            "email": "rahul@gmail.com",
            "alternate_email": "",
            "phone": "",
			"phone_1": "",
			"phone_2": "",
            "address": "jothwara,jaipur",
            "address_1": "",
            "address_2": "",
            "city": "jaipur",
            "state": "rajasthan",
            "zip_code": "302012",
            "country": "india",
            "latitude": 26.9564325,
            "longitude": 75.74125339999999,
            "password": "777e11fa2c71",
            "user_image": "http://localhost:3001/uploads/default/default_user.jpg",
            "facebook_login_id": "",
            "google_login_id": "",
            "social_login_data_status": 0,
            "otp_status": 0,
            "is_active": 0,
            "is_deleted": 0,
            "created_time": "2018-03-29T05:45:48.299Z",
            "modified_time": "2018-03-29T05:45:48.299Z"
        }
    }
}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "user_login",
          "message": "Login credentials are invalid.",
          "data": {}
      }
*/

api.user_login = (req, res)=>{

  let username = _.trim(req.body.email) || '';
  let password = _.trim(req.body.password) || '';

  if(Object.keys(req.body).length == 4) {

      if (username == '' || password == '') {
          res.json({
            "status": 400,
            "api_name": "user_login",
            "message": "Either Email or password is blank.",
            "data": {}
          });
          return;

      } else {

          user.check_email_exist(req.body.email).then(function(emailresult) {

              if(emailresult != null) 
              {
                  // fire a query to the DB and check if the credentials are valid
                  authenticateUser(username, password)
                  .then(function(userObj){

                    if (userObj){
                      return userObj;
                    }
                  })
                  .then(function(userObj){

                    if (! userObj) {
                        res.json({
                          "status": 400,
                          "api_name": "user_login",
                          "message": "Login credentials are invalid.",
                          "data": {}
                        });
                        return;

                    } else {
						 user.save_device_token(userObj._id, req.body.device_token, req.body.device_type);
                        res.json({
                          "status": 200,
                          "api_name": "user_login",
                          "message": "You have login successfully.",
                          "data": genToken(userObj)
                        });
                    }
                  });

              } else {
                  res.json({
                    "status": 400,
                    "api_name": "user_login",
                    "message": "Email is not exist.",
                    "data": {}
                  });
                  return;
              }
          });
      }

  } else {
        res.json({
          "status": 400,
          "api_name": "user_login",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};

/**
 * @api {post} /user_register User Register
 * @apiGroup User
 * @apiSuccess {String} first_name last_name
 * @apiSuccess {String} last_name last_name
 * @apiSuccess {String} email Email
 * @apiSuccess {String} address address
 * @apiSuccess {String} password Password
 * @apiSuccess {String} city city
 * @apiSuccess {String} state state
 * @apiSuccess {String} country country
 * @apiSuccess {String} device_token Device Token
 * @apiSuccess {String} device_type Device Type : android / ios
 * @apiSuccess {String} zip_code zip_code
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
			"status": 200,
			"api_name": "user_register",
			"message": "You have registered successfully.",
			"data": {
				"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyNDc2NDU0MzMxLCJ1c2VySUQiOiI1YWJkZDQyNjAyYWNlYTM2Mjk3OGVkODcifQ.cD-UKnY5O96NbVtRWuTRSN4YR6mIw4Zz6EeSuclAr74",
				"expires": 1522476454331,
				"user": {
					"fullname": "Rahul soni",
					"user_role": 2,
					"email": "rahul.soni@arthonsys.com",
					"alternate_email": "",
					"phone": "",
					"phone_1": "",
					"phone_2": "",
					"address": "chanpol",
					"address_1": "",
					"address_2": "",
					"city": "jaipur",
					"state": "rajasthan",
					"zip_code": "302012",
					"country": "india",
					"latitude": 26.9243316,
					"longitude": 75.8123829,
					"password": "777e11fa2c71",
					"user_image": "http://35.168.99.29:3001/uploads/default/default_user.jpg",
					"facebook_login_id": "",
					"google_login_id": "",
					"social_login_data_status": 0,
					"otp_status": 0,
					"is_active": 0,
					"is_deleted": 0,
					"created_time": "2018-03-30T06:07:34.322Z",
					"modified_time": "2018-03-30T06:07:34.322Z",
					"_id": "5abdd42602acea362978ed87"
				}
			}
		}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "user_register",
          "message": "Email is already exist.",
          "data": {}
      }
*/

api.user_register = (req, res) => {
    console.log(req.body);
    if(Object.keys(req.body).length == 11) {

        let check_email = user.check_email_exist(req.body.email);

        check_email.then(function(emailresult) {

            if(emailresult != null) 
            {
                res.json({
                  "status": 400,
                  "api_name": "user_register",
                  "message": "Email is already exist.",
                  "data": {}
                });
                return;

            } else {

                let check_phone = user.check_phone_exist(req.body.phone);

                check_phone.then(function(phoneresult) {

                    if (phoneresult != null) 
                    {
                        res.json({
                          "status": 400,
                          "api_name": "user_register",
                          "message": "Phone number is already exist.",
                          "data": {}
                        });
                        return;

                    } else {

                        
                                geocoder.geocode(req.body.address + req.body.city +  req.body.state + req.body.country, function(err, result){

                                    // if geocode response is empty
                                    if(result.length <= 0)
                                    {
                                        res.json({
                                          "status": 400,
                                          "api_name": "user_register",
                                          "message": "Address is invalid.",
                                          "data": {}
                                        });
                                        return;

                                    } else {
                                        var latitude = result[0].latitude;
                                        var longitude = result[0].longitude;

                                        

                                        var userdata = {
                                                           
                                                            fullname: req.body.first_name+' '+req.body.last_name,
                                                            user_role: 2,
                                                            email: req.body.email,
                                                            alternate_email:'',
                                                            phone: '',
                                                            phone_1: '',
                                                            phone_2: '',
                                                            address: req.body.address,
                                                            address_1:'',
                                                            address_2:'',
                                                            city   : req.body.city,
                                                            state  : req.body.state,
                                                            zip_code: req.body.zip_code,
                                                            country : req.body.country,
                                                            latitude: latitude,
                                                            longitude: longitude,
                                                            password: crypto.encrypt(req.body.password),
                                                            user_image: config.base_url+'/uploads/default/default_user.jpg',                                                         
                                                            facebook_login_id: "",
                                                            google_login_id: "",
                                                            social_login_data_status: 0,
                                                            otp_status: 0,
                                                            is_active: 1,
                                                            is_deleted: 0,
                                                            created_time: new Date(),
                                                            modified_time: new Date()
                                                        };

                                        // create user
                                        user.createUser(userdata)
                                        .then(function(response) {
                                            if (response != null) {
												user.save_device_token(userdata._id, req.body.device_token, req.body.device_type);

                                                res.json({
                                                  "status": 200,
                                                  "api_name": "user_register",
                                                  "message": "You have registered successfully.",
                                                  "data": genToken(userdata)
                                                });
                                                return;
                                            }
                                        });
                                    }
                                    
                                });
                            }
                        });
                    
            }
        })
    } else {
        res.json({
          "status": 400,
          "api_name": "user_register",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};

/**
 * @api {post} /change_password Change Password
 * @apiGroup User
 * @apiSuccess {String} user_id User Id
 * @apiSuccess {String} old_password Old Password
 * @apiSuccess {String} new_password New Password
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
          "status": 200,
          "api_name": "change_password",
          "message": "You have changed password successfully.",
          "data": 1
      }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "change_password",
          "message": "Old password is wrong.",
          "data": {}
      }
*/

api.change_password = (req, res) => {

    if (Object.keys(req.body).length == 3) {

        // check user is exist
        user.check_userid_exist(req.body.user_id)
        .then(function(userdata) {

            if(userdata != null) {

                if( req.body.old_password == crypto.decrypt(_.trim(userdata.password)) )
                {
                    var userId = req.body.user_id;
                    var updated_password = crypto.encrypt(_.trim(req.body.new_password));

                    user.updatePassword(userId, updated_password)
                    .then(function(result) {
                        res.json({
                          "status": 200,
                          "api_name": "change_password",
                          "message": "You have changed password successfully.",
                          "data": result
                        });
                        return;
                    });
                
                } else {
                    res.json({
                      "status": 400,
                      "api_name": "change_password",
                      "message": "Old password is wrong.",
                      "data": {}
                    });
                    return;
                }

            } else {
                res.json({
                  "status": 400,
                  "api_name": "change_password",
                  "message": "User is not exist.",
                  "data": {}
                });
                return;
            }
        });
    } else {
        res.json({
          "status": 400,
          "api_name": "change_password",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};


/**
 * @api {post} /update_forgot_password Update Forgot Password
 * @apiGroup User
 * @apiSuccess {String} user_id User Id
 * @apiSuccess {String} new_password New Password
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
          "status": 200,
          "api_name": "update_forgot_password",
          "message": "You have changed password successfully.",
          "data": {}
      }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "update_forgot_password",
          "message": "User doesn't exist.",
          "data": {}
      }
*/

api.update_forgot_password = (req, res) => {

    if (Object.keys(req.body).length == 2) {

        // check otp is exist
        user.check_userid_exist(req.body.user_id)
        .then(function(userdata) {

            if(userdata != null) {

                var userId = req.body.user_id;
                var updated_password = crypto.encrypt(_.trim(req.body.new_password));

                user.updatePassword(userId, updated_password)
                .then(function(result) {

                    res.json({
                      "status": 200,
                      "api_name": "update_forgot_password",
                      "message": "Your password has been updated successfully.",
                      "data": {}
                    });
                    return;
                });

            } else {
                res.json({
                  "status": 400,
                  "api_name": "update_forgot_password",
                  "message": "User doesn't exist.",
                  "data": {}
                });
                return;
            }
        });
    } else {
        res.json({
          "status": 400,
          "api_name": "update_forgot_password",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};

/**
 * @api {post} /resend_otp Resend OTP
 * @apiGroup User
 * @apiSuccess {String} email Email
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
          "status": 200,
          "api_name": "resend_otp",
          "message": "OTP has been sent to your email address.",
          "data": {
              "user_id": "5ab9f851dd88353ccc65cbf2",
              "user_email": "rajeev@gmail.com",
              "otp_number": "23105",
              "_id": "5aba5155a0dc7f0585a1fb98"
          }
      }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "resend_otp",
          "message": "User email is not exist.",
          "data": {}
      }
*/

api.resend_otp = (req, res) => {

    if (Object.keys(req.body).length == 1) {

        // check user is exist
        user.check_email_exist(req.body.email)
        .then(function(userdata) {

            if(userdata != null) {

                user.save_and_send_otp(userdata._id, userdata.email)
                .then(function(result) {
                    res.json({
                      "status": 200,
                      "api_name": "resend_otp",
                      "message": "OTP has been sent to your email.",
                      "data": result
                    });
                    return;
                });

            } else {
                res.json({
                  "status": 400,
                  "api_name": "resend_otp",
                  "message": "User email is not exist.",
                  "data": {}
                });
                return;
            }
        });
    } else {
        res.json({
          "status": 400,
          "api_name": "resend_otp",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};


/**
 * @api {post} /verify_otp Verify OTP
 * @apiGroup User
 * @apiSuccess {String} email Email
 * @apiSuccess {String} otp_number OTP Number
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
          "status": 200,
          "api_name": "verify_otp",
          "message": "OTP matched successfully.",
          "data": {
              "user_id": "5ab9f851dd88353ccc65cbf2",
              "email": "rajeev@gmail.com"
          }
      }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "verify_otp",
          "message": "OTP is not exist.",
          "data": {}
      }
*/

api.verify_otp = (req, res) => {

    if (Object.keys(req.body).length == 2) {

        // check user is exist
        user.check_email_exist(req.body.email)
        .then(function(userdata) {

            if(userdata != null) {

                // check otp is exist
            user.check_otp_exist(userdata._id, userdata.email)
            .then(function(otp_data) {

                if(otp_data != null) {

                    if(otp_data.otp_number == req.body.otp_number)
                    {
                        // verify and remove otp
                          user.verify_and_remove_otp(userdata._id, userdata.email);

                          res.json({
                            "status": 200,
                            "api_name": "verify_otp",
                            "message": "OTP matched successfully.",
                            "data": {
                                       user_id: userdata._id,
                                       email: userdata.email
                                    }
                          });
                          return;
                    
                    } else {
                        
                        res.json({
                          "status": 400,
                          "api_name": "verify_otp",
                          "message": "OTP doesn't matched.",
                          "data": {}
                        });
                        return;
                    }

                } else {
                    res.json({
                      "status": 400,
                      "api_name": "verify_otp",
                      "message": "OTP is not exist.",
                      "data": {}
                    });
                    return;
                }
            });

            } else {
                res.json({
                  "status": 400,
                  "api_name": "verify_otp",
                  "message": "User email is not exist.",
                  "data": {}
                });
                return;
            }
        });
    } else {
        res.json({
          "status": 400,
          "api_name": "verify_otp",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};
/**
     * @api {post} /update_profile Update Profile
     * @apiGroup User
     * @apiSuccess {String} fullname Full name
     * @apiSuccess {String} alternate_email Alternate_email
     * @apiSuccess {String} email Email
     * @apiSuccess {String} phone Phone
     * @apiSuccess {String} phone_1 Phone 1
     * @apiSuccess {String} phone_2 Phone 2
     * @apiSuccess {String} address Address
     * @apiSuccess {String} address_1 Address_1
     * @apiSuccess {String} address_2 Address_2
     * @apiSuccess {String} user_id User id
     * @apiSuccess {String} user_image User_image
     * @apiSuccess {String} city city
     * @apiSuccess {String} state state
     * @apiSuccess {String} country country
     * @apiSuccess {String} zip_code zip_code
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    {
			"status": 200,
			"api_name": "update_profile",
			"message": "You have updated successfully",
			"data": {
				"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyNDc2NjA3ODY2LCJ1c2VySUQiOiI1YWJkZDQyNjAyYWNlYTM2Mjk3OGVkODcifQ.RLWoRl_qqzSfTBWsywB7yYaGjwuoGtTrFBmEM2Ifo3M",
				"expires": 1522476607866,
				"user": {
					"user_role": 2,
					"alternate_email": "rohit@gmail.com",
					"email": "rohit@gmail.com",
					"phone": "7877949375",
					"phone_1": "7877949375",
					"phone_2": "7877949375",
					"address": "jothwara,jaipur",
					"address_1": "jaipur jaipur",
					"address_2": "hariyan",
					"city": "jaipur",
					"state": "rajasthan",
					"zip_code": "302012",
					"country": "india",
					"latitude": 26.9564325,
					"longitude": 75.74125339999999,
					"facebook_login_id": "",
					"google_login_id": "",
					"social_login_data_status": 0,
					"otp_status": 0,
					"is_active": 0,
					"is_deleted": 0,
					"created_time": "2018-03-30T06:10:07.852Z",
					"modified_time": "2018-03-30T06:10:07.852Z",
					"user_image": "users_1522390207852498.jpg",
					"_id": "5abdd42602acea362978ed87"
				}
			}
		}
     * @apiErrorExample {json} Failed
     *    HTTP/1.1 400 Failed
          {
              "status": 400,
              "api_name": "update_profile",
              "message": "Phone is already exist.",
              "data": {}
          }
    */

api.update_profile = (req, res) => {

    if(Object.keys(req.body).length == 15) {
		let idresult = user.check_userid_exist(req.body.user_id);

		idresult.then(function(idresult) {

			if (idresult == null) 
			{
				res.json({
				  "status": 400,
				  "api_name": "update_profile",
				  "message": "User Not Exist.",
				  "data": {}
				});
				return;

			} else {
                let check_phone = user.check_phone_exist_when_update(req.body.phone,req.body.user_id);

                check_phone.then(function(phoneresult) {

                    if (phoneresult != null) 
                    {
                        res.json({
                          "status": 400,
                          "api_name": "update_profile",
                          "message": "Phone number is already exist.",
                          "data": {}
                        });
                        return;

                    } else {

                        
                                geocoder.geocode(req.body.address + req.body.city +  req.body.state + req.body.country, function(err, result){

                                    // if geocode response is empty
                                    if(result.length <= 0)
                                    {
                                        res.json({
                                          "status": 400,
                                          "api_name": "update_profile",
                                          "message": "Address is invalid.",
                                          "data": {}
                                        });
                                        return;

                                    } else {
                                        var latitude = result[0].latitude;
                                        var longitude = result[0].longitude;
                                        

                                        var userdata = {
                                                        
                                                          fullname: req.body.fullname,
                                                          user_role: 2,
                                                          alternate_email:req.body.alternate_email,
                                                          phone: req.body.phone,
                                                          phone_1: req.body.phone_1,
                                                          phone_2: req.body.phone_2,
                                                          address: req.body.address,
                                                          address_1:req.body.address_1,
                                                          address_2:req.body.address_2,
                                                          city   : req.body.city,
                                                          state  : req.body.state,
                                                          zip_code: req.body.zip_code,
                                                          country : req.body.country,
                                                          latitude: latitude,
                                                          longitude: longitude,
                                                          facebook_login_id: "",
                                                          google_login_id: "",
                                                          social_login_data_status: 0,
                                                          otp_status: 0,
                                                          is_active: 0,
                                                          is_deleted: 0,
                                                          created_time: new Date(),
                                                          modified_time: new Date()
                                                    };
                                        if(req.body.user_image!=''){
                                        var fs     = require('fs')
                                        var image = req.body.user_image;
                                        var profile_path="users_"+Date.now()+Math.floor(Math.random() * (500 - 20 + 1) + 20)+".jpg";
                                        var bitmap = new Buffer(image, 'base64');
                                        fs.writeFileSync("public/uploads/users/"+profile_path, bitmap);
                                         userdata.user_image=config.base_url+'/uploads/users/'+profile_path;
                                        }
                                           var id=req.body.user_id;               
                                        // create user
                                        user.updateUser(userdata,id)
										
                                        .then(function(response) {
												user.getUser(id).then(function(all_user_data){
                                            if (response != null) {
												userdata.email=req.body.email;
                                                res.json({
                                                  "status": 200,
                                                  "api_name": "update_profile",
                                                  "message": "You have updated successfully",
                                                  "data": genToken(all_user_data)
                                                });
                                                return;
                                            }
											})
                                        });
                      
                                    }
                                    
                                });
                            }
                        });
               }
});			   
            
    } else {
        res.json({
          "status": 400,
          "api_name": "user_register",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};

/**
 * @api {post} /user_logout User Logout
 * @apiGroup User
 * @apiSuccess {String} user_id User Id
 * @apiSuccess {String} [device_token] Device Token
 * @apiSuccess {String} device_type Device Type : android / ios
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
          "status": 200,
          "api_name": "user_logout",
          "message": "You have logout successfully.",
          "data": {}
      }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "user_logout",
          "message": "Some request parameters are missing.",
          "data": {}
      }
*/

api.user_logout = (req, res)=>{

  if(Object.keys(req.body).length >= 2) {
	  //if(req.body.user_id=='' || req.body.device_token=='' || req.body.device_type==''){
	  if(req.body.user_id=='' || req.body.device_type==''){
		res.json({
            "status": 400,
            "api_name": "user_logout",
            "message": "Some fields are empty.",
            "data": {}
          });
		return;
	  }
  
	  if(req.body.device_type != null && req.body.device_type != undefined && req.body.device_type != "") {
		  user.check_device_token_exist(req.body.user_id, req.body.device_token, req.body.device_type)
		  .then(function(token_data) {

			  if(token_data != null) 
			  {
				  // save device token
				  user.remove_device_token(req.body.user_id, req.body.device_token, req.body.device_type);
			  }

			  res.json({
				"status": 200,
				"api_name": "user_logout",
				"message": "You have logout successfully.",
				"data": {}
			  });
		  });
	  } else {
		  //when no device_token is supplied
		  res.json({
			"status": 200,
			"api_name": "user_logout",
			"message": "You have logout successfully.",
			"data": {}
		  });
		  return;
	  }
  } else {
        res.json({
          "status": 400,
          "api_name": "user_logout",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};

api.get_coupon = (req, res)=>{

          user.check_coupon()
          .then(function(coupon) {
            if(coupon!=null){
                res.json({
                  "status": 200,
                  "api_name": "get_coupon",
                  "message": "All coupons.",
                  "data": coupon
                });
                return;
            }else{
                res.json({
                  "status": 400,
                  "api_name": "get_coupon",
                  "message": "coupon invalid or expired."
                });
                return;
            }
          });

  
};



/**
 * @api {post} /get_category Get Category
 * @apiGroup Home Page

 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
		"status": 200,
		"api_name": "get_category",
		"message": "All Category.",
		"data": [
			{
				"_id": "5ac1e0a2d74b0f03981a5e6d",
				"category_name": "Automobile Services",
				"parent_id": "0",
				"category_image": "http://35.168.99.29:3001/image/automobile-svc.png",
				"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"subcategories": [
					{
						"_id": "5ac4e5cd5f7b5e0f1101ec3d",
						"category_name": "Oil Change",
						"parent_id": "5ac1e0a2d74b0f03981a5e6d",
						"category_image": "http://35.168.99.29:3001/image/automobile-svc.png",
						"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
						"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)"
					},
					{
						"_id": "5ac4e5df5f7b5e0f1101eca4",
						"category_name": "Tyre Rotation",
						"parent_id": "5ac1e0a2d74b0f03981a5e6d",
						"category_image": "http://35.168.99.29:3001/image/automobile-svc.png",
						"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
						"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)"
					},
					{
						"_id": "5ac4e5f45f7b5e0f1101ed33",
						"category_name": "Wiper Blade",
						"parent_id": "5ac1e0a2d74b0f03981a5e6d",
						"category_image": "http://35.168.99.29:3001/image/automobile-svc.png",
						"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
						"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)"
					},
					{
						"_id": "5ac4e6065f7b5e0f1101edb7",
						"category_name": "Battery Boost",
						"parent_id": "5ac1e0a2d74b0f03981a5e6d",
						"category_image": "http://35.168.99.29:3001/image/automobile-svc.png",
						"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
						"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)"
					},
					{
						"_id": "5ac4e6155f7b5e0f1101ee1c",
						"category_name": "Others",
						"parent_id": "5ac1e0a2d74b0f03981a5e6d",
						"category_image": "http://35.168.99.29:3001/image/automobile-svc.png",
						"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
						"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)"
					}
				]
			},
			{
				"_id": "5ac1e3f6d74b0f03981a5e6e",
				"category_name": "Computer Service",
				"parent_id": "0",
				"category_image": "http://35.168.99.29:3001/image/computer-svc.png",
				"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"subcategories": []
			},
			{
				"_id": "5ac1e48fd74b0f03981a5e6f",
				"category_name": "Food Catering Service",
				"parent_id": "0",
				"category_image": "http://35.168.99.29:3001/image/food-svc.png",
				"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"subcategories": []
			},
			{
				"_id": "5ac1e4fcd74b0f03981a5e70",
				"category_name": "Lawn Mowing Service",
				"parent_id": "0",
				"category_image": "http://35.168.99.29:3001/image/lawn-svc.png",
				"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"subcategories": []
			},
			{
				"_id": "5ac1e55cd74b0f03981a5e71",
				"category_name": "Movers & Delivery Service",
				"parent_id": "0",
				"category_image": "http://35.168.99.29:3001/image/movers-svc.png",
				"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"subcategories": []
			},
			{
				"_id": "5ac1e5a1d74b0f03981a5e72",
				"category_name": "Snow Cleaning Service",
				"parent_id": "0",
				"category_image": "http://35.168.99.29:3001/image/snow-svc.png",
				"created_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"updated_at": "Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)",
				"subcategories": []
			}
		]
	}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "get_category",
          "message": "No Category found."
      }
*/
api.get_category = (req, res)=>{
    user.save_device_token(req.body.user_id, req.body.device_token, req.body.device_type);
          user.get_category()
          .then(function(category) {
            if(category!=null){
                res.json({
                  "status": 200,
                  "api_name": "get_category",
                  "message": "All Category.",
                  "data": category
                });
                return;
            }else{
                res.json({
                  "status": 400,
                  "api_name": "get_category",
                  "message": "No Category found."
                });
                return;
            }
          });

  
};

/**
 * @api {post} /social_login Social Login
 * @apiGroup User
 * @apiparam {String} email	Email ID of User
 * @apiparam {String} login_id	Facebook/Google ID
 * @apiparam {String} login_type	"facebook" or "google"
 * @apiparam {String} image_url	URL of profile image by Google/Facebook
 * @apiparam {String} device_token Device Token
 * @apiparam {String} device_type Device Type : android / ios
 * @apiparam {String} name Full Name of User
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
		"status": 200,
		"api_name": "social_login",
		"message": "Facebook Login is successful",
		"data": {
			"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyNzU4ODc5NTMxLCJ1c2VySUQiOiI1YWMyMjM1ZmVhYjRkNzE3MTBhMDUyMWMifQ.n2B7E5pWwG0tu3F82bQ7LBkqB74YtGrdydItEhqgXIc",
			"expires": 1522758879531,
			"user": {
				"fullname": "Mike Adams",
				"user_role": 2,
				"email": "mike.adams@mailinator.com",
				"alternate_email": "",
				"phone": "",
				"phone_1": "",
				"phone_2": "",
				"address": "",
				"address_1": "",
				"address_2": "",
				"city": "",
				"state": "",
				"zip_code": "",
				"country": "",
				"latitude": "",
				"longitude": "",
				"password": "333f44ba2976b0",
				"user_image": "http://35.168.99.29:3001/image/automobile-svc.png",
				"facebook_login_id": "348574680756857680",
				"google_login_id": "",
				"social_login_data_status": 1,
				"otp_status": 0,
				"is_active": 0,
				"is_deleted": 0,
				"created_time": "2018-04-02T12:34:39.500Z",
				"modified_time": "2018-04-02T12:34:39.501Z",
				"_id": "5ac2235feab4d71710a0521c"
			}
		}
	}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "social_login",
          "message": "Email already exists",
          "data": {}
      }
*/


api.social_login = (req, res) => {
    if(Object.keys(req.body).length <= 7) {

        let check_email = user.check_email_exist(req.body.email);

        check_email.then(function(emailresult) {

            if(emailresult != null) 
            {
				
			  user.getUserByEmail(req.body.email).then(function(result){
			 
				user.save_device_token(result._id, req.body.device_token, req.body.device_type);
				
				 res.json({
					  "status": 200,
					  "api_name": "social_login",
					  "message": "Social Login is successful",
					  "data": genToken(result)
					});
					return;
				})				
			
            } else {
			 
				 if(req.body.login_type == "facebook") {
					 var user_img_url = ((req.body.image_url == null || !req.body.image_url)? ('http://' + req.headers.host + '/uploads/default/default_user.jpg'): req.body.image_url);
					 var user_full_name = (req.body.name == null? '': req.body.name);
					var userdata = {
									fullname : user_full_name,
									user_role: 2,
									email: req.body.email,
									alternate_email:'',
									phone: '',
									phone_1: '',
									phone_2: '',
									address: '',
									address_1:'',
									address_2:'',
									city   : '',
									state  : '',
									zip_code: '',
									country : '',
									latitude: '',
									longitude: '',
									password: crypto.encrypt('user123'),
									user_image: user_img_url,
									facebook_login_id: req.body.login_id,
									google_login_id: "",
									social_login_data_status: 1,
									otp_status: 0,
									is_active: 0,
									is_deleted: 0,
									profile_complete: 0,
									created_time: new Date(),
									modified_time: new Date()
								  };
								// create user
								user.createUser(userdata)
								.then(function(response) {
									if (response != null) {
										user.save_device_token(userdata._id, req.body.device_token, req.body.device_type);
										console.log(req.body);
										res.json({
										  "status": 200,
										  "api_name": "social_login",
										  "message": "Facebook Login is successful",
										  "data": genToken(userdata)
										});
										return;
									}
								});
				 } else if(req.body.login_type == "google") {
				 
					var user_img_url = ((req.body.image_url == null || !req.body.image_url)? ('http://' + req.headers.host + '/uploads/default/default_user.jpg'): req.body.image_url);
					var user_full_name = (req.body.name == null? '': req.body.name);
					var userdata = {
									fullname : user_full_name,
									user_role: 2,
									email: req.body.email,
									alternate_email:'',
									phone: '',
									phone_1: '',
									phone_2: '',
									address: '',
									address_1:'',
									address_2:'',
									city   : '',
									state  : '',
									zip_code: '',
									country : '',
									latitude: '',
									longitude: '',
									password: crypto.encrypt('user123'),
									user_image: user_img_url,
									facebook_login_id: '',
									google_login_id: req.body.login_id,
									social_login_data_status: 1,
									otp_status: 0,
									is_active: 0,
									is_deleted: 0,
									profile_complete: 0,
									created_time: new Date(),
									modified_time: new Date()
								  };
								// create user
								user.createUser(userdata)
								.then(function(response) {
									if (response != null) {
									console.log(req.body);
										user.save_device_token(userdata._id, req.body.device_token, req.body.device_type);

										res.json({
										  "status": 200,
										  "api_name": "social_login",
										  "message": "Google Login is successful",
										  "data": genToken(userdata)
										});
										return;
									}
								});
				 }
			
			
                
                    
            }
        })
    } else {
        res.json({
          "status": 400,
          "api_name": "social_login",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};
/**
 * @api {post} /add_faq Add user query
 * @apiGroup User
 * @apiparam {String} email	Email ID of User
 * @apiparam {String} query	Query by user

 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
    "status": 200,
    "api_name": "add_faq",
    "message": "Query Added successfully.",
    "data": {}
}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
         "status": 400,
         "api_name": "add_faq",
         "message": "Query not Added.",
         "data": {}
      }
*/
api.add_faq = (req, res)=>{
if(Object.keys(req.body).length == 2) {
    user.add_faq(req.body.email,req.body.query)
    .then(function(result) {
      if(result!=null){
          res.json({
            "status": 200,
            "api_name": "add_faq",
            "message": "Query Added successfully.",
            "data": {}
          });
          return;
      }else{
          res.json({
            "status": 400,
            "api_name": "add_faq",
            "message": "Query not added."
          });
          return;
      }
    });
}else{
    res.json({
        "status": 400,
        "api_name": "add_faq",
        "message": "Some request parameters are missing.",
        "data": {}
      });
      return;
} 


};
api.send = (req, res)=>{
   var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rahul.soni@arthonsys.com',
    pass: 'Rahulsoni@120245'
  }
});

var mailOptions = {
  from: 'rahul.soni@arthonsys.com',
  to: 'rahulsonikadel@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.send(error);
  } else {
     res.send(info.response);
  }
});
}
/**
 * @api {post} /get_coupon_by_service_id Get Coupon by service_id
 * @apiGroup Coupon
 * @apiparam {String} service_id	Service Id 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
    "status": 200,
    "api_name": "get_coupon_by_service_id",
    "message": "Coupon found.",
    "data": [
        {
            "_id": "5ac6091ce10da115207753a2",
            "coupon_code": "killer",
            "expiry_date": "2018-04-08T16:00:00.000Z",
            "created_at": "2018-04-05T11:31:40.089Z",
            "multiple_use": 1,
            "percent": 50,
            "service_ids": [
                "5ac46a660d4b66316d0ee73a",
                "5ac47e52f3f11e3a458e74d7",
                "5ac47e9af3f11e3a458e74db",
                "5ac60678225aca1d6064420b",
                "5ac6067d225aca1d6064420c"
            ],
            "is_deleted": 0
        },
        {
            "_id": "5ac60edd255db317306f7047",
            "coupon_code": "indian",
            "expiry_date": "2018-04-08T16:00:00.000Z",
            "created_at": "2018-04-05T11:56:13.614Z",
            "multiple_use": 1,
            "percent": 50,
            "service_ids": [
                "5ac46a660d4b66316d0ee73a",
                "5ac47e52f3f11e3a458e74d7",
                "5ac47e9af3f11e3a458e74db",
                "5ac60678225aca1d6064420b",
                "5ac6067d225aca1d6064420c"
            ],
            "is_deleted": 0
        },
        {
            "_id": "5ac60ee2255db317306f7048",
            "coupon_code": "must",
            "expiry_date": "2018-04-08T16:00:00.000Z",
            "created_at": "2018-04-05T11:56:18.806Z",
            "multiple_use": 1,
            "percent": 50,
            "service_ids": [
                "5ac46a660d4b66316d0ee73a",
                "5ac47e52f3f11e3a458e74d7",
                "5ac47e9af3f11e3a458e74db",
                "5ac60678225aca1d6064420b",
                "5ac6067d225aca1d6064420c"
            ],
            "is_deleted": 0
        }
    ]
}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
         "status": 400,
         "api_name": "get_coupon_by_service_id",
         "message": "Result not found.",
         "data": []
      }
*/
api.get_coupon_by_service_id = (req, res)=>{
    //console.log([req.body.service_id]);
    if(Object.keys(req.body).length == 1) {

        if(req.body.service_id!='')
        {
            user.get_coupon_by_service_id(req.body.service_id)
            .then(function(result) {
				console.log(result);
            if(result != null && result != [] && result.length > 0){
                
					res.json({
						"status": 200,
						"api_name": "get_coupon_by_service_id",
						"message": "Coupon found.",
						"data":result
					});
					return;
				
            }else{
                res.json({
                    "status": 400,
                    "api_name": "get_coupon_by_service_id",
                    "message": "Coupon not found",
                    "data": []
                });
                return;
            }
            });
        }else
        {
            user.check_coupon()
            .then(function(coupon) {
              if(coupon!=null){
                  res.json({
                    "status": 200,
                    "api_name": "get_coupon_by_service_id",
                    "message": "All coupons.",
                    "data": coupon
                  });
                  return;
              }
            });
        }
    }else
    {
        res.json({
            "status": 400,
            "api_name": "get_coupon_by_service_id",
            "message": "Some request parameters are missing.",
            "data": {}
        });
        return;
    }  
};
api.get_profile = (req, res)=>{
    if(Object.keys(req.body).length == 1) {
    user.check_userid_exist(req.body.user_id)
        .then(function(userdata) {
            res.json({
                "status": 200,
                "api_name": "get_profile",
                "message": "All user data.",
                "data": genToken(userdata)
              });
              return;
        });
       
    }else
    {
        res.json({
            "status": 400,
            "api_name": "get_profile",
            "message": "Some request parameters are missing.",
            "data": {}
        });
        return;
    }  
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


exportFuns.api = api;
exportFuns.web = web;
module.exports = exportFuns;
