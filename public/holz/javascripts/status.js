function sendReqForAccountInfo() {
   $.ajax({
      url: '/users/account',
      type: 'GET',
      headers: { 'x-auth': window.localStorage.getItem("authToken") },
      responseType: 'json',
      success: accountInfoSuccess,
      error: accountInfoError
   });
}

function accountInfoSuccess(data, textSatus, jqXHR) {
   $("#email").html(data.email);
   $("#fullName").html(data.fullName);
   $("#lastAccess").html(data.lastAccess);
   $("#main").show();
//   $("#activityDuration").html("100min");
//   $("#calories").html("5400colories");
//   $("#UVexposure").html("54");
    
    
   var prepString = ""
   // Add the devices to the list before the list item for the add device button (link)
   for (var device of data.devices) {
//      $("#addDeviceForm").before("<li class='collection-item'>ID: " +
//        device.deviceId + ", APIKEY: " + device.apikey+"<button id ="+'"device1"'+">Remove</button>"+"</li>")
       prepString += "<li class='collection-item' id='" + device.deviceId + "'>ID: " + device.deviceId + ", APIKEY: " + device.apikey + "<a class=' Remove waves-effect waves-light col' href='#!' id='removeId' onclick='dropDevice(\""+device.deviceId+"\")'>Remove</a>" + "</li>";

   
   }
//    $(".aaa").addClass("d-none");
    $("#insert").html(prepString);
}


function accountInfoError(jqXHR, textStatus, errorThrown) {
   // If authentication error, delete the authToken 
   // redirect user to sign-in page (which is index.html)
   if( jqXHR.status === 401 ) {
      console.log("Invalid auth token");
      window.localStorage.removeItem("authToken");
      window.location.replace("index.html");
   } 
   else {
     $("#error").html("Error: " + status.message);
     $("#error").show();
   } 
}

// Registers the specified device with the server.
function registerDevice() {
    $.ajax({
        url: '/devices/register',
        type: 'POST',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },   
        data: { deviceId: $("#deviceId").val() }, 
        responseType: 'json',
        success: function (data, textStatus, jqXHR) {
           // Add new device to the device list
           $("#addDeviceForm").before("<li class='collection-item'>ID: " +
           $("#deviceId").val() + ", APIKEY: " + data["apikey"] + "</li>")
           hideAddDeviceForm();
        },
        error: function(jqXHR, textStatus, errorThrown) {
//            var response = JSON.parse(jqXHR.responseText);
//            $("#error").html("Error: " + response.message);
            $("#error").show();
        }
    }); 
}

// Show add device form and hide the add device button (really a link)
function showAddDeviceForm() {
   $("#deviceId").val("");           // Clear the input for the device ID
   $("#addDeviceControl").hide();    // Hide the add device link
   $("#addDeviceForm").slideDown();  // Show the add device form
}

// Hides the add device form and shows the add device button (link)
function hideAddDeviceForm() {
   $("#addDeviceControl").show();  // Hide the add device link
   $("#addDeviceForm").slideUp();  // Show the add device form
   $("#error").hide();
}


function jumpToHistory() {
    window.location = "history.html";
}
document.getElementById("seeHistory").addEventListener("click", jumpToHistory);


function dropDevice(devID) { 
	console.log(devID + " removed"); 
	$.ajax({
        url: '/devices/delete',
        type: 'DELETE',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },   
        data: { deviceId: devID, 
		email: $("#email").val() }, 
        responseType: 'json',
        success: function (data, textStatus, jqXHR) {
           // Add new device to the device list
			location.reload(true);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();
        }
    }); 
}

//Hengxin modify
function showSeeDetailTable() {
   $("#SeeDetailControl").hide();    
   $("#SeeDetailTable").slideDown();
}
function hideSeeDetailTable() {
   $("#SeeDetailControl").show();  
   $("#SeeDetailTable").slideUp();
   $("#error").hide();
}
//up to here
//fake speed data

