const mongoose=require('mongoose');

//Schema for single item in order 
const orderItemSchema=new mongoose.Schema({
    productId:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    price:{
        type:Number,
        required:true
    }
});

//Schema for whole order 
const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[orderItemSchema],
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","shipped","delivered"],
        default:"pending"
    }
},{timestamps:true});

module.exports=mongoose.model('Order',orderSchema)