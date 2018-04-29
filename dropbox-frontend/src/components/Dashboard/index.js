import React, { PropTypes, Component } from 'react';
import classnames from 'classnames'

import '../../index.css'
import {Link} from 'react-router-dom'
import {Route,Switch} from 'react-router-dom'


import Actions from '../../data/Actions'
import DataStore from '../../data/DataStore'
import Dropdown from 'react-dropdown'
import  moment from "moment";

import Cookies from 'js-cookie'

import {Button,FormGroup,FormControl,Radio,ControlLabel,HelpBlock,Jumbotron,Grid,Row,Col,Modal,DropdownButton,MenuItem,ButtonToolbar} from 'react-bootstrap/lib';



var FontAwesome = require('react-fontawesome');


function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}


export default class Dashboard extends Component{

  constructor(props) {
    super(props);
  
    this.state = {insideFolder:[],allFolders:[],showAddFolder:false,showModal:false,userList:[],showSharedFolder:true};
  }


  onAuth = (data) => {
      if(data.type === 'error'){

      }else{
        Actions.getAllTheUserList(data.userDetails.userId)
        this.unsubscribe1 = Actions.getAllTheUserList.completed.listen(this.onUserList)
        this.setState({mainFolder:data.result.userId,userDetails:data.userDetails,interests:data.userDetails.Interests,firstFolder:data.result.userId.folderId,sharedFolders:data.sharedFolders})
      } 

      this.unsubscribe()
  }


  onUserList = (data) => {
    console.log(data)
    if(data.type === 'error') this.errorMsg("No user Found")
      else this.setState({userList:data.result})
  }


  componentDidMount(){
    //Actions.authenticate(cookies.get("onboarded"))
    if(Cookies.get('isAuthenticated')){
      this.unsubscribe = Actions.authenticate.completed.listen(this.onAuth)
      Actions.authenticate(Cookies.get("isAuthenticated"))
    }else this.props.history.replace('/')
  }

  onResponse = (data) => {
    console.log(data)
    this.unsubscribe()
    if(data.type === 'success') {
      this.setState({mainFolder:data.details})
        let insideFolder = this.state.insideFolder
        insideFolder.push(data.details)
        this.setState({insideFolder:insideFolder})
    }else {



      }
  }


  onOpenFolder =(data) => {

    if(this.state.insideFolder.length == 0){
        this.setState({showSharedFolder:false})
    }

    Actions.openNextFolder(data.folderId)
    this.unsubscribe = Actions.openNextFolder.completed.listen(this.onResponse)
    console.log(data)
  }

  
  openIntermediateFiles(item){
    console.log(item)
  }

  onRemoveFolder =(data)=>{
    if(data.type === 'success')
    this.setState({mainFolder:data.details})

  this.unsubscribe()
  }


  onBackButtonPressed = (data) => {
    console.log("onBackButtonPressed")
    if(data.type === 'success') {
      this.setState({mainFolder:data.details})
    }else {

    }
    this.unsubscribe()
  }


  onGobackFolder(){
      
    let insideFolder = this.state.insideFolder

    let folderId  =''

    if(insideFolder.length > 1){
      insideFolder.splice(insideFolder.length-1,1)
      folderId = insideFolder[insideFolder.length-1].folderId
    }else {
      insideFolder = []
      folderId = this.state.firstFolder
      this.setState({showSharedFolder:true})
    }



    this.setState({insideFolder:insideFolder})
    Actions.getFolder(folderId)
    this.unsubscribe = Actions.getFolder.completed.listen(this.onBackButtonPressed)

  }

  onFileUpload = (data) => {
    console.log("onFileUpload")
    this.unsubscribe()
    if(data.type === 'success'){
        Actions.getFolder(data.result.folderId)
        this.unsubscribe = Actions.getFolder.completed.listen(this.onBackButtonPressed)   
    } 


  }


  addFolder = () => {
      this.setState({showAddFolder:!this.state.showAddFolder})
  }


  onFolderCreation = (data) => {
      this.unsubscribe()

      console.log(data)
      this.setState({showAddFolder:false})
      if(data.type === 'success'){
        Actions.getFolder(data.folderId)
        this.unsubscribe = Actions.getFolder.completed.listen(this.onBackButtonPressed)  
      }

  }

  createFolder = (name) => {
    Actions.createFolder({name:name,userId:this.state.mainFolder.userId,folderId:this.state.mainFolder.folderId})
    this.unsubscribe = Actions.createFolder.completed.listen(this.onFolderCreation)
  }


  uploadImage = (e) =>{  

    if(e.target.value){
      console.log("file uploadimages",e.target.files[0],this.state.mainFolder)  
      var form = new FormData();
      form.append(this.state.mainFolder.folderId+'', e.target.files[0]);
      form.append('data',this.state.mainFolder.userId );


      Actions.uploadFile(form,this.state.mainFolder.folderId)
      this.unsubscribe = Actions.uploadFile.completed.listen(this.onFileUpload)
    }

  }

  dowloadFile = (item) => {
    console.log(item)
    Actions.downloadFile(item.fileId,this.state.mainFolder.folderId,item.correctFileName)
  }

