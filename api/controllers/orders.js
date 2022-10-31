const Order = require("../models/order");
const Product = require("../models/product");

exports.order_get_all = (req,res,next)=>{   // we add / since request coming here will be /products by default.
    Order.find()
    .select("_id product quantity")
    .populate('product',"_id name")
    .exec()
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc=>{
                return {
                    id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
};

exports.order_create = (req,res,next)=>{
    Product.findById(req.body.productID).exec()
    .then(product => {
        if(!product){
            return res.status(404).json({message: 'Product does not exist'})
        }
        else{
            const order = new Order({
                quantity: req.body.quantity,
                product: req.body.productID
            })
           return order.save()
        }
        
       
    })
    .then(result =>{
        res.status(201).json({
            message: 'Order saved',
            orderDetails: {
                id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request : {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
        });
    })
    
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    })
};

exports.order_get_order = (req,res,next)=>{
    Order.findById(req.params.orderID)
    .select("product quantity")
    .populate('product' , "_id name")
    .exec()
    .then(result=>{
        if(!result){
            return res.status(404).json({message: 'Order does not exist'})
        }
        res.status(200).json({
            order: result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
   
};

exports.order_delete = (req,res,next)=>{
    Order.findByIdAndDelete(req.params.orderID).exec()
    .then(result =>{
        if(!result){
           return res.status(200).json({message : 'Product does not exist in the database.'}) 
        }
        res.status(200).json({message:  "Product deleted successfully."})
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
};