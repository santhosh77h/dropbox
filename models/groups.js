var mongoose = require('mongoose')
    , shortId = require('shortid')


mongoose.set('debug', true);

var groupSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            unique: true,
            'default': shortId.generate
        },
        groupId:String,//unique
        user: {type: String,ref:'user'},//who created can delete

        groupname:String,
        groupMembers:[{type:String,ref:'user'}],
        created:{type:Date,default:Date.now()},
        status:{type:String,default:'Active',enum:['Active','Deleted']},
        folderShared:[{type:String,ref:'folder'}]
    }
);


module.exports = mongoose.model('group', groupSchema );
