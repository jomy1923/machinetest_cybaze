const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')
module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
       return res.json({ error: 'hey user you must signin first' })
    }else{ 
        // const token = authorization.split(' ')[1]
        const token=authorization.replace('sunday ','')
        jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
            if(err){
                res.json({error:"you have entered a invalid authorization key"})
            }else{
                const{_id}=payload
                User.findById(_id).then((userData)=>{
                    req.user=userData
                    next()
                })
                
            }
        })
    }
}