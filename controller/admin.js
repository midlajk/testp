require('../model/data')
const mongoose = require('mongoose');
var fs = require('fs');
const { parse } = require("csv-parse");
const nodemailer = require("nodemailer");

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
            if(docs.role == 'admin' && docs.password == req.body.password){
                req.session.user = docs;
                req.session.isLoggedIn = true;
                req.session.userlogged = false;
                res.redirect('/controller/listofusers')
            }else if(docs.role == 'employee' && docs.password == req.body.password){
                req.session.user = docs;
                req.session.isLoggedIn = false;
                req.session.userlogged = true;
                res.redirect('/controller/listofusers')
            }else{
                req.flash('error', "password or username does not match")
                return res.redirect('/controller/login')
            }
          
        } else {
           
                req.flash('error', "No account match")
                return res.redirect('/controller/login')
        
        }
    })

}
exports.listofusers = (req, res) => {
    Employees.find().sort({_id:-1}).then(docs => {
        res.render('admin/listofusers', {

            path: '/users',
            docs: docs,
            session:req.session.user

        })
    })



}


/////adding csv ///////////////////////
exports.postlink = async (req, res) => {
   
      
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
 
        const user = new User({
            _id:docs._id,
            name: row[1],
            role: 'employee',
            password:password,
            
        });
        user.save(async(docs)=>{
            let info = await transporter.sendMail({
                from: process.env.EMAIL, // sender address
                to: row[1], // list of receivers
                subject: "These is your login detailes✔", // Subject line
                text: "These are your login detailes to access this test site ", // plain text body
                html: "<h1>Login to manage your profile </h1><b>User name : "+row[1]+"</b> Password : "+password, // html body
              });

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
            data:docs,
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
        docs.name = req.body.name;
        docs.password = req.body.password;
        docs.role = 'admin';
        docs.save()
        req.flash('error', "login changed")
        res.redirect('/controller/manageprofile')
    })



}