var express = require('express');
var router = express.Router();
var validator = require('validator');
var uuid = require('node-uuid');
var multer = require('multer')
var path = require('path')
//var profileUpload = multer({dest:__dirname +'/../../files/'})

//mongoose schema
var Users = require('../models/users')
var Folders = require('../models/folders')
var SharedFolders = require('../models/shareFolder')
var GroupUsers = require('../models/groups')


var console = require('tracer').console(
    {
        format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
        dateformat: "HH:MM:ss.L"
    });

function validateEmail(email){
  return validator.isEmail(email)
}


function checkUserByEmail(email,clb){
    Users.findOne({'profile.email':new RegExp('^'+email+'$','i')})
    .exec(function(err,nuser){
		console.log(err)
		console.log(nuser)
        if(nuser) clb(false,nuser)
        else if(err) clb(false,false)
        else clb(null,null)
    })
}

function getUserDefaultPage(email,clb){
    Users.findOne({'profile.email':new RegExp('^'+email+'$','i')})
    .populate({path:'mainFolder',populate:{path:'folderList'}})
    .exec(function(err,nuser){
        if(nuser) clb(false,nuser)
        else if(err) clb(false,false)
        else clb(null,null)
    })
}


const isLoggedIn = (req,res,next) =>{
  console.log(req.session,'session')
  if(!req.session.user){
    res.redirect('http://localhost:3000/')
  }
  else next()
}

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Express' });
});
router.get('/login',function(req,res){
  console.log(req.body)
  res.render('index')
})

router.post('/signup', function(req, res, next) {
	console.log("Dasdasd")
  let body = req.body.data
  if(validateEmail(body.email)){
    checkUserByEmail(body.email,function(err,nuser){
      if(nuser) res.send({type:'error',msg:'User already Exist'})
      else if(err) res.send({type:'error',msg:'Something went wrong'})
      else {
        if(validator.isAlpha(body.name) && body.pwd.length > 0 ){
          var newuser = new Users()
          newuser.profile.firstName = body.name
          newuser.userId = uuid.v4()
          newuser.profile.email = body.email
          console.log(newuser.generateHash(body.pwd))
          newuser.password = newuser.generateHash(body.pwd)
          newuser.save(function(err,nuser){
            var newFolders = new Folders()
            newFolders.userId = nuser._id
            newFolders.folderName = 'Main'//main folder of a user
            newFolders.folderId = uuid.v4()
            newFolders.save(function(err,newFolder){
              nuser.mainFolder = newFolder._id
              nuser.save(function(){
                  res.send({type:'success',msg:'User Registerd Successfully please login'})
              })
            })
          })

        }else res.send({type:'error',msg:'Invalid Name or password'})
      }
    })
  }
});


router.post('/authenticate',isLoggedIn,function(req,res){

  console.log(req.body)


  console.log(req.session.user)
  if( true || req.body.data == req.session.user.userId){
    Users.findOne({userId:req.session.user.userId})
      .populate({path:'sharedFolders',populate:{path:'folderId',model:'folder',populate:{path:'folderList',model:'folder'}}})
      .exec(function(err,nuser){
        if(nuser){
          Folders.findOne({_id:nuser.mainFolder})
            .populate({path:'folderList'})
            .exec(function(err,result){
              res.send({type:'success',result:{userId:result},userDetails:nuser,sharedFolders:nuser.sharedFolders})
            })
        }
      })
  }else res.redirect('/')

  
})

router.post('/login',function(req, res, next) {
  console.log("czxczxczzz")
  console.log(req.session)
  let body = req.body.data
  console.log(body)
  if(validateEmail(body.email)){
    checkUserByEmail(body.email,function(err,nuser){
      if(nuser) {
        if(nuser.validPassword(body.pwd)){
			   req.session.user = nuser
         res.send({type:'success',result:{userId:nuser.userId}})

        //  console.log(req.session,"session")
        //  //by default showing main folder
        //   Folders.findOne({_id:nuser.mainFolder})
    				// .populate({path:'folderList'})
    				// .exec(function(err,result){
    					
    				// })
        }else res.send({type:'error',msg:'Invalid Password'})
      }else if(err) res.send({type:'error',msg:'Something went wrong'})
      else res.send({type:'error',msg:'Invalid Name or password'})
    })
  }
});


function  createNewFolder(name,userId,clb) {
    var newFolders = new Folders()
    newFolders.userId = userId
    newFolders.folderName = name
    newFolders.folderId = uuid.v4()
    newFolders.save(function(err,newFolder){
      if(err) clb(false)
        else clb(false,newFolder._id)
    })
}


