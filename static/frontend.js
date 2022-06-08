$(document).ready(function(){
   // loginBtn clicked
   $("#loginBtn").click(function(){
      login();
   });

   // signupBtn clicked
   $("#signupBtn").click(function(){
      signup();
   });
});


function showError(msg){
   $(".errorMsg").html(msg).show(0);
}

function hideError(){
   $(".errorMsg").html("").hide(0);
}

function disableForm(){
   $("form *").attr("disabled", "disabled");
}

function enableForm(){
   $("form *").removeAttr("disabled");
}


//login process
function login(){
   var email = $("#email").val();
   var password = $("#password").val();
   hideError();

   if(email.trim() == ""){
      showError("Email is required")
   }else if(password.trim() == ""){
      showError("Password is required")
   }else{
      $.ajax({
         type: 'post',
         url: 'login',
         data: JSON.stringify({
            email: email,
            password: password
         }),
         contentType: "application/json; charset=utf-8",
         dataType: 'json',
         beforeSend: function(){
            disableForm();
         },
         success: function (data) {
            if(data.status == "success"){
               window.location = "/";
            }else{
               showError(data.message);
               enableForm();
            }
         },
         error: function(){
            showError("Failed to connect to server");
            enableForm();
         }
      });
   }
}



//signup process
function signup(){
   var name = $("#name").val();
   var email = $("#email").val();
   var password = $("#password").val();
   hideError();

   if(name.trim() == ""){
      showError("Full name is required")
   }else if(email.trim() == ""){
      showError("Email is required")
   }else if(password.trim() == ""){
      showError("Password is required")
   }else{
      $.ajax({
         type: 'post',
         url: 'signup',
         data: JSON.stringify({
            name: name,
            email: email,
            password: password
         }),
         contentType: "application/json; charset=utf-8",
         dataType: 'json',
         beforeSend: function(){
            disableForm();
         },
         success: function (data) {
            if(data.status == "success"){
               var html = "<br><br><br>Signup successfully, please <a href='login'>Login</a>";
               $(".formContainer").html(html);
            }else{
               showError(data.message);
               enableForm();
            }
         },
         error: function(){
            showError("Failed to connect to server");
            enableForm();
         }
      });
   }
}
