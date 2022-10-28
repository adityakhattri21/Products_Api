const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const productRoute = require("./api/routes/products");
const orderRoute = require("./api/routes/orders");
const userRoute = require('./api/routes/users');

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With-Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods" , "PUT , POST , PATCH , DELETE , GET");
        return res.status(200).json({});
    }
    next();
});
// here we will use this middleware only when request is made to /uploads route
app.use('/uploads', express.static('uploads')); //other way is to make a route with /uploads and search and give output

app.use(morgan('dev')); // this will log few info about the request that we make to the middleware.
//Every request that we make will be set through this middleware first. 

app.use("/products" , productRoute);
app.use("/orders",orderRoute);
app.use("/users",userRoute);

app.use((req,res,next)=>{ // this line has no route in it since whenever we reach this route we are sure that 
    // no route above it was targetted and we have recieved a route that does not exist. 
    const error = new Error("Not found"); // Error obejct is provided to us by Express
    error.status=404;
    next(error); // this will allow us to go to another middleware but with the error thrown.
});

app.use((error,req,res,next)=>{ // the error generated will go through above route and come here through next() function.
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;