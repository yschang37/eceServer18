var express = require('express');
var router = express.Router();
var Device = require("../models/device");
var HwData = require("../models/hwdata");




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
    
    HwData.find(query, function(err, allDevices) {
      if (err) {
        var errorMsg = {"message" : err};
        res.status(400).json(errorMsg);
      }
      else {
         for(var doc of allDevices) {
            responseJson.devices.push({ "deviceId": doc.deviceId,  "submitTime" : doc.submitTime, "userEmail":doc.userEmail,"uvValue":doc.uvValue,"longitude":doc.longitude,"latitude":doc.latitude,"date":doc.date,"time":doc.time} );
         }
      }
      res.status(200).json(responseJson);
    });
});


router.get('/hit/:devid', function(req, res, next) {
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
    
    HwData.find(query, function(err, allDevices) {
      if (err) {
        var errorMsg = {"message" : err};
        res.status(400).json(errorMsg);
      }
      else {
         for(var doc of allDevices) {
            responseJson.devices.push({ "deviceId": doc.deviceId,  "submitTime" : doc.submitTime, "userEmail":doc.userEmail,"uvValue":doc.uvValue,"longitude":doc.longitude,"latitude":doc.latitude} );
         }
      }
      res.status(200).json(responseJson);
    });
});
//router.get('/hit/:usemail',function(req,res,next){
//    
//    var userEmail = req.params.usemail;
//    var responseJson = { emails: [] };
//
//    if (userEmail == "all") {
//      var query = {};
//    }
//    else {
//      var query = {
//          "userEmail" : userEmail
//      };
//    }
//    
//    HwData.find(query, function(err, allEmails) {
//      if (err) {
//        var errorMsg = {"message" : err};
//        res.status(400).json(errorMsg);
//      }
//      else {
//         for(var doc of allEmails) {
//            responseJson.emails.push({  
//                "submitTime" : doc.submitTime,"uvValue":doc.uvValue,"longitude":doc.longitude,"latitude":doc.latitude} );
//         }
//      }
//      res.status(200).json(responseJson);
//    });
    
    
//});
/* POST: Register new device. */
router.post('/hit', function(req, res, next) {

    var responseJson = { 
       status : "",
       message : ""
    };

    // Ensure the POST data include properties id and email
    if( !req.body.hasOwnProperty("deviceId") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing deviceId parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }

    if( !req.body.hasOwnProperty("apikey") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing apikey parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
    
    if( !req.body.hasOwnProperty("longitude") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing longitude parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }
    
    if( !req.body.hasOwnProperty("latitude") ) {
        responseJson.status = "ERROR";
        responseJson.message = "Request missing latitude parameter.";
        return res.status(201).send(JSON.stringify(responseJson));
    }

    // Find the device and verify the apikey
    Device.findOne({ deviceId: req.body.deviceId }, function(err, device) {
        if (device !== null) {
           if (device.apikey != req.body.apikey) {
               responseJson.status = "ERROR";
               responseJson.message = "Invalid apikey for device ID " + req.body.deviceId + ".";
               return res.status(201).send(JSON.stringify(responseJson));
           }
           else {
               // Create a new hw data with user email time stamp 
               var newHwData = new HwData({
                  deviceId: req.body.deviceId,
                  userEmail: req.body.userEmail,
                  longitude: req.body.longitude,
                  latitude: req.body.latitude,
                  uvValue: req.body.uvValue,
                  gpsSpeed: req.body.gpsSpeed,
                   date:req.body.date,
                   time:req.body.time,
                   actId:req.body.actId
               });

               // Save device. If successful, return success. If not, return error message.                                                        
               newHwData.save(function(err, newHwData) {
                 if (err) {
                   responseJson.status = "ERROR";
                   responseJson.message = "Error saving data in db.";
                   return res.status(201).send(JSON.stringify(responseJson));
                 }
                 else {
                   responseJson.status = "OK";
                   responseJson.message = "Data saved in db with object ID " + newHwData._id + ".";
                   return res.status(201).send(JSON.stringify(responseJson));
                 }
               });
           }
        } 
        else {
           responseJson.status = "ERROR";
           responseJson.message = "Device ID " + req.body.deviceId + " not registered.";
           return res.status(201).send(JSON.stringify(responseJson));        
        }
    });
});



module.exports = router;
