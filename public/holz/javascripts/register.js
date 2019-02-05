//Hengxinqin modify
function sendReqForSignup() {
  var email = document.getElementById("email");
  var fullName = document.getElementById("fullName");
  var password = document.getElementById("password");
  var passwordConfirm = document.getElementById("passwordConfirm");
  var responseDiv = document.getElementById('ServerResponse');

    
    
  var fullNameIsValid=false;
var emailIsValid=false;
var passwordIsValid=false;
var passwordIsValid1=false;
var passwordIsValid2=false;
var passwordIsValid3=false;
var passwordIsValid4=false;
    
    
  var emailRe = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
  var passwordRe1 = /[a-z]+/;
  var passwordRe2 = /[A-Z]+/;
  var passwordRe3 = /\d+/;

  var tableHTML="";
  tableHTML += "<ul>\n";

  // FIXME: More thorough validation should be performed here. 

if(fullName.value.length>=1) {
       fullName.classList.remove("error");
       fullNameIsValid=true;
    }
    else {
	responseDiv.style.display = "block";
        fullName.classList.add("error");//当错误时，顺便显示内容 block
        tableHTML += "<li>Missing full name.</li>\n";
        
    }

  
if((password.value.length>=10)&&(password.value.length<=20)) {
        password.classList.remove("error");
    passwordIsValid=true;
    }
    else {
	responseDiv.style.display = "block";
        password.classList.add("error");
        tableHTML += "<li>Password must be between 10 and 20 characters.</li>\n";
        
    }


if( emailRe.test(email.value)&&email.value!="") {
        email.classList.remove("error");
    emailIsValid=true;
    }
    else {
	responseDiv.style.display = "block";
        email.classList.add("error");
        tableHTML += "<li>Invalid or missing email address.</li>\n";
       
    }  

   if(passwordRe1.test(password.value)){
	password.classList.remove("error");	
       passwordIsValid2=true;
 }
 else {
	responseDiv.style.display = "block";
 	password.classList.add("error");
   	tableHTML += "<li>Password must contain at least one lowercase character.</li>\n";
   
 }
 
  if(passwordRe2.test(password.value)){
	password.classList.remove("error");	
      passwordIsValid3=true;
 }
 else {
	responseDiv.style.display = "block";
 	password.classList.add("error");
   	tableHTML += "<li>Password must contain at least one uppercase character.</li>\n";
   
 }
  
 if(passwordRe3.test(password.value)){
	password.classList.remove("error");	
            if((password.value==passwordConfirm.value)&&(passwordConfirm.value!=="")) {
                    passwordConfirm.classList.remove("error");
                passwordIsValid4=true;
            }
            else {
		 responseDiv.style.display = "block";
                 passwordConfirm.classList.add("error");
                 tableHTML += "<li>Password and confirmation password don't match.</li>\n";
                 
             }
   }
 else {
   responseDiv.style.display = "block";
   password.classList.add("error");
   tableHTML += "<li>Password must contain at least one digit.</li>\n";
   
 }

 tableHTML += "</ul>\n";
 responseDiv.innerHTML = tableHTML;
//YS: if all valid is true, the user can register the account
        if(fullNameIsValid==true &&  emailIsValid==true &&   passwordIsValid==true
        && passwordIsValid2==true && passwordIsValid3==true && passwordIsValid4==true){
        var a = 123;

        }
        else {
           return;
        }

//up to here
  
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", signUpResponse);
  xhr.responseType = "json";
  xhr.open("POST", '/users/register');
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify({email:email.value,fullName:fullName.value, password:password.value}));
}

function signUpResponse() {
  // 200 is the response code for a successful GET request
  if (this.status == 201) {
    if (this.response.success) {
      // Change current location to the signin page.
      window.location = "index.html";
        console.log("1");
    } 
    else {
      responseHTML += "<ol class='ServerResponse'>";
      for (key in this.response) {
        responseHTML += "<li> " + key + ": " + this.response[key] + "</li>";
           console.log("2");
      }
      responseHTML += "</ol>";
    }
       console.log("3");
       window.location = "index.html";
  }
  else {
    // Use a span with dark red text for errors
    responseHTML = "<span class='red-text text-darken-2'>";
    responseHTML += "Error: " + this.response.error;
    responseHTML += "</span>"
       console.log("4");
  }

  // Update the response div in the webpage and make it visible
  responseDiv.style.display = "block";
  responseDiv.innerHTML = responseHTML;
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("signup").addEventListener("click", sendReqForSignup);
});
