"use strict";

var jwt    = require('jwt-simple'),
    _      = require('lodash'),
   {content} = require('../models'),
    config = require('../../config');


var exportFuns = {},
    api = {},
    web = {};

 /**
 * @api {post} /insert_contact_us Contact us
 * @apiGroup Frontend
 * @apiSuccess {String} email Email
 * @apiSuccess {String} phone_no Phone Number
 * @apiSuccess {String} comment Comment
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
          "status": 200,
          "api_name": "insert_contact_us",
          "message": "Thank you for getting in touch!."
      }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "insert_contact_us",
          "message": "Data not insert.",
          "data": {}
      }
*/
api.insert_contact_us = (req, res) => {
    if (Object.keys(req.body).length == 3) {

        // check user is exist
        content.insert_contact_us(req.body)
        .then(function(userdata) {
          console.log(userdata);
            if(userdata!=null)
            {
                          res.json({
                            "status": 200,
                            "api_name": "insert_contact_us",
                            "message": "Thank you for getting in touch!."
                          });
                          return;
                   
            }else
            {
                          res.json({
                            "status": 400,
                            "api_name": "insert_contact_us",
                            "message": "Data not inserted."
                          });
                          return;
            }
         });
                    
      }              
};
/**
 * @api {post} /get_privacy_policy Get privacy and policy
 * @apiGroup Frontend
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
        "status": 200,
        "api_name": "get_privacy_policy",
        "message": "Page found.",
        "data": {
            "_id": "5abe1dc758c77712747b3cec",
            "key": "Privacy and Policy",
            "value": "<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>"
        }
        }
         
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "get_privacy_policy",
          "message": "Page not found.",
          "data": {}
      }
*/
api.get_privacy_policy = (req, res) => {
    
        content.find_privacy_policy()
        .then(function(result) {
            if(result!=null)
            {
                          res.json({
                            "status": 200,
                            "api_name": "get_privacy_policy",
                            "message": "Page found.",
                            "data": result
                          });
                          return;
                   
            }else
            {
                          res.json({
                            "status": 400,
                            "api_name": "get_privacy_policy",
                            "message": "Page not found."
                          });
                          return;
            }
        });
};


exportFuns.api = api;
exportFuns.web = web;
module.exports = exportFuns;

