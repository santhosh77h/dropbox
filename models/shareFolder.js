var mongoose = require('mongoose')
    , shortId = require('shortid')


mongoose.set('debug', true);


var shareFolder = mongoose.Schema(
    {
        _id: {
            type: String,
            unique: true,
            'default': shortId.generate
        },
        sharedBy: {type: String,ref:'user'},//who created can delete
        shareTo:{type: String,ref:'user'},
        folderId:{type:String,ref:'folder'},


        action:{type:String,enum:['read','write'],default:'read'},
        status:{type:String,enum:['valid','Invalid'],default:'valid'},
        details:{ //sharedTo Details
            name:String,
            email:String,
            userId:String,
            folderId:String
        },created:{type:Date,default:Date.now()}
    }
);


module.exports = mongoose.model('shareFolder', shareFolder );
