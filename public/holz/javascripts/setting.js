

function resetPassword() {
    var password = document.getElementById("password").value;
    var passwordReset = document.getElementById("passwordReset").value;
    var passwordResetConfirm = document.getElementById("passwordResetConfirm").value;
    var email = document.getElementById("email").value;
    var responseDiv = document.getElementById('ServerResponse');
    
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

//    if((passwordReset.length>=10)&&(passwordReset.length<=20)) {
//        passwordIsValid=true;
//        }
//        else {
//    }
  var tableHTML="";
  tableHTML += "<ul>\n";

    if( emailRe.test(email)&&email!="") {
        emailIsValid=true;
        console.log("11");
    }
        else {
            responseDiv.style.display = "block";
            tableHTML += "<li>Invalid or missing email address.</li>\n";
            console.log("1");
        }  

    if(passwordRe1.test(passwordReset)){	
           passwordIsValid2=true;
        console.log("22");
     }
     else {
         responseDiv.style.display = "block";
         tableHTML += "<li>Password must contain at least one lowercase character.</li>\n";
         console.log("2");
     }
 
    if(passwordRe2.test(passwordReset)){

          passwordIsValid3=true;
        console.log("33");
     }
     else {
         responseDiv.style.display = "block";
         tableHTML += "<li>Password must contain at least one uppercase character.</li>\n";
         console.log("3");
     }

 
    if(passwordRe3.test(passwordReset)){

            if((passwordReset==passwordResetConfirm)&&(passwordResetConfirm!=="")) {
                passwordIsValid4=true;
                console.log("44");
            }
            else {
                responseDiv.style.display = "block";
                tableHTML += "<li>Password and confirmation password don't match.</li>\n";
                console.log("4");
            }
    }
    else {
        console.log("5");
        responseDiv.style.display = "block";
        tableHTML += "<li>Password must contain at least one digit.</li>\n";
    }
    tableHTML += "</ul>\n";
    responseDiv.innerHTML = tableHTML;
    if(emailIsValid==true && passwordIsValid2==true && passwordIsValid3==true && passwordIsValid4==true){
      console.log("66");

    }
    else {
        console.log("6");
    return;
    }

    
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", signUpResponse);
  xhr.responseType = "json";
  xhr.open("PUT", '/users/resetpassword');
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify({email:email, password:password, passwordreset:passwordReset}));
}

function signUpResponse() {
    if (this.status === 200) {
    
      // Change current location to the signin page.
      window.localStorage.removeItem("authToken");
      window.location = "index.html";
        console.log("1");
    } 
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("reset").addEventListener("click", resetPassword);
});
//var map = null;

//function responseReceivedHandler() {
//       console.log("handling response: " + this.status);
//     }

//function sendReqForSignin() {
//  var xhr = new XMLHttpRequest();
//  xhr.addEventListener("load", signUpResponse);
//  xhr.responseType = "json";
//  xhr.open("POST", '/users/register');
//  xhr.setRequestHeader("Content-type", "application/json");
//  xhr.send(JSON.stringify({email:email,fullName:fullName, password:password}));
//}
//
//document.addEventListener("DOMContentLoaded", function() {
//  document.getElementById("fuck").addEventListener("click", sendReqForSignin);
//});


//document.getElementById("fuck").addEventListener("click", sendReqForSignin);
//function getRecentPotholes() {
//    var token = window.localStorage.getItem("authToken");
//    var xhr = new XMLHttpRequest();
//    xhr.addEventListener("load", displayMostRecentPothole);
//    xhr.responseType = "json";   
//    xhr.open("GET", "/potholes/recent/14");
//    xhr.setRequestHeader("x-auth", token);
//    xhr.send();
//}

//function displayMostRecentPothole() {
//   document.getElementById("main").style.display = "block";
//
//   if (this.status === 200) {
//	   // If there's at least one pothole, draw the map
//	   var latitude = 32.2319;
//	   var longitude = -110.9501;
//      var potholeReport = "No potholes have been reported in the last three days.";
//   
//	   if (this.response.potholes.length > 0) {
//	      var latitude = this.response.potholes[this.response.potholes.length-1].latitude;
//	      var longitude = this.response.potholes[this.response.potholes.length-1].longitude;
//		
//	      // Add descriptive text of the pothole recently reported 
//	      potholeReport = this.response.potholes.length +
//		                  " potholes have been reported in the last three days. The most recent pothole (shown above) was hit " +
//		                  this.response.potholes[this.response.potholes.length-1].totalHits + " times.";
//	   }
//	    
//	   potholeText.innerHTML = potholeReport;
//	   // Create a map centered at the most recent pothole location
//      var uluru = {lat: latitude, lng: longitude};
//      var map = new google.maps.Map(document.getElementById('map'), {
//		   zoom: 9,
//		   center: uluru
//	   });
//	    
//	   // Add markers for all potholes            
//      for (var pothole of this.response.potholes) {
//         uluru = {lat: pothole.latitude, lng: pothole.longitude};
//         var marker = new google.maps.Marker({
//            position: uluru,
//            map: map,
//            label: {
//               text: "" + pothole.totalHits,
//               color: 'black',
//               fontSize: "10px"
//            },
//		   });
//      }                
//    }
//    else if (this.status === 401) {
//        window.localStorage.removeItem("authToken");
//        window.location = "index.html";
//    }
//    else {
//        potholeText.innerHTML = "Error communicating with server.";
//    }    
//}
//
//// Executes once the google map api is loaded, and then sets up the handler's and calls
//// getRecentPotholes() to display the recent potholes
//function initRecent() {
//    // Allow the user to refresh by clicking a button.
//    document.getElementById("refreshRecent").addEventListener("click", getRecentPotholes);
//    getRecentPotholes();
//}
//
//// Handle authentication on page load
//$(function() {
//   // If there's no authToekn stored, redirect user to 
//   // the sign-in page (which is index.html)
//   if (!window.localStorage.getItem("authToken")) {
//      window.location.replace("index.html");
//   }
//});
