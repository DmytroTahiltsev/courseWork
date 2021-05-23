const bodyParser = require("body-parser");
const session= require("express-session")
const connection=require("./MySQLConnection")
const func=require('./functions')


class queryController{
    getQuery1(req, res){
        res.render('query1-form',{
            user:req.session.user
        }) 
    }
    postQuery1(req, res){
        if(!req.body) return res.sendStatus(400);
        let query='SELECT * FROM mydb.тс_організації WHERE `Дата випуску`' + ` BETWEEN "${req.body["date-1"]}" AND "${req.body["date-2"]}";`
       
        connection.query(query, (err, result, fields) =>{
          if(err){
            return console.log(err)
          } 
          let organizations=func.SetArray(result, "Назва організації")
          console.log(req.session.user)
          res.render('query1-output', {
            queryData:result,
            reqData:req.body,
            orgNumber:organizations.length,
            user:req.session.user
         }) 
        })
    }
    getQuery2(req, res){
        res.render('query2-form',{
          user:req.session.user
      })
    }
    postQuery2(req, res){
        if(!req.body) return res.sendStatus(400);
            let query='SELECT * FROM mydb.`транспортний_засіб`' + ` WHERE Номер = "${req.body["numb"]}";`
            connection.query(query, (err, result, fields) =>{
              if(err){
                return console.log(err)
              }
              if(result[0]["Вид власника"]==="Організація"){
                let query= 'SELECT `Назва організації` FROM mydb.тс_організації WHERE `Номер ТС` =' + `"${req.body["numb"]}"`;
                connection.query(query, (err, result, fields)=>{
                  if(err){
                    return console.log(err)
                  }
                  let query= 'SELECT * FROM mydb.організації WHERE `Назва організації` =' + `'${result[0]["Назва організації"]}'`;
                  connection.query(query, (err, result, fields)=>{
                    if(err){
                      return console.log(err)
                    }
                    res.render('query2-output', {
                      user:req.session.user,
                      queryData:result,
                      reqData:req.body,
                      owner:'Організація' 
                   }) 
                  })
                })
              } 
              else if(result[0]["Вид власника"]==="Приватний"){
                let query= 'SELECT id FROM mydb.тс_приватні_власники WHERE `Номер ТС` =' + `"${req.body["numb"]}"`;
                connection.query(query, (err, result, fields)=>{
                  if(err){
                    return console.log(err)
                  }     
                  let query= 'SELECT * FROM mydb.приватні_власники WHERE id =' + `'${result[0]["id"]}'`;
                  connection.query(query, (err, result, fields)=>{
                    if(err){
                      return console.log(err)
                    }
                    res.render('query2-output', {
                      user:req.session.user,
                      queryData:result,
                      reqData:req.body,
                      owner:'Приватний' 
                   }) 
                  })
                })
              } 
            })
    }
    getQuery3(req, res){
      res.render('query3-form',{
        user:req.session.user
    })
    }
    postQuery3(req, res){

      if(!req.body) return res.sendStatus(400);
          let query='SELECT * FROM mydb.`транспортний_засіб`' + ` WHERE Номер = "${req.body["numb"]}";`
          let Accidentquery='SELECT * FROM mydb.дтп WHERE' + ` LOCATE("${req.body["numb"]}",` + '`Номери автомобілей`)'
          let accident=0
          connection.query(Accidentquery, (err, result, fields)=>{
            if(err){
              return console.log(err)
            }
            if(result.length){
              accident=1
            }
          })
          connection.query(query, (err, result, fields) =>{
            if(err){
              return console.log(err)
            }
            if(result[0]["Вид власника"]==="Організація"){
              let query= 'SELECT * FROM mydb.тс_організації WHERE `Номер ТС` =' + `"${req.body["numb"]}"`;
              connection.query(query, (err, result, fields)=>{
                if(err){
                  return console.log(err)
                }
                res.render('query3-output', {
                  user:req.session.user,
                  queryData:result,
                  reqData:req.body,
                  owner:'Організація',
                  accident:accident 
               })
              })
            } 
            else if(result[0]["Вид власника"]==="Приватний"){
              let query= 'SELECT * FROM mydb.тс_приватні_власники WHERE `Номер ТС` =' + `"${req.body["numb"]}"`;
              connection.query(query, (err, result, fields)=>{
                if(err){
                  return console.log(err)
                }     

                res.render('query3-output', {
                  user:req.session.user,
                  queryData:result,
                  reqData:req.body,
                  owner:'Приватний',
                  accident:accident 
               })
              })
            } 
          })
  }
  addVehicle(req, res){
    res.render('choose-type',{
      user:req.session.user
    })
  }
  addPrivateVehicle(req, res){
    res.render('add-private-vehicle-form',{
      user:req.session.user,
      add:0
    })
  }
  postPrivateVehicle(req, res){
    if(!req.body) return res.sendStatus(400);
    let procedure='call AddPrivateVehicle(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    let vehData=req.body
    let validQuery
    vehData=Object.values(vehData)
    vehData.splice(2, 0, "Приватний");
    console.log(vehData)
    validQuery=`SELECT * FROM mydb.транспортний_засіб WHERE Номер= "${vehData[0]}";`
    connection.query(validQuery, function(err, result, fields){
      if (err) {
        console.log(err);
       }
       console.log(result.length)
      if(!result.length){
        connection.query(procedure, vehData, function (err, result, fields) {
          if (err) {
              console.log(err);
          }
       })
    
        res.render('add-private-vehicle-form', {
          user:req.session.user,
          add:1
        })
      }
      else{
        res.status(400).json({message:'ТС с таким номером уже есть в базе данных'})
      }
    })
  }
  addOrganizationVehicle(req, res){
    res.render('add-organization-vehicle-form',{
      user:req.session.user,
      add:0
    })
  }
  postOrganizationVehicle(req, res){
    if(!req.body) return res.sendStatus(400);
    let procedure='call AddOrganizationVehicle(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    let vehData=req.body
    let validQuery
    vehData=Object.values(vehData)
    vehData.splice(2, 0, "Організація");
    console.log(vehData)
    validQuery=`SELECT * FROM mydb.транспортний_засіб WHERE Номер= "${vehData[0]}";`
    connection.query(validQuery, function(err, result, fields){
      if (err) {
        console.log(err);
       }
       console.log(result.length)
      if(!result.length){
        connection.query(procedure, vehData, function (err, result, fields) {
          if (err) {
              console.log(err);
          }
       })
    
        res.render('add-organization-vehicle-form', {
          user:req.session.user,
          add:1
        })
      }
      else{
        res.status(400).json({message:'ТС с таким номером уже есть в базе данных'})
      }
    })
  }
  deleteVehicle(req, res){
    res.render('delete-vehicle-form',{
      user:req.session.user,
      del:0
    })
  }
  postDeleteVehicle(req, res){
    if(!req.body) return res.sendStatus(400);
    let procedure='call DeleteVehicle(?);'
    const {number}=req.body
    connection.query(procedure, [number], function (err, result, fields) {
      if (err) {
          console.log(err);
      }
   })

    res.render('delete-vehicle-form', {
      user:req.session.user,
      del:1
    })
  }
}
module.exports= new queryController()