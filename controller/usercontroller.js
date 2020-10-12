const mysql     = require('mysql');
const con       = require('../model/db');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
const nodemailer = require('nodemailer');
const { body, validationResult, matchedData } = require('express-validator');
const multer  = require('multer');
 //database demoproject 
 // table demotable



exports.validate = (method) => {
switch (method) {
    case 'signup': {
     return [ 
        body('name', 'name cant be empty').not().isEmpty(),
        body('salary', 'salary cant be empty').not().isEmpty(),
        body('email','email must be required').exists().isEmail()
       ]   
    }
    case 'login': {
     return [ 
        body('name', 'name cant be empty').not().isEmpty(),
        body('password', 'password must be required').not().isEmpty()
       ]   
    }
  }
}



module.exports.home = (req,res)=>{
 
  res.render('home');

};



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '.....@gmail.com',
    pass: '......'
  }
});



module.exports.signup = (req,res)=>{
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     console.log(errors.mapped());
     const user = matchedData(req);
     console.log(user);
      res.render('home',{ errors: errors.mapped(),user:user });
    }
        
	 else{
    
        var name    = req.body.name;
        var salary = req.body.salary;
        var email = req.body.email;
        var password = Math.random().toString(36).slice(-8);

        var sql = 'insert into demotable(name,salary,email,password) values(?,?,?,?)';
        var data = [name,salary,email,password];
           
           con.query(sql,data,(err)=>{
            if (err) throw err;
            else
             {
                 var mailOptions = {
                    from: '....@gmail.com',
                    to: '-----@gmail.com',
                    subject: 'EMS Password Recovery',
                    text: 'Hello '+email+',your password is'+ password
                 };
                
                transporter.sendMail(mailOptions, (err,result)=>{
                  if (err) throw err;
                   else
                   res.render('login');
                }); 
             }
           
           })

   }

}
  


module.exports.login = (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     console.log(errors.mapped());
     const user = matchedData(req);
     console.log(user);
      res.render('login',{ errors: errors.mapped(),user:user });
    }

  else{

      var name    = req.body.name;
      var password = req.body.password;
      var sql = 'select * from demotable where name=? and password=?';
      var data = [name,password];
      
      con.query(sql,data,(err,result)=>{
      if (err) throw err;
      else if(result.length>0)
      {
       console.log(result);
       res.send('welcome user');
         
      } 
      else
       res.send('login failed');
      
      })

  }

};













