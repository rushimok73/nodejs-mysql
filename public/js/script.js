var pwd_state=false, email_state=false, phone_state=false, cpwd_state=false;
$('document').ready(function(){

  $("#submit_btn").attr("disabled", true);
  $("#ConfirmUserPassword").attr("disabled", true);

  $('#UserEmail').on('blur', function(){
    var UserEmail = $('#UserEmail').val();
    if(UserEmail.length > 0){
      if(!isEmail(UserEmail)){
        $('#emailHelp').text("Enter a valid email-id");
        $('#emailHelp').parent().addClass("alert alert-danger mt-4");
        email_state = false;
      }else{
        $.ajax({
          url: '/auth/checkfields/email',
          type: 'post',
          data: {
          	'UserEmail' : UserEmail,
          },
          success: function(response){
            if(response.message == "Exists"){
              $('#emailHelp').text("Email already exists. Please try another one");
              $('#emailHelp').parent().addClass("alert alert-danger mt-4");
              email_state = false;
            }else{
              $('#emailHelp').text("");
              $('#emailHelp').parent().removeClass("alert alert-danger mt-4");
              email_state = true;
            }
          }
        });
      }
    }

    buttonstate();
  })

  $('#UserPhoneNumber').on('blur', function(){
    var UserPhoneNumber = $('#UserPhoneNumber').val();
    if(UserPhoneNumber.length >0){
      if(!($.isNumeric(UserPhoneNumber) && UserPhoneNumber.length==10)){
        $('#phoneHelp').text("Enter a valid phone number");
        $('#phoneHelp').parent().addClass("alert alert-danger mt-4");
        phone_state = false;
      }else{
        $.ajax({
          url: '/auth/checkfields/phoneno',
          type: 'post',
          data: {
          	'UserPhoneNumber' : UserPhoneNumber,
          },
          success: function(response){
            if(response.message == "Exists"){
              $('#phoneHelp').text("Phone number already exists. Please try another one");
              $('#phoneHelp').parent().addClass("alert alert-danger mt-4");
              phone_state = false;
            }else{
              $('#phoneHelp').text("");
              $('#phoneHelp').parent().removeClass("alert alert-danger mt-4");
              phone_state = true;
            }
          }
        });
      }
    }

    buttonstate();
  })
  
  var UserPassword;
  $('#UserPassword').on('blur', function(){
    UserPassword = $('#UserPassword').val();
    if (UserPassword.length > 0) {
      if(!isPassword(UserPassword)){
        $('#passwordHelp').text("Enter a valid password");
        $('#passwordHelp').parent().addClass("alert alert-danger mt-4");
        pwd_state = false;
      }else{
        $('#passwordHelp').text("");
        $('#passwordHelp').parent().removeClass("alert alert-danger mt-4");
        pwd_state = true;
      }
    }

    if(pwd_state){
      $("#ConfirmUserPassword").attr("disabled", false);
    }else{
      $("#ConfirmUserPassword").attr("disabled", true);
    }

    buttonstate();
  })

  $('#ConfirmUserPassword').on('blur', function(){
    var ConfirmUserPassword = $('#ConfirmUserPassword').val();
    if(ConfirmUserPassword.length>0){
      if (UserPassword !== ConfirmUserPassword) {
        $('#cpasswordHelp').text("Passwords dont match!");
        $('#cpasswordHelp').parent().addClass("alert alert-danger mt-4");
        cpwd_state = false;
      }else{
        $('#cpasswordHelp').text("");
        $('#cpasswordHelp').parent().removeClass("alert alert-danger mt-4");
        cpwd_state = true;
      }
    }

    buttonstate();
  })

})

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function isPassword(password){
  var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  if(password.match(decimal))
  {
    return true;
  }
  else
  {
    return false;
  }
}

function buttonstate(){
  console.log("huh");
  if(email_state && phone_state && pwd_state && cpwd_state){
    $("#submit_btn").attr("disabled", false);
  }else{
    $("#submit_btn").attr("disabled", true);
  }
  return;
}
