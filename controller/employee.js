require('../model/data')
const mongoose = require('mongoose');
var fs = require('fs');
const Employees = mongoose.model('Employees');
const User = mongoose.model('User');

exports.deleteemployee = async (req, res) => {
  
    Employees.findOneAndDelete({_id:req.params.id}).then(()=>{
        User.findByIdAndDelete(req.params.id).then(()=>{
            res.redirect('/controller/listofusers')

        })

    })
   
}

exports.viewemployee = async (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    Employees.findById(req.params.id).then((docs)=>{
        res.render('admin/userdata', {

            path: '/userdata',
            docs: docs,
            errorMessage:message,
            session:req.session.user
        })
    })
   
}
exports.updateemployee = async (req, res) => {
  console.log(req.body.id)
    Employees.findByIdAndUpdate(req.body.id).then((docs)=>{
       docs.name = req.body.name
       docs.email = req.body.email
       docs.datejoined = req.body.datejoined
       docs.password = req.body.password
docs.save()
    }).then(()=>{
        res.redirect('/employee/'+req.body.id)
    })
   
}
