var mongoose = require('mongoose')
    , shortId = require('shortid')


mongoose.set('debug', true);

var fileSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            unique: true,
            'default': shortId.generate
        },
        name:String,
        created:{type:Date,default:Date.now()},
        stared:{type:Boolean,default:false},
        fileId:String,
        correctFileName:String,
        createdBy:{type:String,ref:'user'}
    }
);


var folderSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            unique: true,
            'default': shortId.generate
        },
        folderId:String,//unique 2)for folder delete just add inactive infront of this id so nothing references
        folderName:String,//may not be unique
        starFolder:{type:Boolean,default:false},
        userId: {type: String,ref:'user'},//who created can delete


        created:{type:Date,default:Date.now()},


        fileList:[fileSchema],//list of files
        folderList:[{type:String,ref:'folder'}], // each folder can have multiple folders inside

        sharedUserList:[{type:String,ref:'shareFolder'}],//list of users connnected to the  particular folder

        userAccess:[{type:String,ref:'user'}], //give acces by sharing a folder
        groupAccess:[{type:String,ref:'group'}], //sharing a folder by giving acces to a group
    }
);


module.exports = mongoose.model('folder', folderSchema );
