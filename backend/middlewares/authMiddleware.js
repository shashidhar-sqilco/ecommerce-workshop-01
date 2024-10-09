const jwt=require('jsonwebtoken');

//next is the next route funtion which we called in the controller
module.exports=(req,res,next)=>{
try { 
    //access token
    const token=req.cookies.token;

    //if token is not found return 401
    if(!token){
        return res.status(401).json({msg:"Please login to access this resource"})
    }

    //decoding token if found and verifying it
    const decodeToken=jwt.verify(token,process.env.JWT_SECRET);

    req.user={userId:decodeToken.userId}
    next();
} catch (error) {
    res.status(401).json({message:'Authentication failed'})
}
}