const express = require("express");
const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const axios = require("axios");
const router = express.Router();

const FAKE_STORE_API_BASE_URL = "https://fakestoreapi.com";

// Create a new order
router.post("/place-order", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const productResponse = await axios.get(
            `${FAKE_STORE_API_BASE_URL}/products/${item.productId}`
          );
          const product = productResponse.data;
          const itemTotal = product.price * item.quantity;
          totalAmount += itemTotal;
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          };
        } catch (error) {
          throw new Error(
            `Failed to fetch product ${item.productId}: ${error.message}`
          );
        }
      })
    );

    const order = new Order({
      userId: req.user.userId,
      items: orderItems,
      totalAmount,
    });

    await order.save();

    // Clear the cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Order placement error:", error);
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
});

router.get('/',async(req,res)=>{
    try{
    const orders=await Order.find({userId:req.user.userId});

        res.json(orders);

    }catch(err){
        res.status(500).json({message:"Error fetching order",error:err})
    }
})


module.exports = router;
