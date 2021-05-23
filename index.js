const express = require('express')
const mongoose = require('mongoose')
const authRouter =require('./authRouter')
const path=require('path')
const session= require("express-session")
const bodyParser = require("body-parser");
const cookieParser=require("cookie-parser")
const func=require('./functions')
const query=require('./queryController')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')
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

let urlencodedParser=bodyParser.urlencoded({extended: false})
const start= async()=>{
    try{
        app.get('/', (req, res)=>{
            console.log(req.session.user)
            res.render('index',{
                status:0,
                user:req.session.user,
                userRoles:['USER','ADMIN']
            })
        })
        app.get('/query1', query.getQuery1)
        app.post('/query1', urlencodedParser, query.postQuery1)
        app.get('/query2', roleMiddleware(['USER','ADMIN']), query.getQuery2)
        app.post('/query2', urlencodedParser, roleMiddleware(['USER','ADMIN']), query.postQuery2)
        app.get('/query3',roleMiddleware(['USER','ADMIN']), query.getQuery3)
        app.post('/query3', urlencodedParser, roleMiddleware(['USER','ADMIN']), query.postQuery3)
        app.get('/addVehicle',roleMiddleware(['ADMIN']), query.addVehicle)
        app.get('/addVehicle/addPrivateVehicle',roleMiddleware(['ADMIN']), query.addPrivateVehicle)
        app.post('/addVehicle/addPrivateVehicle', urlencodedParser, roleMiddleware(['ADMIN']), query.postPrivateVehicle)  
        app.get('/addVehicle/addOrganizationVehicle', roleMiddleware(['ADMIN']), query.addOrganizationVehicle)
        app.post('/addVehicle/addOrganizationVehicle', urlencodedParser, roleMiddleware(['ADMIN']), query.postOrganizationVehicle)
        app.get('/deleteVehicle', roleMiddleware(['ADMIN']), query.deleteVehicle)
        app.post('/deleteVehicle', urlencodedParser, roleMiddleware(['ADMIN']), query.postDeleteVehicle)
        await mongoose.connect('mongodb+srv://Dima:Dima1604@cluster0.7pprm.mongodb.net/Users?retryWrites=true&w=majority')
        app.listen(PORT, ()=> console.log(`server has been started on PORT ${PORT}`))
    }catch(e){
        console.log(e)
    }
}
start()


