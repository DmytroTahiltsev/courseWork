const User =require('./models/User')
const Role =require('./models/Role')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser");
const session= require("express-session")
const cookieParser=require("cookie-parser")
const {validationResult}= require('express-validator')
const {secret}= require('./config')
const generateAccessToken = (id, roles)=>{
    const payload={
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn:'24h'})
}

class authController{
    async registration(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:'Ошибка при регистрации', errors})
            }
            const {username, password, Rpassword}=req.body
            const candidate= await User.findOne({username})
            if(candidate){
                return res.status(400).json({message:'Пользователь с таким именем уже существует'})
            }
            if(password===Rpassword){
                const hashPassword = bcrypt.hashSync(password, 6);
                const userRole= await Role.findOne({value:"USER"})
                const user = new User({username:username, password: hashPassword, roles:[userRole.value] })
                await user.save()
                res.render('registration',{
                    status:1
                })
            }
            else{
                res.render('registration',{
                    status:2
                })
            }

            
            //res.json({message:'Пользователь успешно зарегистрирован'})
        }catch(e){
            console.log(e)
            res.status(4).json({message:'registration error'})
        }
    }
    async login(req, res){
        try{
            const {username, password}= req.body
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message:`Пользователь ${username} не найден`})
            }
            const validPassword= bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return res.status(400).json({message:`Введен не верный пароль`})
            }
            req.session.user=user
            
            const token= generateAccessToken(user._id, user.roles)
            res.redirect('/')
           
        }catch(e){
            console.log(e)
            res.status(4).json({message:'login error'})
        }
    }
    async logout(req, res){
        req.session.user=undefined
        res.redirect('/')
    }
    async getUsers(req, res){
        try{
            const users= await User.find()
            const user=req.session.user
            //res.json(users)
            res.send(`<h1>you ${user.username}</h1>`)
        }catch(e){
            console.log(e)
        }
    }
}

module.exports= new authController()
