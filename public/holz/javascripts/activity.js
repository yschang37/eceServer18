

//var marker = L.marker([32.231701, -110.948908]).addTo(mymap);
//var marker = L.marker([32.2355314,-110.9599239]).addTo(mymap);

//var circle = L.circle([32.231701, -110.948908], {
//    color: 'red',
//    fillColor: '#f03',
//    fillOpacity: 0.5,
//    radius: 500
//}).addTo(mymap);
//var polygon = L.polygon([
//    [32.2355314,-110.9599239],
//    [32.2366323,-110.951967],
//    [32.2324251,-110.9433669],
//    [32.2273496,-110.9517812]
//]).addTo(mymap);


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
//        var test8 = testtest[0].date-70000;
        var speed1 = 0;
        var speed2 = 0;
        var speed3 = 0;
        var speed4 = 0;
        var speed5 = 0;
        var speed6 = 0;
        var speed7 = 0;
        var uvValueTotal1=0;
        var uvValueTotal2=0;
        var uvValueTotal3=0;
        var uvValueTotal4=0;
        var uvValueTotal5=0;
        var uvValueTotal6=0;
        var uvValueTotal7=0;
        
        var count = 0;
    
    var responseHTML = "";


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

        if(data[index].gpsSpeed > 15){
        tpyeActivity = "biking";
        }else if((15>data[index].gpsSpeed)&&(data[index].gpsSpeed>10)){
        tpyeActivity = "running";
        }else{
        tpyeActivity = "walking";
        }
        
//              tempData.push( data );
    }
    else{   
            maxTime = Math.max.apply(null,timeDuration);
            console.log(maxTime);
            minTime = Math.min.apply(null,timeDuration);
            console.log(minTime);
            timeDuration2 = maxTime - minTime;
            totalDistance= (gpsSpeed/y)*(timeDuration2/100);
            responseHTML += "<tr>";
            responseHTML += "<td>"+ data[index-1].date + "</td>";
            responseHTML += "<td>"+ timeDuration2 + "</td>";
            responseHTML += "<td>"+ tpyeActivity + "</td>";
            responseHTML += "<td>"+ data[index-1].deviceId + "</td>";
            
//            responseHTML += "<td>"+ data[index-1].longitude + "</td>";
//            responseHTML += "<td>"+ data[index-1].latitude + "</td>";
            responseHTML += "<td>"+ gpsSpeed/y + "</td>";
            responseHTML += "<td>"+ totalDistance + "</td>";
            responseHTML += "<td>"+ totalDistance/1.3 + "</td>";
            responseHTML += "<td>"+ Math.floor((Math.random() * 100) + 1); + "</td>";

            responseHTML += "<td>"+ data[index-1].actId + "</td>";
            responseHTML += "</tr>"
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
        if(data[index].gpsSpeed > 15){
        tpyeActivity = "biking";
        }else if((15>data[index].gpsSpeed)&&(data[index].gpsSpeed>10)){
        tpyeActivity = "running";
        }else{
        tpyeActivity = "walking";
        }
        
    }
}
            responseHTML += "<tr>";
            responseHTML += "<td>"+ data[data.length-1].date + "</td>";
            responseHTML += "<td>"+ timeDuration2 + "</td>";
            responseHTML += "<td>"+ tpyeActivity + "</td>";
            responseHTML += "<td>"+ data[data.length-1].deviceId + "</td>"; 
//            responseHTML += "<td>"+ data[data.length-1].longitude + "</td>";
//            responseHTML += "<td>"+ data[data.length-1].latitude + "</td>";
            responseHTML += "<td>"+ gpsSpeed/y + "</td>";
            responseHTML += "<td>"+ totalDistance + "</td>";
            responseHTML += "<td>"+ totalDistance/1.3 + "</td>";
            responseHTML += "<td>"+ Math.floor((Math.random() * 100) + 1); + "</td>";
            responseHTML += "<td>"+ data[data.length-1].actId + "</td>";
            responseHTML += "</tr>"
            tpyeActivity = "";
            maxTime = 0;
            minTime = 0;
//            timeDuration =[];
            totalDistance=0;
            j=j+1;
}else{
            responseHTML += "<tr>";
            responseHTML += "<td>"+ test1 + "</td>";
            responseHTML += "<td>"+ 0 + "</td>";
            responseHTML += "<td>"+ "No Activity" + "</td>"; 
            responseHTML += "<td>"+ this.response[0].deviceId + "</td>"; 
//            responseHTML += "<td>"+ 0 + "</td>";
//            responseHTML += "<td>"+ 0 + "</td>";
            responseHTML += "<td>"+ 0 + "</td>";
            responseHTML += "<td>"+ 0 + "</td>";
            responseHTML += "<td>"+ 0 + "</td>";
            responseHTML += "<td>"+ 0 + "</td>";
            responseHTML += "<td>"+ 0 + "</td>";
            responseHTML += "</tr>"
}
            test1=test1-10000;
}
console.log(this.response[450].longitude);
console.log("aaasdfsdfsdgzsfg");
    testbody.innerHTML = responseHTML;
    var mymap = L.map('mapid').setView([32.231701, -110.948908], 15);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoieXNjaGFuZzM3IiwiYSI6ImNqcGpncm9jOTAzNW8zcXBibm56djcyb2kifQ.gN6AJ3XRtnHe0eBd_HEUDg'
}).addTo(mymap);
    
    var polygon = L.polygon([
    [this.response[this.response.length-10].longitude,this.response[this.response.length-10].latitude],
    [this.response[this.response.length-40].longitude,this.response[this.response.length-40].latitude],
    [this.response[this.response.length-80].longitude,this.response[this.response.length-80].latitude],
    [this.response[this.response.length-90].longitude,this.response[this.response.length-90].latitude],
    [this.response[this.response.length-100].longitude,this.response[this.response.length-100].latitude]
]).addTo(mymap);
//    var polygon = L.polygon([
//    [32.2355314,-110.9599239],
//    [32.2366323,-110.951967],
//    [32.2324251,-110.9433669],
//    [32.2273496,-110.9517812]
//]).addTo(mymap);
    
    var marker = L.marker([this.response[this.response.length-50].latitude,this.response[this.response.length-50].longitude]).addTo(mymap);
    marker.bindPopup("<b>Good jobs</b><br>Start Point").openPopup();
polygon.bindPopup("Good jobs");
}





// Handle authentication on page load
$(function() {
   // If there's no authToekn stored, redirect user to 
   // the sign-in page (which is index.html)
   if (!window.localStorage.getItem("authToken")) {
      window.location.replace("index.html");
   }
   else {
//      sendReqForAccountInfo();
       postJson();
       console.log("ssss");
   }
   
   // Register event listeners,HengxinQin modify
//   $("#addDevice").click(showAddDeviceForm);
//   $("#registerDevice").click(registerDevice);   
//   $("#cancel").click(hideAddDeviceForm); 
//   $("#seeDetail").click(showSeeDetailTable);
//   $("#hideTable").click(hideSeeDetailTable);
});