// create new folder
router.put('/folders/:folderId',function(req,res){
  console.log(req.session.user)
  console.log(req.params)
   Folders.findOne({folderId:req.params.folderId})
   .populate({path:'userId'})
     .exec(function(err,folder){
        console.log(folder)

        if(req.session.user.userId == req.body.userId || req.session.user._id == req.body.userId){
          if(folder.userId.userId == req.session.user.userId){
            if(req.body.name.length > 0){
              createNewFolder(req.body.name,req.session.user._id,function(err,newFolderId){
                  if(err)res.send({type:'error',msg:'Somthing went wrong'})
                    else {
                      folder.folderList.push(newFolderId)
                      folder.save(function(){
                        res.send({type:'success',msg:'Successfully Created Folder',folderId:req.params.folderId})
                      })
                    }
              })
            }
          }
        }
     })

})

//update folder star or unstar
router.post('/folders/:folderId',function(req,res){
  console.log(req.session.user)
  console.log(req.params)
   Folders.findOne({folderId:req.params.folderId})
     .exec(function(err,folder){
        console.log(folder)
        folder.starFolder = !folder.starFolder
        folder.save(function(err,nfolder){
          if(nfolder) res.send({type:'Success',msg:'Successfully '+ (nfolder.starFolder ? 'stared':'unstared')+'.'})
            else res.send({type:'error',msg:'Something went wrong'})
        })
     })
})

//adding user interest
router.post('/addUserInterest',function(req,res){
  Users.findOneAndUpdate({_id:req.session.user._id},{$push:{Interests:req.body.data.interest}},{new:true})
    .exec(function(err,result){
      if(err){
        res.send({type:'error'})
      }else if(result) res.send({type:'success',result:result.Interests})
    })

})



//opening folder and list of files on click of folder
router.get('/folders/:folderId',function(req,res){
  console.log(req.session.user)
  console.log(req.params)
   Folders.findOne({folderId:req.params.folderId})
    .populate({path:'folderList fileList'})
     .exec(function(err,folder){
        if(folder)res.send({type:'success',details:folder})
         else res.send({type:'error',msg:'Something went wrong'}) 
     })
})


//download a file on click of file
router.post('/fileInFolder/:folderId/:fileId',function(req,res){
  console.log(req.session.user)
  console.log(req.params) //userId:req.session.user._id,sharedTo:req.session.user._id,
   Folders.findOne({folderId:req.params.folderId,fileList:{$elemMatch:{fileId:req.params.fileId}}},{'fileList.$':1})
     .exec(function(err,folder){
        if(folder){
          let fileName = folder.fileList[0].name.split('add')
          res.download(path.join(__dirname, '../files/'+folder.fileList[0].name),fileName[2])
        }else if(err == null){
          SharedFolders.findOne({folderId:req.params.folderId})          
            .exec(function(err,shared){
              if(shared){
                if(shared.status == 'valid') {
                  Folders.findOne({folderId:req.params.folderId,userId:shared.sharedBy,fileList:{$elemMatch:{fileId:req.params.fileId}}},{'fileList.$':1})
                   .exec(function(err,folder){
                      if(folder) { 
                          let fileName = folder.fileList[0].name.split('add')
                          res.download(path.join(__dirname, '../files/'+folder.fileList[0].name),fileName[2])
                      }else res.send({type:'error',msg:'Invalid Details'})
                      
                    })
                }
              }else res.send({type:'error',msg:'Somthing went wrong'})
            })
        }        
     })
})


  console.log(path.join(__dirname, '../files/'))


  router.put('/createGroup',function (req,res) {
    let body = req.body
    if(req.session.user.userId == req.body.userId){
      if(body.groupname && body.groupname.length > 0){
        let newGroup = new GroupUsers()
        newGroup.user = req.session.user._id
        newGroup.groupname = req.body.groupname
        newGroup.groupId = uuid.v4()
        newGroup.save(function(err,ngroup){
          if(ngroup) res.send({type:'success',msg:'Created Group Successfully',result:{groupId:ngroup.groupId}})
            else res.send({type:'error',msg:'Somthing not correct'})
        })
      }else res.send({type:'error',msg:'Invalid Details'})
    }else res.send({type:'error',msg:'Somthing not correct'})
  })

