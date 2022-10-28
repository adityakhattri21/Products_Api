const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    //_id will be there by default.
    product: {type: mongoose.Schema.Types.ObjectId , ref:'Product' , required: true}, // ref holds the name of the model we want to connect this model to.
    quantity: {type:Number, default: 1}
});

module.exports = mongoose.model('Order' , orderSchema);