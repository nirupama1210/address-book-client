import React, { Component } from 'react';
// import axios from 'axios';
import {  Link } from 'react-router-dom';
import google from './icons/google.svg';
import {login, getContacts, defaultContacts } from './apiCalls';
import homelogo from './icons/HomeLogo.svg';
import {FaEye,FaEyeSlash} from 'react-icons/fa';
import GoogleLogin from 'react-google-login'
// import IconButton from "@material-ui/core/IconButton";
// import InputLabel from "@material-ui/core/InputLabel";
// import Visibility from "@material-ui/icons/Visibility";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import VisibilityOff from "@material-ui/icons/VisibilityOff";
// import Input from "@material-ui/core/Input";
// import { Navigate, useNavigate } from 'react-router';
// import { withRouter } from "react-router-dom";
class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            isDisabled:false,
            nameVal:'',
            nameError:false,
            passVal:'',
            passError:false,
            namepassError:false,
            namePassVal:'',
            show:false,
        };
        this.validateData = this.validateData.bind(this);
    }
    
    // async  getUserData(){
    //     try{
    //     return axios.get(url)
    //     }
    //     catch(error){
    //         console.error(error);
    //     }
    // }

   async checkEmailUser(user,email,pass)
{
    // let f=0;
    // let val="";
    // const response=await getUsers(user,email,pass);
    // console.log(response)
    const response = await login(user,email,pass)
    return response;

    // for(let i=0;i<response.data.length;i++)
    // {
        
    //     if((response.data[i].email===email.toLowerCase() ||response.data[i].username===user.toLowerCase())&response.data[i].password===pass)
    //     {
    //         val=response.data[i].email;
    //         f=f+1;
    //         break;
    //     }
    // }
    // if(f===0)
    // {
    //     return "";
    // }
    // else
    // {
    //     return val;
    // }
}

    handleChange(e)
    {
        const target = e.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;
  this.setState({
    [name]: value
  });
  if(e.target.name==='name'){
    if(e.target.value==='' || e.target.value===null ){
      this.setState({
        nameError:true,
        nameVal:''
      })
    } else {
      this.setState({
        nameError:false,     
        nameVal:e.target.value
      })
    }
  }
  if(e.target.name==='pass'){
    if(e.target.value==='' || e.target.value===null ){
      this.setState({
        passError:true,
        passVal:''
      })
    } else {
      this.setState({
        passError:false,     
        passVal:e.target.value
      })
    }
  }

  if(this.state.nameError===false && this.state.passError===false){
      this.setState({
        isDisabled:false
      })
   }
    }

   async validateData(e)
    {
      console.log('in function')
        e.preventDefault();
        console.log(this.state)
          if(this.state.nameError===false && this.state.passError===false && this.state.nameVal!=="" && this.state.passVal!==""){
         //   console.log(this.state.nameVal,this.state.passVal)
                let st="";
                st=await this.checkEmailUser(this.state.nameVal.toLowerCase(),this.state.nameVal.toLowerCase(),this.state.passVal);
                console.log(st)
                if(st.user!==false)
                {
                    sessionStorage.setItem("Email",st.user.email);
                  window.open('/#/contacts','_self')
                }
                else{
                  if(st.error)
                  {
                    this.setState({
                        namePassVal:'Username or password is incorrect',
                        namepassError:true
                      })
                    }
                    if(st.info.message)
                    {
                      this.setState({
                        namePassVal:st.info.message,
                        namepassError:true
                      })
                    }
                }  
        }
        else{
          console.log("YES")
          this.setState({
            nameError:true,
            passError:true
          })
        }
          
    }

    showPassword()
    {
      
      this.setState({
        show:true
      })
    }

    hidePassword(){
      this.setState({
        show:false
      })
    }

    handleFailure(res){
      console.log(res)
    }

    async handleLogin(googleData){
      const res = await fetch('https://address-book2022-server.herokuapp.com/users/google-login',{
        method: 'POST',
        body: JSON.stringify({
          token: googleData.tokenId,
        }),
        headers:{
          'Content-Type':'application/json'
        },
      });
      const data = await res.json();
      sessionStorage.setItem("Email",data.email.toLowerCase());
      const res2 = await getContacts(data.email)
     if(res2.success)
     {
      window.open('/#/contacts','_self')
     }
     else{
        const defaultData = [{
          name:"",
          phone:[],
          contactemail:[],
          address:"",
          note:"",
          tags:[],
          dob:"",
          description:"",
          social:[],
          star:false,
          profilephoto:""

          }]
        const response=await defaultContacts(data.email,defaultData)
        if(response.success)
        {
          window.open('/#/contacts','_self')
        }
        else{
          this.setState({
            namePassVal:response.error,
            namepassError:true
          })
        }
     }
      
    }

    render() {
        return (
            <div className='login'>
              <div className='about'>
                  <img src={homelogo} alt="Home" className='about-logo'/>
                  <p className='line1'>Photos, job information, and social profiles for your contacts</p>
                  <p className='line2'>So you never have to update in multiple places again</p>
              </div>
                  <div className='signin'>
                      
                          {/* <p className='header'>SIGN IN</p> */}
                          <span id='glogin' style={{fontWeight:"bold"}}>
                                  <GoogleLogin
                                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                  buttonText='Sign in with Google'
                                  onSuccess={this.handleLogin}
                                  onFailure={this.handleFailure}
                                  cookiePolicy={'single_host_origin'}
                                  
                                  render={renderProps => (
                                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} className='gbut-container'>
                                      <img src={google} alt="google" className='gbut'/>
                                      Sign in with Google</button>
                                  )}
                                  />
                        </span>
                        <div className='seperator'>
                                    &nbsp;&nbsp;
                        </div>
                          <input type="text" className='tb' id='name' value={this.state.nameVal} name='name' placeholder="Username" onChange={(e)=>this.handleChange(e)}/>
                          {this.state.nameError ? <span className='errors'>Please Enter Name</span> : ''} 
                          
                          <span className='tb'>
                          <input type={this.state.show?"text":"password"} className='passtb' id='pass' name='pass' value={this.state.passVal} placeholder="Password" onChange={(e)=>this.handleChange(e)}/>
                          {this.state.show?<FaEyeSlash color='#0D00A7' onClick={()=>this.hidePassword()} className='eye'/>:<FaEye color='#0D00A7' onClick={()=>this.showPassword()} className='eye'/>}
                          </span>
                          {this.state.passError ? <span className='errors'>Please Enter Password</span> : ''} 
                          <button className='but1' disabled={this.state.isDisabled} onClick={this.validateData}>Sign in</button>
                          {this.state.namepassError ? <span className='errors'>{this.state.namePassVal}</span> : ''} 
                          <div className='myLinks'>
                          <Link exact to='/forgot' className='link'>Forgot Password</Link>
                          <Link exact to='/account' className='link'>Create Account</Link>
                          </div>
                      </div>
                 </div>
        );
    }
}

export default Login;