  shareFolder = (item) => {
    console.log(item)
    this.setState({showModal:true,shareFolderDetails:item})
  }

  updatedShare = (data) =>{

        let mainFolder = this.state.mainFolder
        let folderList = this.state.mainFolder.folderList;

        for(var x=0;x < folderList.length;x++){
            if(folderList[x].folderId == data.folderId){
                folderList[x].userAccess.push(data.userId)
                break;
            }
        }
        mainFolder.folderList = folderList
        this.setState({mainFolder:mainFolder})

  }

  updateShowModal = () => {
    this.setState({showModal:false})
  }

  onAddingInterest = (result) => {
    if(result.type == 'error'){

    }else this.setState({interests:result.result,newInterest:''})
  }

  render(){

    const Header = () => (
      <div className={(classnames('header'))} >
          <div className={(classnames('name'))} >Name</div>
          <div className={(classnames('created'))} >Created</div>
          <div className={(classnames('members'))} >Members</div>
          <div className={(classnames('action'))} >Action</div>

      </div>
    )


    return (
      <div>
          <div className={classnames('parent')} >
              <Jumbotron className={classnames('left')}>
                  {this.state.userDetails ? <div>
                    <h4> { this.state.userDetails.profile.firstName}</h4>  
                    <h5>  { this.state.userDetails.profile.email} </h5>

                    <div className="interest" >
                      <div>
                        <FieldGroup
                          id="formControlsEmail"
                          type="email"
                          name="email"
                          value={this.state.newInterest}
                          placeholder="Add User interest"
                          onChange={ (event) => this.setState({newInterest:event.target.value}) }
                        />
                      </div>
                      <div onClick={ () => {
                        if(this.state.newInterest.length > 0 ) {
                          Actions.addUserInterest({interest:this.state.newInterest});
                          this.unsubscribe = Actions.addUserInterest.completed.listen(this.onAddingInterest)
                       }
                       } } >
                        <img src={require('../../images/plus-button.png')}/>
                      </div>        
                      </div>
                      <ul className="overFLow" >
                      {this.state.interests && this.state.interests.length > 0 && this.state.interests.map(  (item,key) => <li>{item}</li> )}
                      </ul>

                  </div>:<div/>}

                  
              </Jumbotron>
              <Jumbotron className={classnames('center')}>
                  <h3> Drop Box  </h3>
                  <div className={classnames('folderOpened')} > current Folder : /
                  {this.state.insideFolder.map((item,key) => <div onClick={ () => this.openIntermediateFiles(item) } >{item.folderName} / </div>) } <div className={classnames('back')} onClick={ () => this.onGobackFolder() } > <img src={require('../../images/left-arrow.png')}/> </div> </div>
                  <Header />

                  {this.state.showAddFolder ? <AddFolder onSubmit={this.createFolder}  /> : <div/> }

                  {this.state.showModal ? <ModalInstance folderDetails ={this.state.shareFolderDetails} updatedShare = { this.updatedShare } updateShowModal={this.updateShowModal} showModal={this.state.showModal} userList={this.state.userList} /> : <div/>}

                  {this.state.mainFolder && this.state.mainFolder.folderList.length > 0 ? <div> {this.state.mainFolder.folderList.map( (item,key) => <ListItem  shareFolder={this.shareFolder} shared={false} openFolder={this.onOpenFolder} key={item._id} list={item} />)} </div>: <div /> }
                  {this.state.mainFolder && this.state.mainFolder.fileList.length > 0 ? <div> {this.state.mainFolder.fileList.map( (item,key) => <ListFile dowloadFile={this.dowloadFile} key={item._id} list={item} />)} </div>: <div /> }
                  {this.state.showSharedFolder &&  this.state.sharedFolders && this.state.sharedFolders.length > 0 ? <div> <h4> Shared Folders</h4> {this.state.sharedFolders.map( (item,key) => <ListShare key={item._id} shareFolder={this.shareFolder} shareList={item} openFolder={this.onOpenFolder} />)} </div> : <div /> }


              </Jumbotron>
              <Jumbotron className={classnames('right')}>
                  <div onClick={ () => this.addFolder() } >  Add Folder  </div>
                  <div> 
                    <input id="file" className={classnames('inputfile')} type="file" onChange={this.uploadImage} /> 
                    <label for="file">Upload file</label>
                  </div>
              </Jumbotron>

          </div>
      </div>
    )
  }

} 


class ListShare extends Component{
    constructor(props) {
      super(props);
      console.log(this.props.shareList);   
      this.state = {shareList:this.props.shareList};
    }

    componentDidMount(){
        console.log(this.props)
    }

    render(){
        return(<div>
            <div> {this.state.shareList.folderId.folderList.map( (item,key) => <ListItem sharedDetails={this.props.shareList} shareFolder={this.props.shareFolder} openFolder={this.props.openFolder} key={item._id} list={item} />)} </div>


        </div>)
    }

}


class ModalInstance extends Component {
  constructor(props) {
      super(props);
      console.log("Dsadasda")
      this.state = {folderDetails:this.props.folderDetails,errorMsg:'',showModal:this.props.showModal,userList:this.props.userList,actionSelected:''}
  }


