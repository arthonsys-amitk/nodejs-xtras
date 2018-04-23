$('#update_password').submit(function(e){
$('#success_alert').show();
	e.preventDefault();
	var new_password=$('#new_password').val();
	var old_password=$('#old_password').val();
	var user_id=$('#user_id').val(); 
	  $.ajax({
	         data: {new_password:new_password,old_password:old_password,user_id:user_id},
	         type: "post",
	         url: "/admin/update_password",
	         success: function(data){
	         		$('#old_password').val('');
	         		$('#new_password').val('');
	        		$('#success_alert').html(data);
	        		$('#success_alert').fadeOut(3000);
	         }
	  });
  })
