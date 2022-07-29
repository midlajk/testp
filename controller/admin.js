require('../model/data')
const mongoose = require('mongoose');
var fs = require('fs');

const User = mongoose.model('User');
const Gamers = mongoose.model('Gamers');
const Place = mongoose.model('Place');
const Winner = mongoose.model('Winner');
const Promotions = mongoose.model('Promotions');

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
    User.find().then(docs => {
        if (!docs) {
            const user = new User({
                name: req.body.name,
                password:req.body.password,
        
            });
            user.save((docs)=>{
                req.session.user = docs;
                req.session.isLoggedIn = true;
                res.redirect('/controller/listofusers')
            });  
          
        } else {
            if (docs[0].password == req.body.password && docs[0].name == req.body.name) {
                req.session.user = docs[0];
                req.session.isLoggedIn = true;
                res.redirect('/controller/listofusers')
            } else {
                req.flash('error', "password or username does not match")
                return res.redirect('/controller/login')
            }
        }
    })

}
exports.listofusers = (req, res) => {
    Gamers.find().sort({_id:-1}).then(docs => {
        res.render('admin/listofusers', {

            path: '/users',
            docs: docs

        })
    })



}



////// Link related //////
exports.link = (req, res) => {
    Place.find().sort({_id:-1}).then(docs => {
        res.render('admin/links', {
            path: '/links',
            docs: docs

        })
    })



}
exports.postlink = (req, res) => {
    Place.findOne({place:req.body.place}).then(docs=>{
        if(docs){
            res.redirect('/controller/link')

        }else{
             const place = new Place({
        place: req.body.place,
        link:"https://vivahaavahanammoviegame"+req.body.place,
       
        
    });
    place.save((err,doc)=>{
        res.redirect('/controller/link')
    });
        }
    })
   


}
exports.deleteplace = (req, res) => {
    Place.findOneAndDelete({place:req.params.place}).then(docs=>{
        if(docs){
            res.redirect('/controller/link')

        }else{
            res.redirect('/controller/link')

        }
    })
   


}


////// Link related //////
////// Link related //////
////// Link related /////
exports.winners = (req, res) => {
 
    Winner.find().then(docs=>{
        res.render('admin/winners', {

        path: '/winners',
        docs: docs

    })
    })
    


}


exports.previousmessage = (req, res) => {
    Promotions.find().then(docs=>{
        res.render('admin/previousmessage', {

        path: '/previousmessage',
        docs: docs

    }) 
    })
   


}

exports.sendmessage = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('admin/sendpromotion', {

        path: '/sendpromotion',
        errorMessage: message,
    })


}
exports.postsendmessage = (req, res) => {
    
                const message = new Promotions({
                    date: new Date(),
                    message:req.body.message,
                
                    
                });
                message.save((err,doc)=>{
                    req.flash('error', "Message delivered")
                    res.redirect('/controller/sendmessage')

                });  
    
   
}



exports.manageprofile = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }


    res.render('admin/manageprofile', {

        path: '/manageprofile',
        errorMessage: message
    })


}
exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/controller/login');
    });

};
exports.postmanageprofile = (req, res) => {
    User.findByIdAndUpdate(req.session.user._id).then(docs => {
        docs.name = req.body.name;
        docs.password = req.body.password;
        docs.save()
        req.flash('error', "login changed")
        res.redirect('/controller/manageprofile')
    })



}