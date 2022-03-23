import React, { useState} from 'react';
import {changeContacts,getContacts,editContacts} from './apiCalls';
import phone from './icons/phone.svg'
import back from './icons/back.svg';
import plus from './icons/plus.svg';
import trash from './icons/trash.svg';
import cake from './icons/cake.svg';
import tag from './icons/tag.svg';
import email from './icons/email.svg';
import notes from './icons/notes.svg'
import location from './icons/current-location.svg';
import {Link, useLocation} from 'react-router-dom';
import FileBase from 'react-file-base64';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";
// import { convertTransitionToAnimationOptions } from 'framer-motion/types/animation/utils/transitions';

const LightTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: "#0D00A7",
      color: "white",
      boxShadow: theme.shadows[1],
      fontSize: 15
    },
    arrow: {
      color: "#0D00A7"
    }
  }))(Tooltip);

function EditContact(){

    const loc=useLocation();
    const contactDetails = loc.state.contactDetails;
    console.log((contactDetails))
    const [postData, setPostData] = useState({
        name:contactDetails.name,
        phone:[],
        contactemail:[],
        line1:"",
        line2:"",
        line3:"",
        note:contactDetails.note,
        tags:[],
        dob:contactDetails.dob,
        description:contactDetails.description,
        social:[],
        star:contactDetails.star,
        profilephoto:contactDetails.profilephoto
    });
    const [line,setLine] = useState({
        line1:contactDetails.line1,
        line2:contactDetails.line2,
        line3:contactDetails.line3
    })
    const [error,setError] = useState({
        fileError:'',
        nameError:'',
        allError:''
    })
    const tagsNewList=[]
    for(let i=0;i<contactDetails.tags.length;i++)
    {
        tagsNewList.push({
            tag:contactDetails.tags[i]
        })
    }

    const [tagList, setTagList] = useState(tagsNewList.length>0?[...tagsNewList]:[{tag:''}]);
    const [phoneList, setPhoneList] = useState(contactDetails.phone.length>0?[...contactDetails.phone]:[{phonetype:'',phonenumber:''}]);
    const [emailList, setemailList] = useState(contactDetails.contactemail.length>0?[...contactDetails.contactemail]:[{emailtype:'',emailid:''}]);
    const [profileList, setprofileList] = useState(contactDetails.social.length>0?[...contactDetails.social]:[{socialtype:'',socialid:''}]);

 const signOut=()=>
{
    // if(localStorage.getItem('User'))
    // {
    // localStorage.removeItem('User');
    // }
    if(sessionStorage.getItem('Email'))
    {
    sessionStorage.removeItem('Email')
    }
    window.open('/','_self')
}
const handleTagAdd = (e,idx)=>{
    if(tagList[idx].tag!=='')
        setTagList([...tagList, {tag: ''}])
}

const handleTagRemove = (e,idx) =>{
    console.log(idx)
    const list = [...tagList]
    list.splice(idx, 1);
    setTagList(list)
}

const handleTagChange = (e,idx)=>{
    const {name, value} = e.target;
    const list = [...tagList]
    list[idx][name] = value;
    setTagList(list)
}

const handlePhoneAdd = (e,idx)=>{
    if(phoneList[idx].phonenumber!=='' )
        {setPhoneList([...phoneList, {phonetype:'',phonenumber:''}])
        console.log(phoneList)
        }
}

const handlePhoneRemove = (e,idx) =>{
    console.log(idx)
    const list = [...phoneList]
    list.splice(idx, 1);
    setPhoneList(list)
}

const handlePhoneTypeChange = (e,idx)=>{
    const {name, value} = e.target;
    const list = [...phoneList]
    list[idx][name] = value;
    setPhoneList(list)
}

const handlePhoneNumberChange = (e,idx)=>{
    const {name, value} = e.target;
    const list = [...phoneList]
    list[idx][name] = value;
    setPhoneList(list)
}

const handleEmailAdd = (e,idx)=>{
    if(emailList[idx].emailid!=='' )
        {setemailList([...emailList, {emailtype:'',emailid:''}])
        }
}

const handleEmailRemove = (e,idx) =>{
    console.log(idx)
    const list = [...emailList]
    list.splice(idx, 1);
    setemailList(list)
}

const handleEmailTypeChange = (e,idx)=>{
    const {name, value} = e.target;
    const list = [...emailList]
    list[idx][name] = value;
    setemailList(list)
}

const handleEmailIdChange = (e,idx)=>{
    const {name, value} = e.target;
    const list = [...emailList]
    list[idx][name] = value;
    setemailList(list)
}

const handleSocialAdd = (e,idx)=>{
    if(profileList[idx].socialid!=='' )
        {setprofileList([...profileList, {socialtype:'',socialid:''}])
        }
}

const handleSocialRemove = (e,idx) =>{
    console.log(idx)
    const list = [...profileList]
    list.splice(idx, 1);
    setprofileList(list)
}

const handleSocialTypeChange = (e,idx)=>{
    const {name, value} = e.target;
    const list = [...profileList]
    list[idx][name] = value;
    setprofileList(list)
}

const handleSocialIdChange = (e,idx)=>{
    const {name, value} = e.target;
    const list = [...profileList]
    list[idx][name] = value;
    setprofileList(list)
}

const createContact = async ()=>{
    var tags =[];
    tagList.map((val,idx)=>{
        if(val.tag!=='')
            tags.push(val.tag)
    })
    var phones =[];
    phoneList.map((val,idx)=>{
        if(val.phonenumber!=='')
        {
            const type = val.phonetype===''?'Mobile':val.phonetype;
            phones.push({
                phonetype:type,
                phonenumber:parseInt(val.phonenumber)})
            }
    })
    var emails = [];
    emailList.map((val,idx)=>{
        if(val.emailid!=='')
        {
            const type = val.emailtype===''?'Personal':val.emailtype;
            emails.push({
                emailtype:type,
                emailid:val.emailid})
            }
    })
    var profiles = [];
    profileList.map((val,idx)=>{
        if(val.socialid!=='')
        {
            const type = val.socialtype===''?'LinkedIn':val.socialtype;
            profiles.push({
                socialtype:type,
                socialid:val.socialid})
            }
    })
    var addr=''
    if(line.line1!=='')
        addr=addr+", "+line.line1
    if(line.line2!=='')
        addr=addr+', '+line.line2
    if(line.line3!=='')
        addr=addr+', '+line.line3    
    var f=0;
    if(postData.name==="")
    {
        f=f+1;
        setError({fileError:'',nameError:'Please enter your name'})
    }
    else{
        setError({fileError:'',nameError:''})
    }
    if(error.fileError!=='')
    {
        f=f+1;
    }
    
    if(f===0)
    {
        try{
        const email = sessionStorage.getItem("Email")
        
        
        var newData=postData;
        
        newData.phone=phones;
        newData.contactemail=emails;
        newData.line1=line.line1;
        newData.line2=line.line2;
        newData.line3=line.line3;
        newData.social=profiles;
        newData.tags = tags;
        
        
            // res.user.allcontacts.push(newData);
            const response = await editContacts(email,postData.name,newData)
            console.log("Response",response)
        if(response.success==="Data Updated")
        {
            setError({
                fileError:'',
                nameError:'',
                allError:''
            })
            window.open('/#/contacts','_self')
        }
        else{
            setError({...error,allError:'Some Error occurred. Please Check your data'})
        }
    
        }catch(error)
        {
            console.log(error)
        }
        
    }

}
        return (
            <div className='add-contact-box'>
               <div className='back2'>
               <Link to='/contacts'><img src={back} alt="" className='back2'/></Link>
               </div>
               <div className='add-items'>
                   <div className='add-row2 '>
                       <label className='upload-label'>
                   <FileBase 
                        type="file"
                        multiple={false}
                        onDone={({base64})=>
                        {
                        const type=(base64.split(';')[0].split('/')[1]);
                        if(type==="jpeg")
                            {setPostData({...postData,profilephoto:base64})
                            setError({...error,fileError:''})
                            console.log('Yes')}
                            else{

                                setError({...error,fileError:'Please upload image'})
                            }
                        }
                        }
                        />
                   <LightTooltip arrow interactive 
          PopperProps={{
            modifiers:{
              offset: {
                enabled: true,
                offset: '0px, 0px',
              },
            },
          }}
          title="Upload Photo">
          
                        
                        <span>+</span>
          </LightTooltip> </label>
                    <div className='add-errors'>{error.fileError}</div>
                   </div>
                  
                   <div className='add-row'>
                       <div className='space'></div>
                       <div className='add-row2'>
                    <input type="text" className='tb' placeholder='Name' value={postData.name} onChange={(e)=>{
                        if(e.target.value==='')
                        {
                        setPostData({...postData,name:e.target.value})
                        setError({...error,nameError:'Please enter your name'})
                        }
                        else{
                            setPostData({...postData,name:e.target.value})
                            setError({...error,nameError:''}) 
                        }
                        }} readOnly/>
                    <div className='add-errors'>{error.nameError}</div></div>
                    </div>
                    <div className='add-row'>
                    <img src={email} alt="" className='email-icon'/> 
                    <div className='control-input'>
                   
                   {emailList.map((val,idx)=>(
                    <div className='inner-box'>
                        <select name="emailtype" value={val.emailtype} id="phone" className='phone-dd' onChange={(e)=>handleEmailTypeChange(e,idx)}>
                            
                            <option value="Personal">Personal</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className='tag-rows'>
                        <input type="text" name='emailid' className='tb2 tag-tb' placeholder='Email' style={{marginTop:"0px"}} value={val.emailid} onChange={(e)=>handleEmailIdChange(e,idx)}/>
                        {emailList.length - 1===idx ? <img src={plus} alt="" className='email-icon-small' style={{cursor2:"pointer"}} onClick={(e)=>handleEmailAdd(e,idx)}/> :<></>}
                        {emailList.length > 1? <img src={trash} alt="" className='email-icon-small' style={{cursor:"pointer"}} onClick={(e)=> handleEmailRemove(e,idx)}/>:<></> }
                        </div>
                    </div>))}</div>
                    </div>
                    <div className='add-row'>
                    <img src={phone} alt="" className='email-icon'/> 
                    <div className='control-input'>
                   
                        {phoneList.map((val,idx)=>(
                   
                    <div className='inner-box'>
                        <select name="phonetype" id="phone" value={val.phonetype} className='phone-dd' onChange={(e)=>handlePhoneTypeChange(e,idx)}>
                            <option value="Mobile">Mobile</option>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className='tag-rows'>
                        <input type="number" name='phonenumber' className='tb2 tag-tb' placeholder='Phone' style={{marginTop:"0px"}} value={val.phonenumber} onChange={(e)=>handlePhoneNumberChange(e,idx)}/>
                        {phoneList.length - 1===idx ? <img src={plus} alt="" className='email-icon-small' style={{cursor:"pointer"}} onClick={(e)=>handlePhoneAdd(e,idx)}/> :<></>}
                        {phoneList.length > 1? <img src={trash} alt="" className='email-icon-small' style={{cursor:"pointer"}} onClick={(e)=> handlePhoneRemove(e,idx)}/>:<></> }
                        </div>
                    </div>))}</div>
                    </div>
                    <div className='add-row'>
                    <img src={location} alt="" className='email-icon'/> 
                    <div className='inner-box'>
                      
                        <input type="text" className='tb2' value={line.line1} placeholder='line1' style={{marginTop:"0px"}} onChange={(e)=>setLine({...line,line1:e.target.value})}/>
                        <input type="text" className='tb2' value={line.line2} placeholder='line2' style={{marginTop:"0px"}} onChange={(e)=>setLine({...line,line2:e.target.value})}/>
                        <input type="text" className='tb2' value={line.line3} placeholder='line3' style={{marginTop:"0px"}} onChange={(e)=>setLine({...line,line3:e.target.value})}/>
                        
                    </div>
                    </div>
                    <div className='add-row'>
                    <img src={notes} alt="" className='email-icon'/> 
                    <input type="text" className='tb3' placeholder='Notes' value={postData.note} onChange={(e)=>setPostData({...postData,note:e.target.value})}/>
                    </div>
                    <div className='add-row'>
                    <img src={cake} alt="" className='email-icon'/> 
                    <input type="date" value={postData.dob!==null?(postData.dob.split('T')[0]):null}className='tb3' placeholder='Notes' onChange={(e)=>{
                        console.log(e.target.value)
                        setPostData({...postData,dob:e.target.value})}
                    }/>
                    </div>
                    <div className='add-row'>
                       <div className='space'></div>
                    <input type="text" className='tb' style={{marginTop:"0px"}} placeholder='Description' value={postData.description} onChange={(e)=>setPostData({...postData,description:e.target.value})}/>
                    </div>
                    <div className='add-row'>
                    <div className='space'></div>
                    <div className='control-input'>
                        {profileList.map((val,idx)=>(
                    <div className='inner-box'>
                        
                    <select name="socialtype" id="phone" value={val.socialtype} className='phone-dd' onChange={(e)=>handleSocialTypeChange(e,idx)}>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Facebook">Facebook</option>
                        </select>
                        <div className='tag-rows'><input type="text" className='tb2 tag-tb' name='socialid' placeholder='Profile' style={{marginTop:"0px"}}value={val.socialid} onChange={(e)=>handleSocialIdChange(e,idx)}/>
                        {profileList.length - 1===idx ? <img src={plus} alt="" className='email-icon-small' style={{cursor:"pointer"}} onClick={(e)=>handleSocialAdd(e,idx)}/> :<></>}
                        {profileList.length > 1? <img src={trash} alt="" className='email-icon-small' style={{cursor:"pointer"}} onClick={(e)=> handleSocialRemove(e,idx)}/>:<></> }
                        </div>
                    </div>))}</div>
                    </div>
                    <div className='add-row'>
                    <img src={tag} alt="" className='email-icon'/> 
                    <div className='control-input'>
                        {tagList.map((val,idx)=>(
                            
                                
                                <div className='inner-box' key={idx}>
                                    <div className='tag-rows'>
                                    <input type="text" name="tag" className='tb2 tag-tb' placeholder='Tags' style={{marginTop:"0px"}} value={val.tag} onChange={(e)=>handleTagChange(e,idx)}/>
                                    {tagList.length - 1===idx ? <img src={plus} alt="" className='email-icon-small' style={{cursor:"pointer"}} onClick={(e)=>handleTagAdd(e,idx)}/> :<></>}
                                    {tagList.length > 1? <img src={trash} alt="" className='email-icon-small' style={{cursor:"pointer"}} onClick={(e)=> handleTagRemove(e,idx)}/>:<></> }
                                    </div>
                                    </div>
                           
                        ))
                    }</div>
                    
                    </div>
                    <div className='add-contact-buttons'>
                        <button className='add-but' onClick={createContact}>Save</button>
                        {error.allError!==''&& <div className='add-errors'>{error.allError}</div>}
                        <Link to='/contacts' style={{color:"white",textDecoration:"none"}}><button className='cancel'>Cancel</button></Link>
                    </div>
               </div>
               <div>
                    <button className='sign-out-but' style={{backgroundColor:"#0D00A7",color:"white"}} onClick={signOut}>Sign Out</button>
                </div>
            </div>
        );
    
}



export default EditContact;