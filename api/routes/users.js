const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // jwt tokens are not encrypted but encoded using base 64 strings. 

const secretKey = "secret"; // must be used using environment variable. 

router.post('/signup' , (req,res,next)=>{
    User.findOne({email:req.body.email})
    .exec()
    .then(result =>{
        if(result){
            res.status(422).json({
                message: "Email exists"
            })
        }
        else{
            bcrypt.hash(req.body.password , 10 , (err,hash)=>{ //10 id the number of salting rounds.
                if(err){
                    res.status(500).json({
                        error:err
                    })
                }
                else{
                    const user = new User({
                        email:req.body.email,
                        password:hash
                    })
            
                    user
                    .save()
                    .then(result =>{
                        res.status(201).json({
                            message: 'User created'
                        })
                    })
                    .catch(err =>{
                        res.status(500).json({
                            error:err
                        })
                    })
            
                }
            
            })

        }
    })

   
});
//jwt basic syntax jwt.sign(payload , secretOrPrivateKey , [options , callback]) signing is when we create the token
// payload is some data that we pass into the token. 
//secretKey is the key that is known only to the server. 
//validity of the token must not be too long for security reason since we are granting full access to out API using the token.


router.post("/login",(req,res,next)=>{
    User.findOne({email:req.body.email})
    .exec()
    .then(user =>{
        if(user){
            bcrypt.compare(req.body.password , user.password , (err,result)=>{
                if(err){
                   return  res.status(500).json({error: err})
                }
                else if (result){

                   const token =  jwt.sign({   // syncronously using the jwt key
                        email: user.email,
                        id: user._id
                    },
                    secretKey,
                    {
                        expiresIn: '1h'
                    }); // in the end we can also pass a callbacck function to make it asyncronous 
                    return res.status(200).json({message: "Auth successful",
                     token: token  
                })
                }
                else{
                    return res.status(401).json({message: "Auth failed"})
                }
            })
        }
        else
        res.status(401).json({Message: 'Auth Failed'}) // We will send a general message of Auth failed so that user cannot know the real reason behind the failure and make it difficult to find vulnerability. Eg: If we say that user does not exist then one can try brute force attack.
    })
    .catch(err =>{
        res.status(500).json({Error: err})
    })
})


router.delete("/:userID" , (req,res,next)=>{
    User.findByIdAndDelete(req.params.userID).exec()
    .then(result =>{
        if(result){
            res.status(200).json({message: "Deleted Successfully"})
        }
        else
        res.status(404).json({message:"User does not exist"})
       
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router;