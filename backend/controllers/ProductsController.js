const express = require("express");
const axios=require('axios');
const router = express.Router();

const FAKE_STORE_API_BASE_URL='https://fakestoreapi.com';


//Get all products
router.get('/', async (req, res) => {

    try {
        const respose=await axios.get(`${FAKE_STORE_API_BASE_URL}/products`);
        console.log(respose.data);
        res.json(respose.data);

    } catch (error) {
        console.log('Error fetching products',error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});
//fetching single product
router.get('/:id',async(req,res)=>{
    try {
        const response=await axios.get(`${FAKE_STORE_API_BASE_URL}/products/${req.params.id}`);

        //check if the respose it empty return 404
        if(!response.data){
            return res.status(404).json({message:'Product not found'})
        }

        res.json(response.data);    
        
    } catch (error) {
        console.error('Error fetching product:',error);
        if(error.response && error.response.status===404){
            res.status(404).json({message:'Product not found'});
        }else{
            res.status(500).json({message:"Error fetching product"});
        }
    }
});

//get products by category
router.get('/category/:category',async(req,res)=>{
    try {
        const response = await axios.get(`${FAKE_STORE_API_BASE_URL}/products/category/${req.params.category}`);
        if (Array.isArray(response.data) && response.data.length === 0) {
         return res.status(404).json({
            message: `products not found in category ${req.params.category}`,
          });
        }
        res.json(response.data);
    } catch (error) {
       res.status(500).json({message:`Error fetching products by category ${req.params.category}` }) 
    }

})

//get all product categories
router.get("/categories", async (req, res) => {
  try {
    const response = await axios.get(
      `${FAKE_STORE_API_BASE_URL}/products/categories}`
    );

    
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error fetching categories`,
      });
  }
});





module.exports=router;