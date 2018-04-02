define({ "api": [
  {
    "type": "post",
    "url": "/get_coupon",
    "title": "Get coupon",
    "group": "Coupon",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 200 OK\n   {\n\t\t\t\"status\": 200,\n\t\t\t\"api_name\": \"get_coupon\",\n\t\t\t\"message\": \"All coupons.\",\n\t\t\t\"data\": [\n\t\t\t\t{\n\t\t\t\t\t\"_id\": \"5abe2b9058c77712747b3cfa\",\n\t\t\t\t\t\"percent\": \"10\",\n\t\t\t\t\t\"multiple_use\": 1,\n\t\t\t\t\t\"coupon_code\": \"ajju\",\n\t\t\t\t\t\"expiry_date\": \"Fri Mar 30 2018 19:47:06 GMT+0530 (India Standard Time)\",\n\t\t\t\t\t\"created_at\": \"Fri Mar 30 2018 17:47:06 GMT+0530 (India Standard Time)\"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"_id\": \"5abe455d58c77712747b3d06\",\n\t\t\t\t\t\"coupon_code\": \"mapha\",\n\t\t\t\t\t\"expiry_date\": \"Mon Apr 30 2018 17:53:19 GMT+0530 (India Standard Time)\",\n\t\t\t\t\t\"created_at\": \"Fri Mar 30 2018 17:47:06 GMT+0530 (India Standard Time)\",\n\t\t\t\t\t\"multiple_use\": 1,\n\t\t\t\t\t\"persent\": \"50\"\n\t\t\t\t}\n\t\t\t]\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"get_coupon\",\n       \"message\": \"coupon invalid or expired.\"\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "Coupon",
    "name": "PostGet_coupon"
  },
  {
    "type": "post",
    "url": "/get_privacy_policy",
    "title": "Get privacy and policy",
    "group": "Frontend",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n     \"status\": 200,\n     \"api_name\": \"get_privacy_policy\",\n     \"message\": \"Page found.\",\n     \"data\": {\n         \"_id\": \"5abe1dc758c77712747b3cec\",\n         \"key\": \"Privacy and Policy\",\n         \"value\": \"<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\"\n     }\n     }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"get_privacy_policy\",\n       \"message\": \"Page not found.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/content.js",
    "groupTitle": "Frontend",
    "name": "PostGet_privacy_policy"
  },
  {
    "type": "post",
    "url": "/insert_contact_us",
    "title": "Contact us",
    "group": "Frontend",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone_no",
            "description": "<p>Phone Number</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Comment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n       \"status\": 200,\n       \"api_name\": \"insert_contact_us\",\n       \"message\": \"Thank you for getting in touch!.\"\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"insert_contact_us\",\n       \"message\": \"Data not insert.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/content.js",
    "groupTitle": "Frontend",
    "name": "PostInsert_contact_us"
  },
  {
    "type": "post",
    "url": "/change_password",
    "title": "Change Password",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user_id",
            "description": "<p>User Id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "old_password",
            "description": "<p>Old Password</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "new_password",
            "description": "<p>New Password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n       \"status\": 200,\n       \"api_name\": \"change_password\",\n       \"message\": \"You have changed password successfully.\",\n       \"data\": 1\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"change_password\",\n       \"message\": \"Old password is wrong.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "User",
    "name": "PostChange_password"
  },
  {
    "type": "post",
    "url": "/resend_otp",
    "title": "Resend OTP",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n       \"status\": 200,\n       \"api_name\": \"resend_otp\",\n       \"message\": \"OTP has been sent to your email address.\",\n       \"data\": {\n           \"user_id\": \"5ab9f851dd88353ccc65cbf2\",\n           \"user_email\": \"rajeev@gmail.com\",\n           \"otp_number\": \"23105\",\n           \"_id\": \"5aba5155a0dc7f0585a1fb98\"\n       }\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"resend_otp\",\n       \"message\": \"User email is not exist.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "User",
    "name": "PostResend_otp"
  },
  {
    "type": "post",
    "url": "/update_forgot_password",
    "title": "Update Forgot Password",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user_id",
            "description": "<p>User Id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "new_password",
            "description": "<p>New Password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n       \"status\": 200,\n       \"api_name\": \"update_forgot_password\",\n       \"message\": \"You have changed password successfully.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"update_forgot_password\",\n       \"message\": \"User doesn't exist.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "User",
    "name": "PostUpdate_forgot_password"
  },
  {
    "type": "post",
    "url": "/update_profile",
    "title": "Update Profile",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fullname",
            "description": "<p>Full name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "alternate_email",
            "description": "<p>Alternate_email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone_1",
            "description": "<p>Phone 1</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone_2",
            "description": "<p>Phone 2</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address_1",
            "description": "<p>Address_1</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address_2",
            "description": "<p>Address_2</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user_id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user_image",
            "description": "<p>User_image</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>city</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>country</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "zip_code",
            "description": "<p>zip_code</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 200 OK\n   {\n\t\t\t\"status\": 200,\n\t\t\t\"api_name\": \"update_profile\",\n\t\t\t\"message\": \"You have updated successfully\",\n\t\t\t\"data\": {\n\t\t\t\t\"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyNDc2NjA3ODY2LCJ1c2VySUQiOiI1YWJkZDQyNjAyYWNlYTM2Mjk3OGVkODcifQ.RLWoRl_qqzSfTBWsywB7yYaGjwuoGtTrFBmEM2Ifo3M\",\n\t\t\t\t\"expires\": 1522476607866,\n\t\t\t\t\"user\": {\n\t\t\t\t\t\"user_role\": 2,\n\t\t\t\t\t\"alternate_email\": \"rohit@gmail.com\",\n\t\t\t\t\t\"email\": \"rohit@gmail.com\",\n\t\t\t\t\t\"phone\": \"7877949375\",\n\t\t\t\t\t\"phone_1\": \"7877949375\",\n\t\t\t\t\t\"phone_2\": \"7877949375\",\n\t\t\t\t\t\"address\": \"jothwara,jaipur\",\n\t\t\t\t\t\"address_1\": \"jaipur jaipur\",\n\t\t\t\t\t\"address_2\": \"hariyan\",\n\t\t\t\t\t\"city\": \"jaipur\",\n\t\t\t\t\t\"state\": \"rajasthan\",\n\t\t\t\t\t\"zip_code\": \"302012\",\n\t\t\t\t\t\"country\": \"india\",\n\t\t\t\t\t\"latitude\": 26.9564325,\n\t\t\t\t\t\"longitude\": 75.74125339999999,\n\t\t\t\t\t\"facebook_login_id\": \"\",\n\t\t\t\t\t\"google_login_id\": \"\",\n\t\t\t\t\t\"social_login_data_status\": 0,\n\t\t\t\t\t\"otp_status\": 0,\n\t\t\t\t\t\"is_active\": 0,\n\t\t\t\t\t\"is_deleted\": 0,\n\t\t\t\t\t\"created_time\": \"2018-03-30T06:10:07.852Z\",\n\t\t\t\t\t\"modified_time\": \"2018-03-30T06:10:07.852Z\",\n\t\t\t\t\t\"user_image\": \"users_1522390207852498.jpg\",\n\t\t\t\t\t\"_id\": \"5abdd42602acea362978ed87\"\n\t\t\t\t}\n\t\t\t}\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n       {\n           \"status\": 400,\n           \"api_name\": \"update_profile\",\n           \"message\": \"Phone is already exist.\",\n           \"data\": {}\n       }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "User",
    "name": "PostUpdate_profile"
  },
  {
    "type": "post",
    "url": "/user_login",
    "title": "User Login",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "device_token",
            "description": "<p>Device Token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "device_type",
            "description": "<p>Device Type : android / ios</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "   {\n    \"status\": 200,\n    \"api_name\": \"user_login\",\n    \"message\": \"You have login successfully.\",\n    \"data\": {\n        \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyMzg5MzM0NzA4LCJ1c2VySUQiOiI1YWJjN2Q4YzZlYmQ0MzEyZjRiM2QyMjkifQ.FDJQCRJxwKLe_k5aOroIWmeR7j7hrKCKcL8CSbfJPsc\",\n        \"expires\": 1522389334708,\n        \"user\": {\n            \"_id\": \"5abc7d8c6ebd4312f4b3d229\",\n            \"fullname\": \"rahul soni\",\n            \"user_role\": 2,\n            \"email\": \"rahul@gmail.com\",\n            \"alternate_email\": \"\",\n            \"phone\": \"\",\n\t\t\t\"phone_1\": \"\",\n\t\t\t\"phone_2\": \"\",\n            \"address\": \"jothwara,jaipur\",\n            \"address_1\": \"\",\n            \"address_2\": \"\",\n            \"city\": \"jaipur\",\n            \"state\": \"rajasthan\",\n            \"zip_code\": \"302012\",\n            \"country\": \"india\",\n            \"latitude\": 26.9564325,\n            \"longitude\": 75.74125339999999,\n            \"password\": \"777e11fa2c71\",\n            \"user_image\": \"http://localhost:3001/uploads/default/default_user.jpg\",\n            \"facebook_login_id\": \"\",\n            \"google_login_id\": \"\",\n            \"social_login_data_status\": 0,\n            \"otp_status\": 0,\n            \"is_active\": 0,\n            \"is_deleted\": 0,\n            \"created_time\": \"2018-03-29T05:45:48.299Z\",\n            \"modified_time\": \"2018-03-29T05:45:48.299Z\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"user_login\",\n       \"message\": \"Login credentials are invalid.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "User",
    "name": "PostUser_login"
  },
  {
    "type": "post",
    "url": "/user_logout",
    "title": "User Logout",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user_id",
            "description": "<p>User Id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "device_token",
            "description": "<p>Device Token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "device_type",
            "description": "<p>Device Type : android / ios</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n       \"status\": 200,\n       \"api_name\": \"user_logout\",\n       \"message\": \"You have logout successfully.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"user_logout\",\n       \"message\": \"Some request parameters are missing.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "User",
    "name": "PostUser_logout"
  },
  {
    "type": "post",
    "url": "/user_register",
    "title": "User Register",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>last_name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>last_name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>city</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "country",
            "description": "<p>country</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "device_token",
            "description": "<p>Device Token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "device_type",
            "description": "<p>Device Type : android / ios</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "zip_code",
            "description": "<p>zip_code</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 200 OK\n   {\n\t\t\t\"status\": 200,\n\t\t\t\"api_name\": \"user_register\",\n\t\t\t\"message\": \"You have registered successfully.\",\n\t\t\t\"data\": {\n\t\t\t\t\"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyNDc2NDU0MzMxLCJ1c2VySUQiOiI1YWJkZDQyNjAyYWNlYTM2Mjk3OGVkODcifQ.cD-UKnY5O96NbVtRWuTRSN4YR6mIw4Zz6EeSuclAr74\",\n\t\t\t\t\"expires\": 1522476454331,\n\t\t\t\t\"user\": {\n\t\t\t\t\t\"fullname\": \"Rahul soni\",\n\t\t\t\t\t\"user_role\": 2,\n\t\t\t\t\t\"email\": \"rahul.soni@arthonsys.com\",\n\t\t\t\t\t\"alternate_email\": \"\",\n\t\t\t\t\t\"phone\": \"\",\n\t\t\t\t\t\"phone_1\": \"\",\n\t\t\t\t\t\"phone_2\": \"\",\n\t\t\t\t\t\"address\": \"chanpol\",\n\t\t\t\t\t\"address_1\": \"\",\n\t\t\t\t\t\"address_2\": \"\",\n\t\t\t\t\t\"city\": \"jaipur\",\n\t\t\t\t\t\"state\": \"rajasthan\",\n\t\t\t\t\t\"zip_code\": \"302012\",\n\t\t\t\t\t\"country\": \"india\",\n\t\t\t\t\t\"latitude\": 26.9243316,\n\t\t\t\t\t\"longitude\": 75.8123829,\n\t\t\t\t\t\"password\": \"777e11fa2c71\",\n\t\t\t\t\t\"user_image\": \"http://35.168.99.29:3001/uploads/default/default_user.jpg\",\n\t\t\t\t\t\"facebook_login_id\": \"\",\n\t\t\t\t\t\"google_login_id\": \"\",\n\t\t\t\t\t\"social_login_data_status\": 0,\n\t\t\t\t\t\"otp_status\": 0,\n\t\t\t\t\t\"is_active\": 0,\n\t\t\t\t\t\"is_deleted\": 0,\n\t\t\t\t\t\"created_time\": \"2018-03-30T06:07:34.322Z\",\n\t\t\t\t\t\"modified_time\": \"2018-03-30T06:07:34.322Z\",\n\t\t\t\t\t\"_id\": \"5abdd42602acea362978ed87\"\n\t\t\t\t}\n\t\t\t}\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"user_register\",\n       \"message\": \"Email is already exist.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "User",
    "name": "PostUser_register"
  },
  {
    "type": "post",
    "url": "/verify_otp",
    "title": "Verify OTP",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "otp_number",
            "description": "<p>OTP Number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n       \"status\": 200,\n       \"api_name\": \"verify_otp\",\n       \"message\": \"OTP matched successfully.\",\n       \"data\": {\n           \"user_id\": \"5ab9f851dd88353ccc65cbf2\",\n           \"email\": \"rajeev@gmail.com\"\n       }\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed",
          "content": "HTTP/1.1 400 Failed\n   {\n       \"status\": 400,\n       \"api_name\": \"verify_otp\",\n       \"message\": \"OTP is not exist.\",\n       \"data\": {}\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/controllers/user.js",
    "groupTitle": "User",
    "name": "PostVerify_otp"
  }
] });
