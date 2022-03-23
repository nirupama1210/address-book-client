import React, { Component } from 'react';
import {register, getUsers, deleteUser} from './apiCalls';
import { Link } from 'react-router-dom';
import homelogo from './icons/HomeLogo.svg';
import {FaEye,FaEyeSlash} from 'react-icons/fa';

class Forgot extends Component {
    constructor()
    {
        super();
        this.state={
            isDisabled:false,
            nameVal:'',
            nameError:false,
            nameErrorDisplay:'',
            passVal:'',
            passError:false,
            passErrorDisplay:'',
            emailVal:'',
            emailError:false,
            emailErrorDisplay:'',
            cpassVal:'',
            cpassError:false,
            cpassErrorDisplay:'',
            allError:false,
            show:false,
            showc:false
            
        };
        this.validateData = this.validateData.bind(this);
    }
  

   async checkUser()
   {
       const response=await getUsers();
      return response;
   }

 async   handleChange(e)
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
        nameErrorDisplay:'Please Enter Username'
      })
    } 
    else if(e.target.value.length<8)
    {
        this.setState({
            nameError:true,
            nameErrorDisplay:'Username must be 8-15 characters'
          })
    }
    else {
          this.setState({
        nameError:false,   
        nameErrorDisplay:'',  
        nameVal:e.target.value
      })
    }
  }
  if(e.target.name==='pass'){
    if(e.target.value==='' || e.target.value===null ){
      this.setState({
        passError:true,
        passErrorDisplay:'Please Enter Password'
      })
    }
    else if(e.target.value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/))
    {
        this.setState({
            passError:false,     
            passErrorDisplay:'',
            passVal:e.target.value
          })
    }
     else {
        this.setState({
            passError:true,     
            passErrorDisplay:'Password must contain 1 uppercase letter,1 lowercase letter,atleast 1 number and symbol'
          })
    }

  }
  if(e.target.name==='email'){
    if(e.target.value==='' || e.target.value===null ){
      this.setState({
        emailError:true,
        emailErrorDisplay:'Please Enter Email'
      })
    }
    else if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e.target.value))
    {
       
            this.setState({
            emailError:false,     
            emailErrorDisplay:'',
            emailVal:e.target.value
          })

    }
    
    else {
        this.setState({
            emailError:true,     
            emailErrorDisplay:'Enter valid email address'
          })
    }

  }

    if(e.target.name==="cpass")
    {
        if(e.target.value==='' || e.target.value===null ){
            this.setState({
              cpassError:true,
              cpassErrorDisplay:'Please enter Confirm Password'
            })
          }
          else if(e.target.value!==this.state.passVal){
            this.setState({
                cpassError:true,
                cpassErrorDisplay:'Password and Confirm Password must match'
              })
             
          }
          else{
            this.setState({
                cpassError:false,     
                cpassErrorDisplay:'',
                cpassVal:e.target.value
              }) 
          }
    }
  if(this.state.nameVal!=='' && this.state.passVal!=='' && this.state.cpassVal!=='' && this.state.emailVal!==''){
      this.setState({
        isDisabled:false
      })
   }
    }

   async validateData(e)
    {
        e.preventDefault();
        if(this.state.passVal!=='' && this.state.emailVal!=='' && this.state.cpassVal!=='')
        {
                    const res = await this.checkUser()
                    console.log(res)
                    let f=0;
                    for(let i=0;i<res.length;i++)
                    {
                        if(res[i].email===this.state.emailVal)
                        {
                            f=f+1; break;
                        }
                    }
                    if(f===0)
                    {
                        this.setState({
                            emailError:"This email is not registered",
                            emailError:true
                        })
                    }
                    else{
                        this.setState({
                            emailError:"",
                            emailError:false
                        }) 
                    }
            console.log(this.state)
            console.log(this.state.nameError, this.state.passError, this.state.cpassError, this.state.emailError)
            console.log((this.state.nameError===false && this.state.emailError && this.state.passError===false && this.state.cpassError===false ))
            if(this.state.emailError===false && this.state.passError===false && this.state.cpassError===false){
                try{
                    const data = await deleteUser(this.state.emailVal);
                    console.log(data.user.username)
                    if(data.success)
                    {
                        const res = await register(data.user.username,this.state.emailVal.toLowerCase(), this.state.passVal, this.state.cpassVal)
                        if(res.success){
                            this.setState({
                             isDisabled:true,
                             nameVal:'',
                             nameError:false,
                             nameErrorDisplay:'',
                             passVal:'',
                             passError:false,
                             passErrorDisplay:'',
                             emailVal:'',
                             emailError:false,
                             emailErrorDisplay:'',
                             cpassVal:'',
                             cpassError:'',
                             cpassErrorDisplay:'',
                             allError:true,
                             
                         });
                             }
                             else{
                                 if(res.erroremail)
                                 {
                                     this.setState({
                                         emailError:true,
                                         emailErrorDisplay: res.erroremail
                                     })
                                 }
                                 if(res.erroruser)
                                 {
                                     this.setState({
                                         nameError:true,
                                         nameErrorDisplay: res.erroruser
                                     })
                                 }
                                 if(res.error)
                                 {
                                     console.log(res.error)
                                 }
                             }
                                 document.querySelectorAll(".tb").value="";
                    }
                    // axios.post(url,{email:this.state.emailVal.toLowerCase(),password:this.state.passVal,username:this.state.nameVal.toLowerCase(),ques:this.state.quesVal,ans:this.state.ansVal.toLowerCase()})
                    // .then(res=>console.log(res))
                    // .catch(err=>console.log(err));
                    // axios.post(api2,{email:this.state.emailVal.toLowerCase(),albumname:"General",photos:[]})
                    // .then(res=>console.log(res))
                    // .catch(err=>console.log(err));
                    // this.state.nameVal.toLowerCase(),this.state.emailVal.toLowerCase(), this.state.passVal, this.state.cpassVal
                    
               
                }
                catch(error)
                {
                    console.log(error);
                }
            }
            else{
            
            }
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
    showcPassword()
    {
      
      this.setState({
        showc:true
      })
    }

    hidecPassword(){
      this.setState({
        showc:false
      })
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
                     <input type="text" className='tb' name='email' placeholder="Email" onChange={(e)=>this.handleChange(e)}/>
                     {this.state.emailError ? <span className='errors'>{this.state.emailErrorDisplay}</span> : ''} 
                     
                     <span className='tb'>
                     <input type={this.state.show?"text":"password"} className='passtb' name='pass' placeholder="Password" onChange={(e)=>this.handleChange(e)}/>
                     {this.state.show?<FaEyeSlash color='#0D00A7' onClick={()=>this.hidePassword()} className='eye'/>:<FaEye color='#0D00A7' onClick={()=>this.showPassword()} className='eye'/>}
                     </span>
                     
                     {this.state.passError ? <span className='errors'>{this.state.passErrorDisplay}</span> : ''} 
                     
                     <span className='tb'>
                     <input type={this.state.showc?"text":"password"} className='passtb' name='cpass' placeholder="Confirm Password" onChange={(e)=>this.handleChange(e)}/>
                     {this.state.showc?<FaEyeSlash color='#0D00A7' onClick={()=>this.hidecPassword()} className='eye'/>:<FaEye color='#0D00A7' onClick={()=>this.showcPassword()} className='eye'/>}
                     </span>
                     
                     {this.state.cpassError ? <span className='errors'>{this.state.cpassErrorDisplay}</span> : ''} 
                    
                     <button className='but1' disabled={this.state.isDisabled} onClick={this.validateData}>Reset Password</button>
                     {this.state.allError ?<> <span className='errors line1'>Your Password has been reset. Please Check your email</span><p className='line2'>Don't forget to check your Spams folder</p></> : ''} 

                     <Link exact to='/login' className='link' id='sign-in-link' >Sign in</Link>
                  
                 </div>
                 </div>
        );
    }
}

export default Forgot;