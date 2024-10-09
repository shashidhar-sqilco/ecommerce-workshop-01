const express=require('express');
const Cart= require('../models/CartModel');

const router=express.Router();

//adding items into cart
router.post('/add',async(req,res)=>{
    try{
        const {productId,quantity}=req.body;

        //finding the cart for specific user with user id

        let cart=await Cart.findOne({userId:req.user.userId});

        //if there is no cart, create new one
        if(!cart){
            cart=new Cart({userId:req.user.userId,items:[]});
        }   

        const existingItem=cart.items.find(item=>item.productId===productId);
        
        //if item already exists in cart, increase the quantity
        if(existingItem){
            existingItem.quantity+=quantity;
        }
        else{
            cart.items.push({productId,quantity});
        }

        await cart.save();

        res.status(201).json(cart);



    }catch(error){
        res.status(500).json(({message:'Error adding item to cart',error:error}))
    }
});

//to fetch the user's cart.
router.get('/',async(req,res)=>{
    try {
        const cart=await Cart.findOne({userId:req.user.userId});
        if(!cart){
            return res.status(404).json({message:'Cart not found!'})
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({message:"Error fetching cart",error:error})
    }
})




module.exports=router;