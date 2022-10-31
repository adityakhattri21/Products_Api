const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');



const userController = require("../controllers/users"); 

router.post('/signup' , userController.user_signup);
//jwt basic syntax jwt.sign(payload , secretOrPrivateKey , [options , callback]) signing is when we create the token
// payload is some data that we pass into the token. 
//secretKey is the key that is known only to the server. 
//validity of the token must not be too long for security reason since we are granting full access to out API using the token.


router.post("/login",userController.user_login)


router.delete("/:userID" , userController.user_delete)

module.exports = router;