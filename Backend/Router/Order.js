const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');

const { jwtAuthMiddleware} = require('../Jwt')

router.post('/place',jwtAuthMiddleware,async(req,res)=>{
    try {
        // Create a new order and save it to the database
        const order = new Order(req.body);
        await order.save();
        res.status(201).send(order);
      } catch (error) {
        res.status(400).send(error);
      }
})

router.get('/user/:userId',jwtAuthMiddleware, async (req, res) => {
    try {
      const orders = await Order.find({ user: req.params.userId });
      res.send(orders);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  module.exports=router