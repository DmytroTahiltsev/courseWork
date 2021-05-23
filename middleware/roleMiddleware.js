module.exports=function(roles){
    return function(req, res, next){
        if(req.method==="OPTIONS"){
            next()
        }
        try{
            console.log(req.session)
            const user=req.session.user
            if(!user){
                res.status(403).json({message:'Пользователь не  авторизован1'})
            }
            let hasRole=false
            const userRoles=user.roles
            userRoles.forEach(role => {
                if(roles.includes(role)){
                    hasRole=true
                }
            });
            if(!hasRole){
                res.send('У вас нет доступа')
            }
            next()
        }catch(e){
            console.log(e)
            res.status(403).json({message:'Пользователь не  авторизован'})
        }
    }
}