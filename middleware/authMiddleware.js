const jwt =require('jsonwebtoken')
const {secret} =require('../config')
module.exports= function(req, res, next){
    if(req.method==="OPTIONS"){
        next()
    }
    try{
        console.log(req.session)
        const user=req.session.user
        if(!user){
            res.status(403).json({message:'Пользователь не  авторизован1'})
        }
        /*const token = req.headers.authorization.split(' ')[1]
        console.log(req.headers)
        if(!token){
            res.status(403).json({message:'Пользователь не  авторизован1'})
        }
        const decodedData= jwt.verify(token, secret)
        req.user=decodedData
        console.log(req.user)*/
        next()
    }catch(e){
        console.log(e)
        res.status(403).json({message:'Пользователь не  авторизован'})
    }
}