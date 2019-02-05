var express = require('express');
var router = express.Router();
var fs = require('fs');
var Device = require("../models/device");
var Hwdata = require("../models/hwdata");
var jwt = require("jwt-simple");
var jwt2 = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

/* Authenticate user */
//var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();
var secret = "hahahasecret";
// Function to generate a random apikey consisting of 32 characters
function getNewApikey() {
    var newApikey = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i = 0; i < 32; i++) {
       newApikey += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return newApikey;
}

// GET request return one or "all" devices registered and last time of contact.
router.get('/status/:devid', function(req, res, next) {
    var deviceId = req.params.devid;
    var responseJson = { devices: [] };

    if (deviceId == "all") {
      var query = {};
    }
    else {
      var query = {
          "deviceId" : deviceId
      };
    }
    
    Device.find(query, function(err, allDevices) {
      if (err) {
        var errorMsg = {"message" : err};
        res.status(400).json(errorMsg);
      }
      else {
         for(var doc of allDevices) {
            responseJson.devices.push({ "deviceId": doc.deviceId,  "lastContact" : doc.lastContact});
         }
      }
      res.status(200).json(responseJson);
    });
});

router.post('/register', function(req, res, next) {
    var responseJson = {
        registered: false,
        message : "",
        apikey : "none"
    };
    var deviceExists = false;

    // Ensure the request includes the deviceId parameter
    if(!("deviceId" in req.body)) {  //!req.body.hasOwnProperty("deviceId")
        responseJson.message = "Missing deviceId.";
        return res.status(400).json(responseJson);
    }

    var email = "";

    // If authToken provided, use email in authToken
    if (req.headers["x-auth"]) {
        try {
            var decodedToken = jwt.decode(req.headers["x-auth"], secret);
            email = decodedToken.email;
        }
        catch (ex) {
            responseJson.message = "Invalid authorization token.";
            return res.status(400).json(responseJson);
        }
    }
    else {
        // Ensure the request includes the email parameter
        if( !("email" in req.body)) {
            responseJson.message = "Invalid authorization token or missing email address.";
            return res.status(400).json(responseJson);
        }
        email = req.body.email;
    }

    // See if device is already registered
    Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
        if (device !== null) {
            responseJson.message = "Device ID " + req.body.deviceId + " already registered.";
            return res.status(400).json(responseJson);
        }
        else {
            // Get a new apikey
             deviceApikey = getNewApikey();

             // Create a new device with specified id, user email, and randomly generated apikey.
            var newDevice = new Device({
                deviceId: req.body.deviceId,
                userEmail: email,
                apikey: deviceApikey
            });

            // Save device. If successful, return success. If not, return error message.
            newDevice.save(function(err, newDevice) {
                if (err) {
                    console.log("Error: " + err);
                    responseJson.message = err;
                    // This following is equivalent to:
                    //     res.status(400).send(JSON.stringify(responseJson));
                    return res.status(400).json(responseJson);
                }
                else {
                    responseJson.registered = true;
                    responseJson.apikey = deviceApikey;
                    responseJson.message = "Device ID " + req.body.deviceId + " was registered.";
                    return res.status(201).json(responseJson);
                }
            });
        }
    });
});



router.delete('/delete', function(req, res, next) {  
    Device.find({ deviceId: req.body.deviceId }).remove().exec(); 
//	Activity.find({ deviceId: req.body.deviceId }).remove().exec(); 
    res.status(200).json({deleted:"yes"}); 
}); 

//YS: add to see the history
router.post('/history', function(req, res, next) {
    Hwdata.find({ deviceId: req.body.deviceId}, function(err, hwdata) {



         var deviceList = []; 
        if (hwdata !== null) {
            //use the device and push to push the object and trasmit the data to holz
            for(var doc of hwdata) {
                deviceList.push({ 
				                deviceId:req.body.deviceId ,
                                longitude:doc.longitude,
                                latitude:doc.latitude,
                                gpsSpeed:doc.gpsSpeed,
                                uvValue:doc.uvValue,
                                date:doc.date,
                                time:doc.time,
                                actId:doc.actId,
                                
				         })
            }
        }
        console.log(deviceList);
        return res.status(200).json(deviceList);
        
        
    });
});

router.post('/activity', function(req, res, next) {
    Hwdata.find({ deviceId: req.body.deviceId}, function(err, hwdata) {
        var deviceList = []; 
        var temp=0;
        var avgSpeed=0;
        var uvTotal=0;
        if (hwdata !== null) {
            //use the device and push to push the object and trasmit the data to holz
            for(var doc of hwdata) {
                       avgSpeed=doc.gpsSpeed+avgSpeed;
                       uvTotal=doc.uvTotal+uvTotal;
                       temp=temp+1;
            }
        }
        
                        deviceList.push({ 
				                deviceId:temp,
                                longitude:"123",
                                latitude:"123",
                                gpsSpeed:avgSpeed,
                                uvValue:uvTotal
				         })
        console.log(deviceList);
        return res.status(200).json(deviceList);
        
        
    });
});

module.exports = router;
