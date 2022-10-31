const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const { populate } = require('../models/order');
const checkAuth = require("../middlewares/check_auth");

const Order = require("../models/order");
const Product = require("../models/product");

const orderController = require("../controllers/orders");

router.get("/" ,checkAuth,orderController.order_get_all);

router.post("/",checkAuth,orderController.order_create);


router.get("/:orderID",checkAuth,orderController.order_get_order);


router.delete("/:orderID",checkAuth,orderController.order_delete);


module.exports = router;