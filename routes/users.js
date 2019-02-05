var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require("../models/users");
var Device = require("../models/device");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
var jwt2 = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

/* Authenticate user */
//var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();
var secret = "hahahasecret";

router.post('/signin', function(req, res, next) {
   User.findOne({email: req.body.email}, function(err, user) {
      if (err) {
         res.status(401).json({success : false, error : "Error communicating with database."});
      }
      else if(!user) {
         res.status(401).json({success : false, error : "The email or password provided was invalid."});
      }
      else {
         bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
            if (err) {
               res.status(401).json({success : false, error : "Error authenticating. Please contact support."});
            }
            else if(valid) {
              if (user.active != true){
               return res.status(401).json({success : false, error : "The account has not be activated! Please check you email for activation link."});
             }
             else {
               var token = jwt.encode({email: req.body.email}, secret);
              return res.status(201).json({success : true, token : token});
            }
          }
            else {
               res.status(401).json({success : false, error : "The email or password provided was invalid."});
            }
         });
      }
   });
});

/* Register a new user */
var options = {
  auth: {
    api_user: 'safwanSS',
    api_key: 'Se12011994'
  }
}

var client = nodemailer.createTransport(
{   
    service:'gmail',
    auth:{
        user:'testece513@gmail.com',
        pass:'Tttece513'
}



}

);

router.post('/register', function(req, res, next) {

var token2 = jwt2.sign({email:req.body.email}, secret , { expiresIn: '1h' });

    // FIXME: Add input validation
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        // Create an entry for the user
        var newUser = new User( {
           email: req.body.email,
           fullName: req.body.fullName,
           passwordHash: hash, // hashed password
           tempToken:token2
        });

        newUser.save( function(err, user) {
           if (err) {
              // Error can occur if a duplicate email is sent
              return res.status(400).json( {success: false, message: "Invalid email"});
           }
           else {

             var email = {
               from: 'testece513@gmail.com',
               to: req.body.email,
               subject: 'Activation Link',
               text: 'Hello ' +req.body.fullName + ', thank you for registering at YouVfit. Please click on the following link to complete your activation: http://ec2-18-224-179-106.us-east-2.compute.amazonaws.com:3000/users/activate/' + token2,
               html: 'Hello<strong> ' + req.body.fullName + '</strong>,<br><br>Thank you for registering. Please click on the link below to complete your activation:<br><br><a href="http://ec2-18-224-179-106.us-east-2.compute.amazonaws.com:3000/users/activate/' + token2 + '">Link</a>'
             };

             client.sendMail(email, function(err, info){
                 if (err ){
                   console.log(err);
                 }
                 else {
                   console.log('Message sent: ' + info.response);
                 }
             });

              return res.status(201).json( {success: true, message: user.fullName + " your account has been created! Please check your email for activation link."}) // FIXME change the message
           }
        });
    });
});

router.get("/account" , function(req, res) {
   // Check for authentication token in x-auth header
   if (!req.headers["x-auth"]) {
      return res.status(401).json({success: false, message: "No authentication token"});
   }
   
   var authToken = req.headers["x-auth"];
   
   try {
      var decodedToken = jwt.decode(authToken, secret);
      var userStatus = {};
      
      User.findOne({email: decodedToken.email}, function(err, user) {
         if(err) {
            return res.status(200).json({success: false, message: "User does not exist."});
         }
         else {
            userStatus['success'] = true;
            userStatus['email'] = user.email;
            userStatus['fullName'] = user.fullName;
            userStatus['lastAccess'] = user.lastAccess;
            
            // Find devices based on decoded token
		      Device.find({ userEmail : decodedToken.email}, function(err, devices) {
			      if (!err) {
			         // Construct device list
			         var deviceList = []; 
			         for (device of devices) {
				         deviceList.push({ 
				               deviceId: device.deviceId,
				               apikey: device.apikey,
                               userEmail:device.userEmail,
				         });
			         }
			         userStatus['devices'] = deviceList;
			      }
			      
               return res.status(200).json(userStatus);            
		      });
         }
      });
   }
   catch (ex) {
      return res.status(401).json({success: false, message: "Invalid authentication token."});
   }
   
});

