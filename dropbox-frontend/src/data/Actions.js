import Reflux from 'reflux';

let actions = Reflux.createActions([
    "test",
    {login:{asyncResult:true}},
    {signup:{asyncResult:true}},
    {authenticate:{asyncResult:true}},
    {openNextFolder:{asyncResult:true}},
    {getFolder:{asyncResult:true}},
    {uploadFile:{asyncResult:true}},
    {createFolder:{asyncResult:true}},
    {downloadFile:{asyncResult:true}},
    {shareFolder:{asyncResult:true}},
    {getAllTheUserList:{asyncResult:true}},
    {addUserInterest:{asyncResult:true}}
]);

export default actions;
