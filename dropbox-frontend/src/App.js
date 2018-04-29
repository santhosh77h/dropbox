import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route,Switch} from 'react-router-dom'


import  Login from './components/Login'
import Signup from "./components/Signup";
import  Dashboard from './components/Dashboard'



const App = () => (
    <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={Dashboard} />
    </Switch>
)

export default App;
