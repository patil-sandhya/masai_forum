const jwt = require("jsonwebtoken")

const auth = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if(token){
        jwt.verify(token, "masaiforum", (err,decoded)=>{
            if(err){
                res.send(err)
            }else{
                next()
            }
        })
    }else{
        res.send({msg: "Not authorised"})
    }
}

module.exports = {
    auth
}