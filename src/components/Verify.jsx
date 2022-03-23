import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {verify, defaultContacts, getContacts } from './apiCalls';
import { Link } from 'react-router-dom';
import homelogo from './icons/HomeLogo.svg';

class Verify extends Component {
    constructor() {
        super();
        this.state={
            error:'',
            token:''
        }
        this.validateData = this.validateData.bind(this);
    }

    async handleChange(e)
    {
        if(e.target.value==='' || e.target.value===null ){
            this.setState({
              error:'Please enter your token'
            })
          } else {
            this.setState({
              token:e.target.value
            })
          }
    }


    async checkUser(token)
   {
       const response=await verify(token);
      return response;
   }

   async createContact(email)
   {
       const data = [{
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
    
        }
        ]
    const response=await defaultContacts(email,data)
    return response;
   }

   async validateData(e)
   {
       e.preventDefault();

        console.log(this.state)
       if(this.state.token!==''){
           try{
               const res = await this.checkUser(this.state.token)
               console.log(res)
               if(res.success){
                const email = res.email;
                const data = await getContacts(email)
                if(data.error)
                {
                    const newres = await this.createContact(email)
                    if(newres.success)
                        {this.setState({
                            error:'Account Verified. Please Login',
                            token:''
                            });
                        }
                    else{
                        this.setState({
                            error:res.error
                        })
                    }
                }
                else{
                    this.setState({
                        error:'Account Verified. Please Login',
                        token:''
                        });
                }
        }
        else{
            this.setState({
                error:res.error
            })
        }
        }
        catch(err)
        {
            console.log(err)
        }
       }
       else{
        this.setState({
            error:'Please enter your token'
          })
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
                
                     <p className='title-signin'>Verify Account</p>
                     <input type="text" className='tb' name='token' placeholder="Token" onChange={(e)=>this.handleChange(e)}/>
                     {<span className='errors'>{this.state.error}</span>} 
                    
                     <button className='but1' disabled={this.state.isDisabled} onClick={this.validateData}>Verify</button>
                     {this.state.allError ? <span className='errors'>Your Account is created. Please Check your email</span> : ''} 
                     <Link exact to='/login' className='link verify-link'>Sign in</Link>
                 </div>
                 </div>
        );
    }
}


export default Verify;