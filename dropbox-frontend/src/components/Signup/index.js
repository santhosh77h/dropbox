
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames'

import '../../index.css'
import {Link} from 'react-router-dom'
import {Route,Switch} from 'react-router-dom'

import Actions from '../../data/Actions'
import DataStore from '../../data/DataStore'


import {Button,FormGroup,FormControl,ControlLabel,HelpBlock,Jumbotron,Grid,Row,Col} from 'react-bootstrap/lib';


function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}


export default class Signup extends Component{

  constructor(props) {
    super(props);
  
    this.state = {};
  }


  onSignup = (data) => {
    console.log(data)

    if(data.type == 'error') this.setState({msg:data.msg})
      else this.setState({msg:'User Creted',email:'',pwd:'',name:''})

    this.unsubscribe()
  }
 


  render(){
    
    return (
      <Jumbotron className={classnames('wrapper')} >
            
          <h2>SignUp</h2>

          <form>
            <FieldGroup
              id="formControlsEmail"
              type="email"
              label="Email address"
              name="email"
              placeholder="Enter email"
              onChange={ (event) => this.setState({email:event.target.value}) }
            />
            <FieldGroup
              id="formControlsName"
              type="email"
              label="Enter Name"
              name="email"
              placeholder="Name"
              onChange={ (event) => this.setState({name:event.target.value}) }
            />
            <FieldGroup
              id="formControlsPassword"
              label="Password"
              onChange={ (event) => this.setState({pwd:event.target.value}) }
              name="password"
              type="password"

            />
            <Button onClick={ () => {
              Actions.signup(this.state)
              this.unsubscribe = Actions.signup.completed.listen(this.onSignup)
               } } bsStyle="primary" >
              Submit
            </Button>
            <div className="erromsg" >{this.state.msg}</div>
          </form>
            
      </Jumbotron>
    )
  }

} 