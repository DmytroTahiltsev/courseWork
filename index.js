const express = require('express')
const mongoose = require('mongoose')
const authRouter =require('./authRouter')
const path=require('path')
const session= require("express-session")
const cookieParser=require("cookie-parser")
const PORT = process.env.PORT || 5000

const app= express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    resave:false,
    saveUninitialized: true,
    secret:"secret"
}))
app.use(express.json())
app.use('/auth', authRouter)
app.use(express.static(path.resolve(__dirname, 'public')))

app.set('view engine', 'ejs')

const start= async()=>{
    try{
        app.get('/', (req, res)=>{

            console.log(req.session)
            res.render('index',{
                status:0,
            })
        })
        await mongoose.connect('mongodb+srv://Dima:Dima1604@cluster0.7pprm.mongodb.net/Users?retryWrites=true&w=majority')
        app.listen(PORT, ()=> console.log(`server has been started on PORT ${PORT}`))
    }catch(e){
        console.log(e)
    }
}
start()


