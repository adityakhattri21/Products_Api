const jwt = require('jsonwebtoken');
const secretKey = 'secret';

module.exports = (req,res,next)=>{
    try{
        //since this will throw error when not verified so we use try catch for it. 
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token , secretKey) // we can also add options and callback fuction here.
        req.userData = decoded;  // note token can also be passed under header with authentication parameter.
        next();
    }catch(error){
        return res.status(401).json({message:"Auth failed"})
    }
   

}