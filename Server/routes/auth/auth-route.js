const express = require('express');
const {register,loginUser,logout,authMiddleware}= require('../../controllers/auth/auth-controller')
 
const router = express.Router();

router.post('/register',register)

router.post('/login',loginUser)
router.post('/logout',logout)

router.get('/check-auth',authMiddleware,(req,res)=>{
    const user=req.user;
    res.status(200).json({
    success:true,
    message:'user is authenticated',user
  })
})


module.exports=router;