document.addEventListener("DOMContentLoaded", function() {
   document.getElementById('signout').addEventListener('click', function() {
      window.localStorage.removeItem("authToken");
      window.location = "index.html";
   });
});

//go to the endpoint and see the raw data
//document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById('emailLink').addEventListener('click', function() {
//      window.location = ("http://ec2-18-221-45-184.us-east-2.compute.amazonaws.com:3000/photon/hit/"+$("#emailId").val());
//   });
//});