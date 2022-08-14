require('../model/data')
const mongoose = require('mongoose');
var fs = require('fs');
const { parse } = require("csv-parse");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');
const Employees = mongoose.model('Employees');

const generator = require('generate-password');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
///////Authentication admin & employee ///////////////
exports.getlogin = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('admin/login', {

        path: '/login',
        errorMessage: message
    })


}
exports.postlogin = (req, res) => {
    User.findOne({name:req.body.name}).then(docs => {
        if (docs) {
            if(docs.role == 'admin'){
                bcrypt
                .compare(req.body.password,docs.password)
                .then(doMatch => {
                    if(doMatch){
                        req.session.user = docs;
                        req.session.isLoggedIn = true;
                        req.session.userlogged = false;
                        res.redirect('/controller/listofusers')
                    }else{
                        req.flash('error', "password or username does not match")
                        return res.redirect('/controller/login') 
                    }
           
            }).catch(err => {
                req.flash('error', "password or username does not match")
                return res.redirect('/controller/login')
            });
            }else if(docs.role == 'employee'){
                bcrypt
                .compare(req.body.password,docs.password)
                .then(doMatch => {
                    if(doMatch){

                        req.session.user = docs;
                        req.session.isLoggedIn = false;
                        req.session.userlogged = true;
                        res.redirect('/controller/listofusers')
                    }else{
                        req.flash('error', "password or username does not match")
                        return res.redirect('/controller/login') 
                    }
           
            }).catch(err => {
                req.flash('error', "password or username does not match")
                return res.redirect('/controller/login')
            });

            }else{
                req.flash('error', "password or username does not match")
                return res.redirect('/controller/login')
            }
          
        } else {
           ///////FOR THE PURPOSE  EASY FIRST TIME ADMIN REGISTARTION ///////
            return bcrypt
            .hash(req.body.password, 12)
            .then(hashedPassword => {
                 const user = new User({
                name: req.body.name,
                role: 'admin',
                password:hashedPassword,
                
            });
            user.save((err,docs)=>{
                req.session.user = docs;
                req.session.isLoggedIn = true;
                req.session.userlogged = false;
                res.redirect('/controller/listofusers')
    
            })
        })  
        ///////FOR THE PURPOSE  EASY FIRST TIME ADMIN REGISTARTION ///////


                // req.flash('error', "No account match")
                // return res.redirect('/controller/login')
        
        }
    })

}



exports.manageprofile = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    User.findById(req.session.user._id).then((docs)=>{
        res.render('admin/manageprofile', {

            path: '/manageprofile',
            errorMessage: message,
            data:docs.name,
            session:req.session.user
        })
    })
 


}
exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/controller/login');
    });

};
exports.postmanageprofile = (req, res) => {
    User.findByIdAndUpdate(req.session.user._id).then(docs => {
         return bcrypt
            .hash(req.body.password, 12)
            .then(hashedPassword => {
                docs.name = req.body.name;
                docs.password = hashedPassword;
                docs.role = 'admin';
                docs.save()

             }).then(()=>{
                req.flash('error', "login changed")
                res.redirect('/controller/manageprofile')
             }) 

    })



}
///////Authentication admin & employee ///////////////

////////////List of users ///////////////////////////////////
exports.listofusers = (req, res) => {
    Employees.find().sort({_id:-1}).then(docs => {
        res.render('admin/listofusers', {

            path: '/users',
            docs: docs,
            session:req.session.user

        })
    })



}
////////////////list of users ^^^^^^^^^^^^^////////////


/////  adding csv file input, inserting it to db , Creating employee login  ///////////////////////
exports.postlink =  (req, res) => {
   
      
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    const csv = req.file;
    fs.createReadStream(csv.path)
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    Employees.findOne({email:row[1]}).then((docs=>{
        if(docs){
            return
        }else{
        const employee = new Employees({
        name: row[0],
        email:row[1],
        datejoined:row[2],
        password:row[3],
        
    });
    employee.save((err,docs)=>{
 
        return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
             const user = new User({
            _id:docs._id,
            name: row[1],
            role: 'employee',
            password:hashedPassword,
            
        });
        user.save(()=>{
            let info = transporter.sendMail({
                from: process.env.EMAIL, // sender address
                to: row[1], // list of receivers
                subject: "These is your login detailes✔", // Subject line
                text: "These are your login detailes to access this test site ", // plain text body
                html: "<h1>Login to manage your profile </h1><b>User name : "+row[1]+"</b> Password : "+password, // html body
              });

        })
    })
    }); 
        }
    }))  
   
  }).on("end", function () {
        res.redirect('/controller/listofusers')
  })
  .on("error", function (error) {
    console.log(error.message);
  });

}

/////  adding csv file input, inserting it to db , Creating employee login ^^^^^^  ///////////////////////

