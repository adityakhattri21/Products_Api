const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/api")
.then(()=> console.log("Connected successfully to database"))
.catch((err)=> console.log(err))