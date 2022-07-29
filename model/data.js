const mongoose = require('mongoose');
var Schema = mongoose.Schema;


    var user = new Schema({

        name: String,
        password:String,
       
        
    
    });
    
    var User =
        mongoose.model('User', user);
    module.exports = User;

    var gamers = new Schema({

        phone: String,
        location:String,
        prizewon:String,
        spindate:Date,
        otp:{
            number:Number,
            creationdate:Date
        }
        
    
    });
    
    var Gamers =
        mongoose.model('Gamers', gamers);
    module.exports = Gamers; 
    
    var places = new Schema({

        place: String,
        link:String,
        
    });
    
    var Place =
        mongoose.model('Place', places);
    module.exports = Place;

    var winner = new Schema({

        prize: String,
        location:String,
        phone:String,
        name:String,
        address:String,
        drawdate:Date,

        
    });
    
    var Winner =
        mongoose.model('Winner', winner);
    module.exports = Winner;

    var promotions = new Schema({

        message: String,
        date:Date,
        
    });
    
    var Promotions =
        mongoose.model('Promotions', promotions);
    module.exports = Promotions;