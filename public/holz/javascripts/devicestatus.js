function postJson() {
    
    var jsonData = "";
//    let abcs = 2e001f000947373034353237;
    var x1 = document.getElementById("jsonData").value;
    
    //get the document.getElementById("jsonData").value to become string
    jsonData += "{"+'"deviceId":'+'"'+x1+'"'+"}";
//    jsonData = document.getElementById("jsonData").value;
    var url = "/devices/history";
    var json = jsonData;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", processResponse);
    xhr.responseType = "json";
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(json);
}


//YS: revise the funtion to get the userid data

function processResponse() {
 
    var responseDiv = document.getElementById('ServerResponse');
    var responseHTML = "";

    // 201 is the response code for a successful POST request
    if (this.status === 201) {
        responseHTML += "<ol class='ServerResponse'>";

        for (var key in this.response) {
            responseHTML += "<li>" + key + ": " + this.response[key] + "</li>";
        }
        responseHTML += "</ol>"
    }
    else {
        // this.status mean it can show 200 which means that it success
        responseHTML = "<p>" + this.status + ":</p>"
        
         responseHTML += "<ol class='ServerResponse'>";
           
        for (var key of this.response) {
            responseHTML += "<li></li>";
            responseHTML += "<ul>";
         
            for (var key2 in key){
                responseHTML += "<li>" +key2+" :  "+ key[key2] +  "</li>";
            }
            responseHTML += "</ul>"
        }
    responseHTML += "</ol>"
    }

    // Update the response div in the webpage and make it visible
    responseDiv.style.display = "block";
    responseDiv.innerHTML = responseHTML;
}
document.getElementById("postJson").addEventListener("click", postJson);
$(function() {
   // If there's no authToekn stored, redirect user to 
   // the sign-in page (which is index.html)
   if (!window.localStorage.getItem("authToken")) {
      window.location.replace("index.html");
   }
   else {
//      postJson();
   }
   
   // Register event listeners,HengxinQin modify
   $("#addDevice").click(showAddDeviceForm);
   $("#registerDevice").click(registerDevice);   
   $("#cancel").click(hideAddDeviceForm); 
   $("#seeDetail").click(showSeeDetailTable);
   $("#hideTable").click(hideSeeDetailTable);
});
