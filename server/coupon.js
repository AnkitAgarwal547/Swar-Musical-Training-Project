const express = require("express");
const router = express.Router();
const auth=require('../middleware/auth');
const { Coupon, validate } = require("../models/Coupon.js");

router.get('/coupons/:id',async(req,res)=>{
    query={id:req.params.id};
    let coupon = await Coupon.findOne(query);
    if (coupon)
        return res.status(200).send(coupon);
})

router.post('/coupons',async(req,res)=>{
    let name=req.body.name
    let coupon = await Coupon.findOne({ name:name });
    if (coupon){
        return res
        .status(400)
        .send("coupon with given title already exists.");
    }else{
        const { error } = validate(req.body);
        if (error){
            
            return res.status(400).send("invalid record"); }
        let coupon= new Coupon(req.body);
            await coupon.save();
        return  res.status(200).send("Information saved sucessfully");
    }

})

router.put('/coupons',async(req,res)=>{
    let id=req.body.id
    let coupon = await Coupon.findOne({ _id:id });
    if (!coupon){
        return res
        .status(404)
        .send("No version if found");
    }else{
        
        await Coupon.findOneAndUpdate(
            {_id:id},
                {status:false},
             { new: true }
             );
        return  res.status(200).send("Information saved succesfully");
    }
})
router.put('/couponsPercentage',async(req,res)=>{
    let id=req.body.id
    let coupon = await Coupon.findOne({ _id:id });
    if (!coupon){
        return res
        .status(404)
        .send("No version if found");
    }else{
        
        await Coupon.findOneAndUpdate(
            {_id:id},
                {type:req.body.type,startDate:req.body.startDate,endDate:req.body.endDate,percentage:req.body.percentage,},
             { new: true }
             );
        return  res.status(200).send("Information saved succesfully");
    }
})
router.get('/listAll',async(req,res)=>{
    
    let coupon = await Coupon.find({status:true});
    return res.status(200).send(coupon);

})

module.exports = router;
