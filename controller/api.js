require('../model/data')
const mongoose = require('mongoose');
var fs = require('fs');
var springedge = require('springedge');
const Place = mongoose.model('Place');
const Winner = mongoose.model('Winner');

const Gamers = mongoose.model('Gamers');
const generateUniqueId = require('generate-unique-id');

exports.registeruser = async (req, res) => {
    const uid = await generateUniqueId({
        length: 4,
        useLetters: false
    })
    Gamers.findOne({ phone: req.body.phone }).then(docs => {
        if (!docs) {
            const user = new Gamers({
                phone: req.body.phone,
                location:req.body.location,
                status:"pending",
                otp:{
                    number:uid,
                    creationdate:new Date()
                }
                
            });
            user.save();
        } else {
           docs.otp.number = uid
            docs.otp.creationdate = new Date()
            docs.save()
        }

        
    })
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ number: 1 , name: 'John'}));

}
exports.verifyotp = async (req, res) => {
    Gamers.findOne({ phone: req.body.phone }).then(docs => {
        if (!docs) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: "no data found"}));
        } else {
           if(docs.otp.number==req.body.otp){
            docs.status = "verified"
            docs.save()
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: "matched"}));
           }else{
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: "nomatching"}));
           }
        }

        
    })
    

}

exports.Prizecheck = async (req, res) => {
    Place.findOne({ phone: req.body.location }).then(docs => {
        if (docs) {
            Winner.find({location:req.body.location}).then(docs=>{
                if(docs.length<2){
                    specialone()
                
                }else if(docs.length>=2&&docs.length<4){
                    specialtwo()

                }else{

                    random()
                }
            })
 
 
        }else{
            random()

        }



        
    })

    function specialone(){
       const prizeset = [{angle:'45',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'130',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'45',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'225',prize:'better luck'}];
       const random = Math.floor(Math.random() * prizeset.length);
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify({ prize: structure.prize,angle:structure.angle}));
        console.log(random, prizeset[random]);
       structure=prizeset[random]
       Winner.find({prize:structure.prize}).then(docs=>{
           if(docs){
               if(structure.prize == 'free Ticket'){

                if(docs.length>10){

                }else{
                    
                }

               }
               if(structure.prize == 'Gift voucher'){
                if(docs.length>10){

                }else{
                    
                }
                   
            }
            if(structure.prize == 'Mobile Phone'){
                if(docs.length>10){

                }else{
                    
                }
                   
            }
            if(structure.prize == 'Smart watch'){
                if(docs.length>10){

                }else{
                    
                }
                   
            }

           }else{
                if(structure.prize == 'better luck'){

                }else{

                }
           }
          
       })

    }
    function specialtwo(){
       const prizeset = [{angle:'225',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'45',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'315',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'315',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'180',prize:'Smart watch'},{angle:'45',prize:'better luck'},{angle:'130',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'45',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'45',prize:'better luck'},{angle:'45',prize:'better luck'}];

       const random = Math.floor(Math.random() * prizeset.length);
       console.log(random, prizeset[random]);
        
   }
   function random(){
       const prizeset = [{angle:'45',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'220',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'42',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'45',prize:'better luck'},{angle:'310',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'270',prize:'Gift voucher'},{angle:'180',prize:'Smart watch'},{angle:'222',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'38',prize:'better luck'},{angle:'215',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'315',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'220',prize:'better luck'},{angle:'180',prize:'Smart watch'},{angle:'180',prize:'Smart watch'},{angle:'45',prize:'better luck'},{angle:'42',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'45',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'312',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'45',prize:'better luck'},{angle:'270',prize:'Gift voucher'},{angle:'225',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'120',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'45',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'90',prize:'free Ticket'},{angle:'45',prize:'better luck'},{angle:'41',prize:'better luck'},{angle:'315',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'45',prize:'better luck'},{angle:'225',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'125',prize:'better luck'},{angle:'90',prize:'free Ticket'},{angle:'0',prize:'Mobile Phone'},{angle:'130',prize:'better luck'},{angle:'45',prize:'better luck'},{angle:'225',prize:'better luck'},];

       const random = Math.floor(Math.random() * prizeset.length);
       console.log(random, prizeset[random]);


   }
    

}