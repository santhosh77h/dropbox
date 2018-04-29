var mongoose = require('mongoose')
    , shortId = require('shortid')
    ,bcrypt = require('bcrypt-nodejs');


mongoose.set('debug', true);

var userSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            unique: true,
            'default': shortId.generate
        },
        userId: {type: String},//had to be unique
        profile:{
            firstName:String,
            lastName:String,
            email:String,//unique
        },
        Interests:[],//array of intersts
        about:{
            overview:String,
            work:String,
            education:String,
            contactInfo:String,
            lifeEvent:String
        },
        created:{type:Date,default:Date.now()},
        password:String,
        sharedFolders:[{type:String,ref:'shareFolder'}],
        mainFolder:{type:String,ref:'folder'},//this will hold first folder of a user which is non deleteable
    }
);

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', userSchema );
