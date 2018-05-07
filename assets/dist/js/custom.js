// validation of add user
$( document ).ready(function() {
// validation of Add/edit coupon
$('form[id="admin_profile"]').validate({
  rules: {
    fullname: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
      maxlength:50
    },
    email: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      email:true
    },
    phone: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      maxlength:14
    },
    address:{
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      maxlength:100
    },
    profile:{
     
    }
  },
  submitHandler: function(form) {
    form.submit();
  }
});
// End
$('form[id="update_admin_password"]').validate({
  rules: {
    old_password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 6,
    },
    new_password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 6,
    },
    confirm_password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        },
      },
      equalTo: "#new_password",
      minlength: 6,
    }
  },
  messages: {
    confirm_password:{equalTo:'password not match'}
  },
  submitHandler: function(form) {
    form.submit();
  }
});
$('form[id="user_update_password"]').validate({
  rules: {
    new_password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 6,
    },
    confirm_password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        },
      },
      equalTo: "new_password",
      minlength: 6,
    }
  },
  messages: {
    confirm_password:{equalTo:'password not match'}
  },
  submitHandler: function(form) {
    form.submit();
  }
});
$('form[id="add_user"]').validate({
  rules: {
    fullname: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    email: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
      email: true
    },
    password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 5,
    },
    confirm_password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 5,
      equalTo: "#password"
    },
    phone: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 10,
    },
    address: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    city: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    state: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    country: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    zip_code: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    profile: {
      required: true,
      extension: "xls|csv"
    }
  },
  messages: {
    fullname: 'This field is required',
    confirm_password:{equalTo:'password not match'}
  },
  submitHandler: function(form) {
    form.submit();
  }
});

// End


// validation of Edit user
$('form[id="edit_user"]').validate({
  rules: {
    fullname: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    email: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
      email: true
    },
    password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 5,
    },
    confirm_password: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 5,
      equalTo: "password"
    },
    phone: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 10,
    },
    address: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    city: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    state: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    country: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    zip_code: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    }
  },
  messages: {
    fullname: 'This field is required',
    confirm_password:{equalTo:'password not match'}
  },
  submitHandler: function(form) {
    form.submit();
  }
});
// End

// validation of Add/edit coupon
$('form[id="add_coupon"]').validate({
  rules: {
    coupon_code: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
    },
    expiry_date: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
    },
    percent: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      max: 100,
      maxlength:3
    },
    service_ids:{
      required: true
     
    }
  },
  messages: {
   
  },
  submitHandler: function(form) {
    form.submit();
  }
});
// End


// validation of Query Reply form
$('form[id="frmReply"]').validate({
  rules: {
    reply: {
      required: true
    }    
  },
  messages: {
   
  },
  submitHandler: function(form) {
    form.submit();
  }
});
// End

// validation of Payment setting
$('form[id="payment_setting"]').validate({
  rules: {
    stripe_email: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      email:true,
      minlength: 3,
      maxlength:30
    },
    stripe_secret_key: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      minlength: 3,
      maxlength:50
    },
    stripe_publishable_key: {
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
    },
    stripe_mode:{
      required: {
        depends:function(){
            $(this).val($.trim($(this).val()));
            return true;
        }
      },
      maxlength:50
    }
  },
  messages: {
   
  },
  submitHandler: function(form) {
    form.submit();
  }
});
// End

// validation of Add Service
$('form[id="frm_postservice"]').validate({
  rules: {
	service_category_id : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
	},
	service_name  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50
	},
	service_radius  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	service_availability :  {
		required: true
	},
	cancel_hours  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	cancel_fee  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	reschedule_hours  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	reschedule_fee :  {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	address  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50
	},
	city :  {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 30
	},
	province  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 30
	},
	zipcode :  {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 30
	},
	fileupload1  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
	}
  },
  messages: {
   
  },
  submitHandler: function(form) {
    form.submit();
  }
});
// End


// validation of Add Service
$('form[id="frm_updateservice"]').validate({
  rules: {
	service_category_id : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
	},
	service_name  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50
	},
	service_radius  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	service_availability :  {
		required: true
	},
	cancel_hours  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	cancel_fee  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	reschedule_hours  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	reschedule_fee :  {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		digits: true
	},
	address  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50
	},
	city :  {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 30
	},
	province  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 30
	},
	zipcode :  {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 30
	},	
  },
  messages: {
   
  },
  submitHandler: function(form) {
    form.submit();
  }
});
//End
// validation of Notification settings form
$('form[id="frmnotification"]').validate({
  rules: {
	ios_keyid : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50
	},
	ios_teamid  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50
	},
	ios_app_bundleid  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50
	},
	android_fcm_key  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
	},	
  },
  messages: {
   
  },
  submitHandler: function(form) {
    form.submit();
  }
});
// End
// validation of Notification settings form
$('form[id="frmemailsetting"]').validate({
  rules: {
	admin_email : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50,
		email:true
	},
	developer_email  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50,
		email:true
	},
	email_authentication_service  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
        maxlength: 50
	},
	email_authentication_user  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
		maxlength: 50,
		email:true
	},	
	email_authentication_password  : {
		required: {
      depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
      }
    },
		minlength: 3,
		maxlength: 20
	},
  },
  messages: {
   
  },
  submitHandler: function(form) {
    form.submit();
  }
});
// End
});


