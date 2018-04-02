var assert = require('assert'),
    request = require('request'),
    _ = require('lodash'),
    config = require('../config'),
    apiServer = `http://localhost:${config.expressPort}/API/user`,
    loginServer = `http://localhost:${config.expressPort}/login`,
    querystring = require('querystring'),
    newUserID = null,
    securityToken = null;

describe('Users API', function() {
  var server;
  before((done)=>{
    server = require('../server');
    let postData = querystring.stringify({
      email : 'god@zencolor.com',
      password : 'qwerty?><MNB'
    });

    request.post(loginServer, {form: postData}, function (error, response, body){
      let payload = JSON.parse(body);
      securityToken = payload.token;
      done();
    });
  });

  after(()=>{
    server.close();
  });

  describe('CREATE USER', function() {
    it('creates a user', function (done) {

      let postData = querystring.stringify({
        email : 'test@zencolor.com',
        password : 'testing',
        role : 'admin'
      });

      request.post({url:apiServer, headers:{'x-access-token':securityToken}, form: postData}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let newUser = JSON.parse(body);
            newUserID = newUser._id;
            assert.equal(newUser.email, "test@zencolor.com");
            done();
        }
      });

    });
  });

  describe('GET USER', function(){
    it('gets a user by ID', function(done){
      request.get({url:`${apiServer}/${newUserID}`, headers:{'x-access-token':securityToken}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let user = JSON.parse(body);
            assert.equal(user.email, "test@zencolor.com");
            done();
        }
      });
    });

    it('finds users by email', function(done){
      let postData = querystring.stringify({
        email : 'test@zencolor.com'
      });

      request.post({url:`${apiServer}/search`, headers:{'x-access-token':securityToken}, form: postData}, function (error, response, body) {
        if (!error && response.statusCode == 200){
            let accounts = JSON.parse(body);

            assert.notEqual(accounts.length, 0);
            assert.ok(_.find(accounts, (i)=>{return i._id == newUserID;}));
            done();
        }
      });
    });
  });

  describe('AUTHENTICATE USER', function(){
    it('authenticates a username and password', function(done){
      let postData = querystring.stringify({
        email : 'test@zencolor.com',
        password : 'testing'
      });

      request.post({url:loginServer, form: postData}, function (error, response, body){

        if (!error && response.statusCode == 200){
          let payload = JSON.parse(body);
          assert.ok(payload.token);
          assert.equal(payload.user.email, 'test@zencolor.com');
          done();
        }
      });
    });
  });

  describe('UPDATE USER', function(){
    it('updates a user', function(done){
      request.get({url:`${apiServer}/${newUserID}`, headers:{'x-access-token':securityToken}}, function (error, response, body) {
        if (!error && response.statusCode == 200){
          let user = JSON.parse(body);
          user.role = 'user';
          request.put({url:apiServer, headers:{'x-access-token':securityToken}, form: user}, function (error, response, body){
            if (!error && response.statusCode == 200){
              let numUpdated = JSON.parse(body);
              assert.equal(numUpdated, 1);
              request.get({url:`${apiServer}/${newUserID}`, headers:{'x-access-token':securityToken}}, function (error, response, body) {
                if (!error && response.statusCode == 200){
                    let newUser = JSON.parse(body);
                    assert.equal(newUser.role, 'user');
                    done();
                }
              });
            }
          });
        }
      });
    });
  });

  describe('UPDATE PASSWORD', function(){
      it('updates a user password', function(done){
        let postData = querystring.stringify({
          _id : newUserID,
          password : 'changed'
        });


        request.put({url:`${apiServer}/updatePassword`, headers:{'x-access-token':securityToken}, form: postData}, function (error, response, body){

          if (!error && response.statusCode == 200){
            let numUpdated = JSON.parse(body);
            assert.equal(numUpdated, 1);

            let newPostData = querystring.stringify({
              email : 'test@zencolor.com',
              password : 'changed'
            });

            request.post({url:loginServer, form:newPostData}, function (error, response, body){

              if (!error && response.statusCode == 200){
                let payload = JSON.parse(body);
                assert.ok(payload.token);
                assert.equal(payload.user.email, 'test@zencolor.com');
                done();
              }
            });

          }
        });

      });
  });

  describe('DELETE USER', function(){
    it('deletes a user', function(done){
      request.delete({url:apiServer, headers:{'x-access-token':securityToken}, form: {_id:newUserID}}, function (error, response, body){
        if (!error && response.statusCode == 200){
          let numDeleted = JSON.parse(body);
          assert.equal(numDeleted, 1);
          request.get({url:`${apiServer}/${newUserID}`, headers:{'x-access-token':securityToken}}, function (error, response, body){
            let user = JSON.parse(body);
            assert.equal(user, null);
              done();
            });
        }
      });
    });
  });

});