//to update the password
router.put('/resetpassword',function(req,res,next){
//to verify the email first
User.findOne({email: req.body.email}, function(err, user) {
      
      if (err) {
      //if err it mean it has problem with database
         res.status(401).json({success : false, error : "Error communicating with database."});
      }
      else if(!user) {
      //not find the users
         res.status(401).json(console.log("1111"));         
      }
      else {
      //use the compare to verify the password
         bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
            if (err) {
               res.status(401).json({success : false, error : "Error authenticating. Please contact support."});
            }
            else if(valid) {
                    bcrypt.hash(req.body.passwordreset, null, null, function(err, hash) {
                    if (err) {
                      // Error can occur if a duplicate email is sent
                      res.status(400).json(console.log("NONONONO"));
                   }
                    else{
                    //replace the password
                    user.passwordHash=hash;
                    user.save();  
                    res.status(200).json(console.log(user));}


                     })
                        
                    }
            else {
               res.status(401).json(console.log("3333"));         
            }
         });
      }
   });
//    res.status(401).json(console.log("5"));
});

router.get("/activate/:token" , function(req, res) {

  User.findOne({ tempToken: req.params.token }, function(err, user) {
			if (err) throw err; // Throw error if cannot login
			var token = req.params.token; // Save the token from URL for verification

			// Function to verify the user's token
			jwt2.verify(token, secret, function(err, decoded) {

				if (err) {
          User.findOneAndRemove({ tempToken: req.params.token }, function(err, userdel) {
             if (userdel === null) {
                console.log("No user deleted");
             } else {
                console.log("Removed user " + userdel);
             }
          });
          return res.status(201).redirect('../../invalidlink.html');

				} else if (!user) {
          User.findOneAndRemove({ tempToken: req.params.token }, function(err, userdel) {
             if (userdel === null) {
                console.log("No user deleted");
             } else {
                console.log("Removed user " + userdel);
             }
          });
				//return res.status(401).json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
          return res.status(201).redirect('../../invalidlink.html');
      	} else {
					user.tempToken = false; // Remove temporary token
					user.active = true; // Change account status to Activated
					// Mongoose Method to save user into the database
					user.save(function(err) {
						if (err) {
							console.log(err); // If unable to save user, log error info to console/terminal
						} else {
							// If save succeeds
              console.log("het");
             return res.status(201).redirect('../../holz/activate.html');

							return res.status(201).json({ success: true, message: 'Your account has been activated!' }); // Return success message to controller
						}
					});
				}
			});
		});

});
//bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
//    if(err){
//        res.status(401).json(console.log("1"));
//    }
//    else if(valid){
//        
////    User.findOne({$and:[{email: req.body.email},{passwordHash: hash1}]}, function(err, user) {
////      if (err) {
////         res.status(401).json(console.log("2"));
////      }
////      else if(!user) {
////         res.status(401).json(console.log("3"));         
////      }
////        else{
////             bcrypt.hash(req.body.passwordreset, null, null, function(err, hash) {
////                            if (err) {
////              // Error can occur if a duplicate email is sent
////              res.status(400).json(console.log("NONONONO"));
////           }
////                 else{
//////                     user.passwordHash=hash;
////////                user.update({ fullName: "ff" }, {$set:{fullName:"hash" }} );
////////                 user.fullName=user.fullName.replace("hash","kkkkkkkk");
//////                 user.save();  
////             res.status(200).json(console.log(user));  }
////            
////             
////             })
////            
////};
////      
////})
//    }
//    else{
//        res.status(401).json(console.log("4"));
//    }
//    
//
//});
//    res.status(400).json(console.log([req.body.email,  req.body.password]));
  

module.exports = router;
