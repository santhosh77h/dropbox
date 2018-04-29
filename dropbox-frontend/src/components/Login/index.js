import React, { PropTypes, Component } from 'react';
import classnames from 'classnames'

import '../../index.css'
import {Link} from 'react-router-dom'
import {Route,Switch} from 'react-router-dom'

import Actions from '../../data/Actions'
import DataStore from '../../data/DataStore'

import Cookies from 'js-cookie'


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


export default class Login extends Component{

  constructor(props) {
    super(props);
  
    this.state = {};
  }


  componentDidMount(){
    //Actions.authenticate(cookies.get("onboarded"))
    if(Cookies.get('isAuthenticated')){
      //Actions.authenticate(Cookies.get("isAuthenticated"))
      this.props.history.replace('/dashboard')
    }
  }

  onLogin = (data) => {
    console.log(data)

    if(data.type == 'error') this.setState({msg:data.msg})
      else {
        console.log("Sasa")
        Cookies.set('isAuthenticated',data.result.userId)
        this.props.history.replace('/dashboard')
        this.setState({msg:''})
      }

    this.unsubscribe()
  }
 


  render(){

    return (
      <Jumbotron className={classnames('wrapper')} >
            
          <Grid>
              <Row className="show-grid">
                  <Col md={8}><h2>login</h2></Col>
                  <Col md={4}>
                    <Link to="/signup"><Button>SignUp</Button></Link>
                  </Col>
              </Row>
          </Grid>

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
              id="formControlsPassword"
              label="Password"
              onChange={ (event) => this.setState({pwd:event.target.value}) }
              name="password"
              type="password"
            />
            <Button onClick={ () => {
              Actions.login(this.state)
              this.unsubscribe = Actions.login.completed.listen(this.onLogin)
               } } bsStyle="primary" >
              Submit
            </Button>
            <div className="erromsg" >{this.state.msg}</div>
          </form>
            
      </Jumbotron>
    )
  }

} 