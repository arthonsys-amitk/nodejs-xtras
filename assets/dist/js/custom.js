// validation of add user
$( document ).ready(function() {
$('form[id="add_user"]').validate({
  rules: {
    fullname: {
      required: true,
      minlength: 3,
    },
    email: {
      required: true,
      minlength: 3,
      email: true
    },
    password: {
      required: true,
      minlength: 5,
    },
    confirm_password: {
      required: true,
      minlength: 5,
      equalTo: "#password"
    },
    phone: {
      required: true,
      minlength: 10,
    },
    address: {
      required: true,
      minlength: 3,
    },
    city: {
      required: true,
      minlength: 3,
    },
    state: {
      required: true,
      minlength: 3,
    },
    country: {
      required: true,
      minlength: 3,
    },
    zip_code: {
      required: true,
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
      required: true,
      minlength: 3,
    },
    email: {
      required: true,
      minlength: 3,
      email: true
    },
    password: {
      required: true,
      minlength: 5,
    },
    confirm_password: {
      required: true,
      minlength: 5,
      equalTo: "password"
    },
    phone: {
      required: true,
      minlength: 10,
    },
    address: {
      required: true,
      minlength: 3,
    },
    city: {
      required: true,
      minlength: 3,
    },
    state: {
      required: true,
      minlength: 3,
    },
    country: {
      required: true,
      minlength: 3,
    },
    zip_code: {
      required: true,
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
      required: true,
      minlength: 3,
    },
    expiry_date: {
      required: true,
    },
    percent: {
      required: true,
      max: 100,
      maxlength:3
    },
    service_ids:{
      required: true,
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
      required: true,
      email:true,
      minlength: 3,
      maxlength:30
    },
    stripe_secret_key: {
      required: true,
      minlength: 3,
      maxlength:30
    },
    stripe_publishable_key: {
      required: true
    },
    stripe_mode:{
      required: true,
      maxlength:30
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
		required: true,
	},
	service_name  : {
		required: true,
		minlength: 3,
        maxlength: 50
	},
	service_radius  : {
		required: true,
		digits: true
	},
	service_availability :  {
		required: true,
	},
	cancel_hours  : {
		required: true,
		digits: true
	},
	cancel_fee  : {
		required: true,
		digits: true
	},
	reschedule_hours  : {
		required: true,
		digits: true
	},
	reschedule_fee :  {
		required: true,
		digits: true
	},
	address  : {
		required: true,
		minlength: 3,
        maxlength: 50
	},
	city :  {
		required: true,
		minlength: 3,
        maxlength: 30
	},
	province  : {
		required: true,
		minlength: 3,
        maxlength: 30
	},
	zipcode :  {
		required: true,
		minlength: 3,
        maxlength: 30
	},
	fileupload1  : {
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
});


