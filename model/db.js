const mongoose = require("mongoose");

// Connect to the db
const url = 'mongodb+srv://admin:admin123@cluster0.iqrdbul.mongodb.net/?retryWrites=true&w=majority'

// const url = 'mongodb://127.0.0.1:27017'
//Connect methode of mongoose
mongoose.connect(url,  err => {
    if(err) throw err;
    console.log('connected to MongoDB')
}
)

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//Connect methode of mongoose

//include employee model

require('./data');

