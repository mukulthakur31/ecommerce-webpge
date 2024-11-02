const express = require('express');
const router = express.Router();
const product = require('../Models/product');
const User = require('../Models/user')
const { jwtAuthMiddleware} = require('../Jwt')
const checkAdminRole = async(userId)=>{
   try {
       const  user = await User.findById(userId)
       return user.roles === "admin"
   } catch (error) {
       return false 
   }
 }

router.post('/add',jwtAuthMiddleware,async(req,res)=>{
   try {
      if(! await checkAdminRole(req.user.id)){
      
         return res.status(403).json({error:"user does not have admin role"})
              
              }
      const data = req.body
    const response = await product.create(data)
    res.status(200).json(response)
   } catch (error) {
    res.status(404).json({error:"internal server error "})
   }

})
router.post('/addtocart',jwtAuthMiddleware,async(req,res)=>{
   try {
      const productid = req.body.productId
      const userid = req.user.id
   const user = await User.findByIdAndUpdate(userid,{$push:{cart:productid}},{new:true})
   console.log(user
      
   );
    return res.status(200).json({message:"product added to cart successfully"})
   } catch (error) {
   return  res.status(404).json({error:"internal server error "})
   }

})
router.post('/deletefromcart', jwtAuthMiddleware, async (req, res) => {
   try {
       const productId = req.body.productId;
       const userId = req.user.id;

       const user = await User.findByIdAndUpdate(userId, { $pull: { cart: productId } }, { new: true });

       console.log(user);

       return res.status(200).json({ message: "Product deleted from cart successfully" });
   } catch (error) {
       console.error(error);
       return res.status(500).json({ error: "Internal server error" });
   }
});
router.post('/removewishlist', jwtAuthMiddleware, async (req, res) => {
   try {
       const productId = req.body.productId;
       const userId = req.user.id;

       const user = await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } }, { new: true });

       console.log(user);

       return res.status(200).json({ message: "Product deleted from wishlist successfully" });
   } catch (error) {
       console.error(error);
       return res.status(500).json({ error: "Internal server error" });
   }
});



router.post('/wishlist',jwtAuthMiddleware,async(req,res)=>{
   try {
      const productid = req.body.productId
      const userid = req.user.id
   const user = await User.findByIdAndUpdate(userid,{$push:{wishlist:productid}},{new:true})
    return res.status(200).json({message:"product added to wishlist successfully"})
   } catch (error) {
   return  res.status(404).json({error:"internal server error "})
   }

})
router.delete('/delete/:id',jwtAuthMiddleware,async(req,res)=>{
   try {
      if(! await checkAdminRole(req.user.id)){
      
         return res.status(403).json({error:"user does not have admin role"})
              
              }
     const productid= req.params.id
    const response = await product.findOneAndDelete({_id:productid})
    if (response) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
   } catch (error) {
    res.status(404).json({error:"internal server error "})
   }

})
router.get('/all',jwtAuthMiddleware,async(req,res)=>{
   try {
    const data = await product.find()
    res.status(200).json(data)
   } catch (error) {
    res.status(404).json({error:"internal server error "})
   }

})
router.get('/product/:id',jwtAuthMiddleware,async(req,res)=>{
   try {
      const productid = req.params.id
   
    const data = await product.findById(productid)

    res.status(200).json(data)
   } catch (error) {
    res.status(404).json({error:"internal server error "})
   }

})

module.exports= router