const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');

const  multer = require('multer'); // it is an alternative of body-parser and can be used to parse non URL encoded form data as well.
const checkAuth = require("../middlewares/check_auth");

const productController = require("../controllers/products");

const date = new Date()

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null , './uploads');
    },
    filename: function(req,file,cb){
        cb(null,date.getTime().toString()+file.originalname)
    }
})

const fileFilter = (req,file,cb)=>{
    //reject a file by : cb(null,false)
    //accept a file by : cb(null,true) we can also throw error by replacing null

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null,true)
    else
    cb(new Error("Invalid FileType"),false) // passing an error will not make any entry in the DB
    //cb(null,false)
     
}

const upload = multer({storage: storage ,
     limits: {
    fileSize: 1024* 1024  *5 // it takes value in bytes so here we have 5Mb as limit
},
fileFilter: fileFilter
}); 

router.get("/" ,productController.product_all);

//in the post request below we have added upload single before checkauth since checkAuth only accepts JSON data.
//here we are getting data in form format and we need to parse it . Uploads middleware does the same for us. 

router.post("/",upload.single('productImage'),checkAuth,productController.create_product);


router.get("/:productID",checkAuth,productController.single_product);

router.put("/:productID" , checkAuth, productController.put_product);

router.patch("/:productID", checkAuth,productController.patch_product);

router.delete("/:productID",checkAuth,productController.delete_product);


module.exports = router;