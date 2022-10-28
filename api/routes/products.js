const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Product = require("../models/product");
const  multer = require('multer'); // it is an alternative of body-parser and can be used to parse non URL encoded form data as well.

const date = new Date()

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null , './uploads/');
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

router.get("/" ,(req,res,next)=>{   // we add / since request coming here will be /products by default.
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(results =>{
        if(results.length >0){
            const response = {
                count: results.length,
                products: results.map(result => {
                    return {
                        name: result.name ,
                        price: result.price,
                        id: result._id,
                        productImage: result.productImage,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/"+result._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        }
        else{
            res.status(404).json({message: "Database is empty"})
        }
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
});

router.post("/",upload.single('productImage'),(req,res,next)=>{  // we can pass as many arguments here as we want. Each argument is a middleware which is executed before the other one.
    //console.log(req.file)
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save() // mongoose save is a promise so we dont need exec(). exec() is used to make true promises here.
    //.exec() // reason to use it is written below
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Added a new Product ",
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })

   
});


router.get("/:productID",(req,res,next)=>{
    const id = req.params.productID;
//    Product.findById(id , (err , foundProduct)=>{
//     if(err){
//         res.status(500).json({error: err})
//     }
//     else if(foundProduct){
//         res.status(200).json(foundProduct)
//     }
//     else{
//         res.status(404).json({message: "No such product found."})
//     }
//    })
   
// another format 

Product.findById(id)
.select("price name _id productImage")
.exec() //we use exec() since mongoose queries are not true promises and we are creating promises here
.then(results =>{
    if(results)
    res.status(200).json(results)
    else
    res.status(404).json({message: "No such product exists"})
})
.catch(err =>{
    res.status(500).json({error:err})
})
});

router.put("/:productID" , (req,res,next)=>{
    const id = req.params.productID;
    updateOps = {
        name: req.body.newName,
        price: req.body.newPrice
    }
    Product.updateOne({_id: id} , {$set: updateOps} , {overwrite : true})
    .exec()
    .then(result =>{
        const response = {
            message: "Updated Product",
            resquest: {
                type: "GET",
                url: "http://localhost:3000/products/"+id
            }
        }
        res.status(200).json(response)
    })
    .catch(err =>{
        res.status(500).json(err);
    })
})

router.patch("/:productID",(req,res,next)=>{
    const id = req.params.productID;
    const updateOps = {};
     for(const ops of req.body){  // for this to work res.body must be an array .
        // so we will pass it in json like [{"propName": "Name" , "value": "<New value for property>"}]
        updateOps[ops.propName]  = ops.value;
     }
    Product.findOneAndUpdate({_id: id}, {$set: updateOps})
    .select("price name _id")
    .exec()
    .then(result => {
        const response  = {
            message: "Updated Product",
            request: {
                type: "GET",
                url: "http://localhost:3000/products/"+id
            }
        }
        res.status(200).json(response);
    })
    .catch (err =>{

        res.status(500).json({
            error: err
        });
    })
   
});

router.delete("/:productID",(req,res,next)=>{
    Product.remove({_id: req.params.productID} ) // we can also use findByIdAndRemove
    .exec()
    .then(results =>{
        res.status(200).json(results)
    })
    .catch(err =>{
        res.status(500).json(err)
    })
    
});


module.exports = router;