  componentDidMount(){
    //this.setState({showModal:true})
  }


  componentWillReceiveProps(nextProps){

    if(nextProps != this.props){

      if(nextProps.showModal != this.props.showModal)
      this.setState({showModal:nextProps.showModal})
      
      if(this.state.folderDetails.folderId != nextProps.folderDetails.folderId){
        
      }

    }

    
  }



  close =() => {
    this.setState({ showModal: false });
    this.props.updateShowModal()
  }

  _onSelect = (data) => {
    console.log(data)
    //defaultOption = data
  }
  actionSelected = (data) => {
    console.log(data);
    this.setState({actionSelected:data})
  }

  shareFolder = (item) => {
    console.log(item)
    this.setState({errorMsg:''})
    if(item.actionSelected != '' ){
      let data = {
        folderId:this.state.folderDetails.folderId,
        shareEmail :item.profile.email,
        userId:this.state.folderDetails.userId,
        action:item.actionSelected,
      }
      Actions.shareFolder(data)
      this.unsubscribe = Actions.shareFolder.completed.listen(this.onSave)
    }
  }

  onSave = (data) => {
    this.unsubscribe()
    if(data.type =='success'){
      this.setState({showModal:false})
      this.props.updatedShare(data)
      this.props.updateShowModal()
    }else this.errorMsg = data.msg
  }

  render(){

    return(<div className="static-modal">
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title> Share Folder : {this.state.folderDetails.folderName} </Modal.Title>
          </Modal.Header>
              { this.state.userList && this.state.userList.length > 0 && this.state.userList.map( (item,key) => <div>
                  <div className="shareUser">
                      <div>
                          {item.profile.firstName} ({item.profile.email})
                      </div>
                      <div className="submitUser" >
                            <FormGroup>
                              <Radio onClick={()=>{this.actionSelected('read');item.actionSelected='read';}}  name="radioGroup" inline>
                                Read
                              </Radio>
                              {' '}
                              <Radio onClick={()=>{this.actionSelected('write');item.actionSelected='write';}} name="radioGroup" inline>
                                Write
                              </Radio>

                            </FormGroup>
                            <Button bsStyle="primary" onClick={ () => this.shareFolder(item) } className="submitClass" >Submit</Button>

                      </div>
                  </div>

              </div> )}
          <Modal.Footer>
          {this.state.errorMsg}
            <Button onClick={() => this.setState({showModal:false})}>Close</Button>
          }
          </Modal.Footer>
        </Modal>
      </div>)
  }
}



class AddFolder extends Component{


  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){


    return(
      <div className={classnames('mainList')} >
          <div className={classnames('folderName')}> 

          <FieldGroup
              id="formControlsEmail"
              type="email"
              name="email"
              placeholder="Enter Folder Name"
              onChange={ (event) => this.setState({folder:event.target.value}) }
            />
            <Button onClick={ () => this.props.onSubmit(this.state.folder) }  bsStyle="primary" >Add</Button>
          </div>
          <div className={classnames('folderCreated')}></div>
          <div className={classnames('folderShare')}> </div>
          <div className={classnames('folderAction')}></div>

      </div>)
  }

}


class ListItem extends Component{


  constructor(props) {
    super(props);

    console.log(this.props)
    this.state = {item:this.props.list,msg:''};
  }

  render(){


    return(
      <div className={classnames('mainList')} >
          <div onClick={ () => this.props.openFolder(this.state.item) } className={classnames('folderName')}> <div><img src={require('../../images/folder.png')}/></div> {this.state.item.folderName} <FontAwesome 
        name='star'
        style={{ fontSize:'18px',paddingLeft:'10px',textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',color:"#fffe04" }} /> </div>
          <div className={classnames('folderCreated')}>{moment(this.state.item.created).format('MM-DD-YYYY hh:mm a')}</div>
          <div className={classnames('folderShare')}> {this.state.item.userAccess.length +1 } member</div>
          <div className={classnames('folderAction')}>
              <div className="showAction" >
                  <Button onClick={ () =>  {if(!this.props.sharedDetails)this.props.shareFolder(this.state.item);
                  else this.setState({msg:'This folder is shared'}) }} >Share</Button>
                    <br/>{this.state.msg}
              </div>  

          </div>

      </div>)
  }

}

class ListFile extends Component{


  constructor(props) {
    super(props);
    this.state = {item:this.props.list};
  }

  render(){


    return(
      <div className={classnames('mainList')} >
          <div onClick={ () => this.props.dowloadFile(this.state.item) } className={classnames('fileName')}>  <div><img src={require('../../images/file.png')}/></div>{this.state.item.correctFileName}<FontAwesome className='super-crazy-colors'
        name='star'
        style={{ fontSize:'18px',paddingLeft:'10px', textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} /> </div>
          <div className={classnames('fileCreated')}>{moment(this.state.item.created).format('MM-DD-YYYY hh:mm a')}</div>
          <div className={classnames('fileShare')}> Only You </div>
          <div className={classnames('fileAction')}></div>

      </div>)
  }

}