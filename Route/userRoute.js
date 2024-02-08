const express = require("express")
const {UserModel} = require("../Model/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userRouter = express.Router()
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); 
    },
  });

const upload = multer({ storage });

userRouter.post("/upload", upload.single('avatar'), (req,res)=>{
    res.status(200).json({ message: 'file uploaded successfully' });
})

userRouter.post("/api/register", (req,res)=>{
    const { username, avatar,email, password} = req.body
    try {
        bcrypt.hash(password, 5, async(err,hash)=>{
            if(err){
                res.send(err)
            }else{
                
                const user = new UserModel({
                    username, avatar,email, 
                    password:hash
                })
                await user.save();
                res.status(201).send({msg: "New User registerd", user: req.body})
            }
        })
    } catch (error) {
        console.log(error)
    }
})

userRouter.post("/api/login", async(req,res)=>{
    const { email, password} = req.body
    try {
       const user = await UserModel.findOne({email})
       if(user){
        bcrypt.compare(password, user.password, (err, result)=>{
            if(err){
                res.status(400).send({msg: "Wrong Credential"})
            }else{
                if(result === true){
                    const token = jwt.sign({username: user.username}, "masaiforum")
                    res.cookie("token", token)
                    res.cookie("userId", user._id)
                    res.status(200).send({msg: "Login Successful", token: token, user:user})
                }else{
                    res.status(400).send({msg: "Wrong Credential"})
                }
            }
        })
       }
       
    } catch (error) {
        console.log(error)
    }
})

module.exports={
    userRouter
}