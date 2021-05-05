const Router =require('express')
const router = new Router()
const controller = require('./authController')
const {check}=require('express-validator')
const bodyParser = require("body-parser");
const authMiddleware = require('./middleware/authMiddleware')



let urlencodedParser=bodyParser.urlencoded({extended: false})
router.get('/registration', (req, res)=>{
    res.render('registration',{
        status:0
    })
})
router.get('/login', (req, res)=>{

    res.render('login',{
        status:0
    })
})
router.post('/registration',urlencodedParser, [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 символов').isLength({min:5})
],controller.registration)
router.post('/login',urlencodedParser, controller.login)
router.get('/users', authMiddleware,controller.getUsers)


module.exports=router
