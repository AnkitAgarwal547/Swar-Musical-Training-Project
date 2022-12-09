const { Profile } = require("../models/Profile.js");
const { Images } = require("../models/Images.js");
const { User } = require("../models/User.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");
var nodemailer = require('nodemailer');
const { request } = require("http");
var sgTransport = require('nodemailer-sendgrid-transport');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const jwt = require('jsonwebtoken')
const path=require('path');
const AWS=require('aws-sdk');
const isAuthenticated = require('../middleware/middle');

//-------------------apis are securd ---------------------//
router.use('/',isAuthenticated)

router.get('/listProfiles/',async(req,res)=>{

    let profiles=await Profile.find({user_id:req.user._id});
    if(profiles)
    {

        let ProfileList=[];
        for(var i=0;i<profiles.length;i++){
           var data={
                id:profiles[i]._id,
                image:profiles[i].filename,
                name:profiles[i].name,
            }
            ProfileList.push(data)
        }
        
        return  res.status(200).send({success:true,message:"Profiles list",ProfileList})
    
    }else{
        return  res.status(200).send({success:false,message:"No Profiles list found"})
        
    }

})

router.put("/updateprofile",async(req,res)=>{
    let id=req.body.id;
    let profiles = await Profile.findOne({_id:id,user_id:req.user._id})
    
    if (!(req.files && req.files.fileImage)){
        let profile = await Profile.findOne({user_id:req.user._id,name:req.body.name})
        if (profile){
            if (profile._id == id){
             
                let profile = await Profile.findOneAndUpdate(
                    {_id:req.body.id},
                    {         
                               
                        name:req.body.name,
                            
                    },
                    { new: true }
                );        
                if (profile){
                    return  res.status(200).send({success:true,message:"Profile updated Successfully"})
                }
            }else{
                return  res.status(200).send({success:false,message:"Name of profile already exists"})
            }
            
            
        }else{


                
            let profile = await Profile.findOneAndUpdate(
                {_id:req.body.id},
                {         
                           
                    name:req.body.name,
                        
                },
                { new: true }
            );        
            if (profile){
                return  res.status(200).send({success:true,message:"Profile updated Successfully"})
            }

        }    
    }
    let imageFile = req.files.fileImage;
    const extensionName = path.extname(imageFile.name); // fetch the file extension
    const allowedExtension = ['.png','.jpg','.jpeg'];
    const s3 = new AWS.S3({
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    })
    if(!allowedExtension.includes(extensionName)){
        return res.status(200).send({success:false,message:"file are not in correct format"});
    }
    let profile = await Profile.findOne({user_id:req.user._id,name:req.body.name})
    if (profile){
        if (profile._id == id){
            let timestamp=new Date().valueOf() 
                const param = {
                    Bucket: 'swars', // pass your bucket name
                    Key: "Profile/"+timestamp+"_"+ profiles.user_id+'_'+req.files.fileImage.name, // file will be saved as testBucket/contacts.csv
                    ACL: 'public-read',
                    Body: req.files.fileImage.data
                };
                s3.upload(param, async(s3Err, data) =>{
                if (s3Err) throw s3Err
                    console.log(`File uploaded successfully`)
                });
            let profile = await Profile.findOneAndUpdate(
                {_id:req.body.id},
                {         
                    status:false,       
                    name:req.body.name,
                    filename:"https://swars.s3.ap-south-1.amazonaws.com/Profile/"+timestamp+'_'+profiles.user_id+'_'+req.files.fileImage.name    
                },
                { new: true }
            );        
            if (profile){
                return  res.status(200).send({success:true,message:"Profile updated Successfully"})
            }
        }else{
            return  res.status(200).send({success:false,message:"Name of profile already exists"})
        }
        
        
    }else{


        let timestamp=new Date().valueOf() 
        const param = {
            Bucket: 'swars', // pass your bucket name
            Key: "Profile/"+timestamp+"_"+ profiles.user_id+'_'+req.files.fileImage.name, // file will be saved as testBucket/contacts.csv
            ACL: 'public-read',
            Body: req.files.fileImage.data
        };
        s3.upload(param, async(s3Err, data) =>{
        if (s3Err) throw s3Err
            console.log(`File uploaded successfully`)
        });
        let profile = await Profile.findOneAndUpdate(
            {_id:req.body.id},
            {         
                status:false,       
                name:req.body.name,
                filename:"https://swars.s3.ap-south-1.amazonaws.com/Profile/"+timestamp+'_'+profiles.user_id+'_'+imageFile.name    
            },
            { new: true }
        );        
        if (profile){
            return  res.status(200).send({success:true,message:"Profile updated Successfully"})
        }

    }
    
    
})

router.post ("/createProfile",async(req,res)=>{
    
    let user =await User.findOne({_id:req.user._id});

    if (!(req.files && req.files.fileImage && req.body.image !='')){
        let counts =await Profile.count({user_id:req.user._id})
        if (counts < 4){
            let profile = await Profile.findOne({user_id:req.user._id,name:req.body.name})
            if (profile){
                return  res.status(200).send({success:false,message:"Name of profile already exists"})
            }else{
                if(user && user.status==true)
                {
    
                    let profile =await Profile.create({
                        status:true,
                        user_id:req.user._id,
                        name:req.body.name,
                        filename:req.body.image,
                    })
                    if (profile){
                        return  res.status(200).send({success:true,message:"Profile created Successfully"})
                    }
                }else{
                    return  res.status(200).send({success:false,message:"User email does not exists"})
                
                }
            }
        }else{
            return res.status(200).send({success:false,message:"number of profiles exceeded"});
        }    
    }
    let imageFile = req.files.fileImage;
    const extensionName = path.extname(imageFile.name); // fetch the file extension
    const allowedExtension = ['.png','.jpg','.jpeg'];
    const s3 = new AWS.S3({
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    })
    if(!allowedExtension.includes(extensionName)){
        return res.status(200).send({success:false,message:"file are not in correct format"});
    }
    let counts =await Profile.count({user_id:req.user._id})
    if (counts < 4){  
        let profile = await Profile.findOne({user_id:req.user._id,name:req.body.name})
        if (profile){
            return  res.status(200).send({success:false,message:"Name of profile already exists"})
        }else{
            if(user && user.status==true)
            {
                let timestamp=new Date().valueOf() 
                const param = {
                    Bucket: 'swars', // pass your bucket name
                    Key: "Profile/"+timestamp+"_"+ req.user._id+'_'+req.files.fileImage.name, // file will be saved as testBucket/contacts.csv
                    ACL: 'public-read',
                    Body: req.files.fileImage.data
                };
                s3.upload(param, async(s3Err, data) =>{
                if (s3Err) throw s3Err
                    console.log(`File uploaded successfully`)
                });
                let profile =await Profile.create({
                    status:false,
                    user_id:req.user._id,
                    name:req.body.name,
                    //filename:"http://68.183.25.24:8086/uploads/"+timestamp+'_'+user.id+'_'+imageFile.name
                    filename:"https://swars.s3.ap-south-1.amazonaws.com/Profile/"+timestamp+'_'+user.id+'_'+req.files.fileImage.name
                })
                if (profile){
                    return  res.status(200).send({success:true,message:"Profile created Successfully"})
                }
            }else{
                return  res.status(200).send({success:false,message:"User email does not exists"})
            
            }
        }
    }else{
        return res.status(200).send({success:false,message:"number of profiles exceeded"});
    }
    
    
})
module.exports = router;