router.post('/group/addFolder',function (req,res) {

    /*{
      folderId:"c6804683-cf60-477f-aac5-746915244c81", //folder to share
      groupId :"ec013102-8359-4a26-afa5-450319f9e0c1",//registerende user with whom you can share
      userId:"d7n04683-cf60-477f-aac5-746915244c81",//owner of the folder
      actin:"read",//can take only read or write nothing is given assumes read-
    }*/

    console.log(req.body)
    let body = req.body

    if(req.session.user.userId == req.body.userId){
      GroupUsers.findOne({groupId:body.groupId,user:req.session.user._id})
        .exec(function(err,group){
          if(group){
            if(group.status == 'Active'){
              Folders.findOne({folderId:body.folderId,userId:req.session.user._id})
                .exec(function(err,nFolder){
                  if(nFolder){
                    if( nFolder._id.indexOf(group.folderShared) > 0){
                        res.send({type:'error',msg:'This folder is already shared in this group'})
                      }else {
                        group.folderShared.push(nFolder._id)
                        group.save(function(err,ngroup){
                          GroupUsers.findOne({groupId:body.groupId})
                            .populate({path:'user groupMembers folderShared',selecte:'-password'})
                            .exec(function(err,updatedGroup){
                                if(updatedGroup) res.send({type:'success',result:updatedGroup})
                                  else res.send({type:'error',msg:'Somthing went wrong'})
                            })
                        })
                      }
                  }else res.send({type:'error',msg:'don\'t have access'})
                })
            }else res.send({type:'error',msg:'don\'t have access'})
          }else res.send({type:'error',msg:'don\'t have access'})
        })
    }else res.send({type:'error',msg:'Somthing went wrong'})
  })


router.post('/group/addUser',function (req,res) {

    /*{
      folderId:"c6804683-cf60-477f-aac5-746915244c81", //folder to share
      groupId :"ec013102-8359-4a26-afa5-450319f9e0c1",//registerende user with whom you can share
      userId:"d7n04683-cf60-477f-aac5-746915244c81",//owner of the folder
      actin:"read",//can take only read or write nothing is given assumes read-
    }*/

    console.log(req.body)
    let body = req.body

    if(req.session.user.userId == req.body.userId){
      GroupUsers.findOne({groupId:body.groupId,user:req.session.user._id})
        .exec(function(err,group){
          if(group){
            if(group.status == 'Active'){
              checkUserByEmail(body.emai,function(err,nuser){
                if(nuser) {
                  if(nuser._id.indexOf(gr)){}
                }else res.send({type:'error',msg:'User doesn\'t exist'})
              })
            }else res.send({type:'error',msg:'don\'t have access'})
          }else res.send({type:'error',msg:'don\'t have access'})
        })
    }else res.send({type:'error',msg:'Somthing went wrong'})
  })


  
  router.post('/getAllTheUserList',function(req,res){
    Users.find({userId:{$ne:req.body.data}},{profile:1,userId:1})
      .exec(function(err,result){
        if(result && result.length > 0){
          res.send({type:'success',result:result})
        }else res.send({type:'error',msg:'No one found'})
      })
  })



  router.post('/shareFolder/email',function(req,res){

    /*{
          folderId:"c6804683-cf60-477f-aac5-746915244c81", //folder to share
          shareEmail :"user@gmail.com",//registerende user with whom you can share
          userId:"d7n04683-cf60-477f-aac5-746915244c81",//owner of the folder
          action:"read",//can take only read or write nothing is given assumes read-
        }*/


      let body = req.body.data


      console.log(body)
      console.log(req.session.user)


      console.log(req.session.user.userId == body.userId , body.shareEmail != req.session.user.profile.email , body.action , body.action.length > 0)
      if(req.session.user._id == body.userId && body.shareEmail != req.session.user.profile.email && body.action && body.action.length > 0){
        checkUserByEmail(body.shareEmail,function(err,nuser){
            if(nuser){
              Folders.findOne({folderId:body.folderId,userId:req.session.user._id})  
                .exec(function(err,folder){
                  if(folder) {
                    let newShared = new SharedFolders()
                    newShared.sharedBy = req.session.user._id
                    newShared.shareTo = nuser._id
                    newShared.folderId = folder._id
                    newShared.action = body.action.indexOf(['read','write']) > -1 ? body.action : 'read'
                    newShared.details = {
                      name : nuser.profile.firstName,
                      email:nuser.profile.email,
                      userId:nuser.userId,
                      folderId:body.folderId
                    }
                    newShared.save(function(err,shared){

                      console.log(err)
                      console.log(shared._id)

                      if(shared) {
                        folder.sharedUserList.push(shared._id)
                        folder.userAccess.push(nuser._id)
                        folder.save(function(){
                          nuser.sharedFolders.push(shared._id)
                          nuser.save(function(err,userShared){
                            res.send({type:'error',msg:'Shared successfully with '+shared.details.name,folderId:folder._id,userId:nuser._id})  
                          })
                        })
                      } else res.send({type:'error',msg:'Somthing not good'})
                    })

                  }else res.send({type:'error',msg:'you don\'t have access to share'})
                })
            } else res.send({type:'error',msg:'User not exist with us'})     
        })
      }else res.send({type:'error',msg:'Somthing not good'})
      


  })


  //adding files to the server for a particular folderId

  router.put('/fileInFolder/:folderId',function(req,res,next){ //this request will be used to send the file to client
    console.log(req.body)
    let fileId = uuid.v4()

    var storage = multer.diskStorage({
      destination: function(req, file, callback) {
        console.log(file.fieldname)
        callback(null, path.join(__dirname, '../files/'))
      },
      filename: function(req, file, callback) {
        console.log(file.originalname)
        callback(null, file.fieldname + 'add'+fileId+"add"+ file.originalname)
      }
    })



    var upload = multer({
          storage: storage
        }).single(req.params.folderId);

        upload(req, res, function(err,result) {
          console.log(err)
          console.log(req.file)
          console.log(req.body)
          if(!err){
          let fileName = req.file.filename.split('add')
          Users.findOne( {$or:[{_id:req.body.data},{userId:req.body.data}]} )
          .exec(function(err,user){
            if(user){
              Folders.findOne({userId:user._id,folderId:req.params.folderId})
              .exec(function(err,folder){
                  if(folder){
                    var upload = multer({
                      storage: storage
                    }).single(req.params.folderId);

                    upload(req, res, function(err,result) {
                       folder.fileList.push({
                          name:req.file.filename,
                          fileId:fileId,
                          createdBy:user._id,
                          correctFileName:fileName[2]
                       })
                       folder.save(function(err,fileInFolder){
                          if(fileInFolder) res.send({type:'success',result:{name:req.file.filename,folderId:req.params.folderId}})
                            else res.send({type:'error',msg:'Somthing went wrong'})
                       })
                    })
                  }else if(err == null){
                      SharedFolders.findOne({'details.shareTo':user._id,'details.folderId':req.params.folderId})
                      .exec(function(err,shared){
                        if(shared){
                          if(shared.action == 'write'){
                            var upload = multer({
                              storage: storage
                            }).single(req.params.folderId);

                            upload(req, res, function(err,result) {
                              console.log(err,req.file)
                              Folders.findOne({folderId:req.params.folderId,userId:shared.sharedBy})
                                .exec(function(err,folder){
                                  let fileId = uuid.v4()
                                   folder.fileList.push({
                                      name:req.file.filename,
                                      fileId:fileId,
                                      createdBy:user._id,
                                      correctFileName:fileName[2]
                                   })
                                   folder.save(function(err,fileInFolder){
                                      if(fileInFolder) res.send({type:'success',result:{name:req.file.fileame,fileId:fileId,folderId:req.params.folderId}})
                                        else res.send({type:'error',msg:'Somthing went wrong'})
                                   })
                                })
                            })
                          }else res.send({type:'error',msg:'Do not have permission to write'})
                        }else res.send({type:'error',msg:'Somthing went wrong'})
                      })
                  }
              })
            }else res.send({type:'error',msg:'Somthing went wrong'})
        })
        }else res.send({type:'error',msg:'Something went wrong'})
      })
      //res.send({type:'errer'})
  })

