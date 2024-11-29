// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var childSchema = mongoose.Schema({
    name           : String,
    dob           : Date,
    gender         :String,
    location:       String,
    allergies     : String,
    medications    : String,
    photo           :String
})
const Child = mongoose.model('Child',childSchema)


// define the schema for our user model
// var userSchema = mongoose.Schema({

//     local            : {
//         email        : String,
//         password     : String
//     },
//     facebook         : {
//         id           : String,
//         token        : String,
//         name         : String,
//         email        : String
//     },
//     twitter          : {
//         id           : String,
//         token        : String,
//         displayName  : String,
//         username     : String
//     },
//     google           : {
//         id           : String,
//         token        : String,
//         email        : String,
//         name         : String
//     }

// });
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        userType     : String,
        name         : String,
        dob          : Date,
        gender       : String,
       familySize    : Number, 
       photo         : String,
       bio           :String,
      
        children : [childSchema]     
   
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
        
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);
module.exports = {User,Child}
// module.exports = User