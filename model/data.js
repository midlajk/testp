const mongoose = require('mongoose');
var Schema = mongoose.Schema;


    var user = new Schema({

        name: String,
        role: String,
        password:String,
       
        
    
    });
    
    var User =
        mongoose.model('User', user);
    module.exports = User;

    var employees = new Schema({

        name: String,
        email:String,
        datejoined:String,
        password:String,
        
    
    });
    
    var Employees =
        mongoose.model('Employees', employees);
    module.exports = Employees; 
    
