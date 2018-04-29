import Actions from './Actions';
import Reflux from 'reflux'
import ApiRequest from './ApiRequest'


const appUrl = "http://localhost:9000/"


export default Reflux.createStore({
    listenables: Actions,
    getAppUrl:function(){
        return appUrl
    },
    onLogin:function(data){
        console.log(data)
        ApiRequest.login(data)
            .then(function(result){
                Actions.login.completed(result)
            }).catch(function(){

            })
        console.log(data)
    },onSignup:function(data){
        console.log(data)
        ApiRequest.signup(data)
            .then(function(result){
                Actions.signup.completed(result)
            }).catch(function(){

            })
        console.log(data)
    },onAuthenticate:function(data){
        ApiRequest.authenticate(data)
            .then(function(result){
                Actions.authenticate.completed(result)
            }).catch(function(){

            })
    },onOpenNextFolder:function(data){
        ApiRequest.openNextFolder(data)
        .then(function(result){
            Actions.openNextFolder.completed(result)
        }).catch(function(){

        })
    },onGetFolder:function(data){
        ApiRequest.openNextFolder(data)
        .then(function(result){
            Actions.getFolder.completed(result)
        }).catch(function(){

        })
    },onUploadFile :function(data,folderId){
        console.log(data,folderId)
        ApiRequest.uploadFile(data,folderId)
            .then(function(result){
                Actions.uploadFile.completed(result)
            }).catch(function(){

            })
    },onCreateFolder:function(data){
        ApiRequest.createFolder(data)
            .then(function(result){
                Actions.createFolder.completed(result)
            }).catch(function(){

            })
    },onDownloadFile:function(fileId,folderId,fileName){
        ApiRequest.downloadFile(fileId,folderId,fileName)
        .then(function(result){

        }).catch(function(){

        })
    },onGetAllTheUserList:function(user){
        ApiRequest.getAllTheUserList(user)
            .then(function(result){
                Actions.getAllTheUserList.completed(result)
            }).catch(function(){

            })
    },onShareFolder:function(data){
        ApiRequest.shareFolder(data)
            .then(function(result){
                Actions.shareFolder.completed(result)
            }).catch(function(){

            })
    },onAddUserInterest:function(data){
        ApiRequest.addUserInterest(data)
            .then(function(result){
                Actions.addUserInterest.completed(result)
            }).catch(function(){

            })
    }
})