router.use(() => console.log("default route"))

router.route('/fileInFolder/:folderId')
	.get((req,res) => { //this request will be used to send the file to client
		  console.log("adasda")
      res.send({type:'errer'})
	}).post( (req,res) => { //update file from stared vice versa
    console.log("dasdasd")
    if(req.query.folderId && req.body.fileId){
      Folders.findOne({folderId:req.query.folderId,fileList:{$elemMatch:{fileId:req.body.fileId}}},{'fileList.$':1})
      .exec(function(err,folder){
        folder.fileList[0].stared = !folder.fileList[0].stared 
        folder.save(function(){
          res.send({type:'success',msg:'Updated Successfully'})
        })
      })
    }else res.send({type:'error',msg:'Imvalid Details'})
	}).delete((req,res)=>{ // delete file
		Folders.update({folderId:req.query.folderId},{$pull:{fileList:{fileId:req.body.fileId}}})
		.exec(function(err,folder){
			res.send({type:'success',msg:'Deleted Successfully'})
		})
	})

// router.route('/folders/:folderId')
// 	.get((req,res) => {
		
// 	}).post( (req,res) => {
// 		Folders.findOne({folderId:req.query.folderId,fileList:{$elemMatch:{fileId:req.body.fileId}}},{'fileList.$':1})
// 		.exec(function(err,folder){
// 			folder.fileList[0].stared = !folder.fileList[0].stared 
// 			folder.save(function(){
// 				res.send({type:'success',msg:'Updated Successfully'})
// 			})
// 		})
// 	}).delete((req,res)=>{
// 		Folders.update({folderId:req.query.folderId},{$pull:{fileList:{fileId:req.body.fileId}}})
// 		.exec(function(err,folder){
// 			res.send({type:'success',msg:'Deleted Successfully'})
// 		})
// 	}).put((req,res)=>{ //create a folder inside a folder
//     console.log(req.body)
// 		Folders.findOne({folderId:req.query.folderId})
// 		.exec(function(err,folder){
			
// 		})
// 	})



module.exports = router;