function postJson() {
    
    var jsonData = "";
    
    //get the document.getElementById("jsonData").value to become string
    jsonData += "{"+'"deviceId":'+'"270025000a47363339343638"'+"}";
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
 
//    var test = document.getElementById('testspeed');
//    testspeed.innerHTML = this.response[0].gpsSpeed;
    var activityDurationTest=document.getElementById("activityDuration");
    var caloriesTest=document.getElementById("calories");
	var UVexposureTest=document.getElementById("UVexposure");
     var testbody = document.getElementById('testbody');

        var testtest = this.response;
    testtest = testtest.sort(function (a, b) {
 return a.date < b.date ? 1 : -1;
});
        var test1 = testtest[0].date;
        var test2 = testtest[0].date-10000;
        var test3 = testtest[0].date-20000;
        var test4 = testtest[0].date-30000;
        var test5 = testtest[0].date-40000;
        var test6 = testtest[0].date-50000;
        var test7 = testtest[0].date-60000;
    
    var responseHTML = "";

    
var sumDistance = 0;
var sumCol = 0;
var sumDuration = 0;
var sumUv = 0
//calculte for seven days
for (var countToSeven = 7;  countToSeven>0;countToSeven--){
    
    
var tempData = [];
var data = 0;
// filter by date
for ( var index=0; index<this.response.length; index++ ) {
    if ( testtest[index].date == test1 ) {
        tempData.push( testtest[index] );
    }
}
data = tempData;
var tempData = [];
var actIdNum = [];
    
// descend by actId    
    data = data.sort(function (a, b) {
    return a.actId < b.actId ? 1 : -1;
    });

//if the there is no data in a date, we will only show the zero value and day
if(data.length!=0){

//var data = 0;
console.log(data);
for ( var index=0; index+1<data.length; index++ ) {
    if ( data[index].actId != data[index+1].actId ) {
        actIdNum.push(data[index].actId);}
}
    actIdNum.push(data[data.length-1].actId);
    console.log(actIdNum);

var y =0;
var gpsSpeed = 0;
var uvValue = 0;
var j = 0;
var tempData = [];
var tpyeActivity = "";
var timeDuration = [];
var timeDuration2 = 0;
var maxTime = 0;
var minTime = 0;
var totalDistance = 0;
for ( var index=0; index+1<data.length; index++ ) {
        if(data[index].actId == actIdNum[j]) {
        gpsSpeed=gpsSpeed+data[index].gpsSpeed;
        uvValue=uvValue+data[index].uvValue;
        y=y+1;
            
        timeDuration.push(data[index].time);
        


        
//              tempData.push( data );
    }
    else{   
            maxTime = Math.max.apply(null,timeDuration);
            console.log(maxTime);
            minTime = Math.min.apply(null,timeDuration);
            console.log(minTime);
            timeDuration2 = maxTime - minTime;
            totalDistance= (gpsSpeed/y)*(timeDuration2/100);
            sumDistance = totalDistance+sumDistance;
            sumDuration=timeDuration2+sumDuration;
            tpyeActivity = "";
            maxTime = 0;
            minTime = 0;
//            timeDuration =[];
            totalDistance=0;
            j=j+1;
            
             }
    }

    
tpyeActivity = "";
maxTime = 0;
minTime = 0;
//timeDuration =[];
totalDistance=0;
var y =0;
var gpsSpeed = 0;
var uvValue = 0;
for ( var index=0; index+1<data.length; index++ ) {
    if ( data[index].actId == actIdNum[actIdNum.length-1] ) {
        gpsSpeed=gpsSpeed+data[index].gpsSpeed;
        uvValue=uvValue+data[index].uvValue;
        totalDistance= (gpsSpeed/y)*(timeDuration2/100);
        y=y+1;
        sumDistance = totalDistance+sumDistance;
        sumDuration=timeDuration2+sumDuration;

        
    }
}

            tpyeActivity = "";
            maxTime = 0;
            minTime = 0;
//            timeDuration =[];
            totalDistance=0;
            j=j+1;
}else{

}
            test1=test1-10000;
}
    activityDurationTest.innerHTML = sumDuration/10000+"  Mins";
    caloriesTest.innerHTML = 7*sumDuration/(10000*1.3)+"  Calorie";
	UVexposureTest.innerHTML = 7*Math.floor((Math.random() * 100) + 1);
   
    
}
//document.getElementById("seeHistory").addEventListener("click", postJson);




// Handle authentication on page load
$(function() {
   // If there's no authToekn stored, redirect user to 
   // the sign-in page (which is index.html)
   if (!window.localStorage.getItem("authToken")) {
      window.location.replace("index.html");
   }
   else {
      sendReqForAccountInfo();
       postJson();
       console.log("ssss");
   }
   
   // Register event listeners,HengxinQin modify
   $("#addDevice").click(showAddDeviceForm);
   $("#registerDevice").click(registerDevice);   
   $("#cancel").click(hideAddDeviceForm); 
   $("#seeDetail").click(showSeeDetailTable);
//   $("#hideTable").click(hideSeeDetailTable);
});
