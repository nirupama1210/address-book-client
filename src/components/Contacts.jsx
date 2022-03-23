import React, { Component } from 'react';
import { motion } from "framer-motion";
import star from './icons/star.svg';
import plus from './icons/plus.svg';
import phone from './icons/phone.svg'
import back from './icons/back.svg'
import tag from './icons/tag.svg';
import email from './icons/email.svg';
import cake from './icons/cake.svg';
import trash from './icons/trash.svg';
import cross from './icons/cross.svg';
import notes from './icons/notes.svg';
import twitter from './icons/twitter.svg';
import facebook from './icons/facebook.svg';
import linkedin from './icons/linkedin.svg';
import location from './icons/current-location.svg'
import {getContacts, changeContacts} from './apiCalls';
import {FaSquare, FaStar} from 'react-icons/fa';
import DeleteContact from './DeleteContact';
import DisplayBirthday from './DisplayBirthday';
import pen from './icons/pen.svg';
// import axios from 'axios';
// import { AnimatePresence } from "framer-motion";
import {Link} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from "@material-ui/core/styles";
// import styled from "styled-components";


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

const icon = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: "rgb(13, 0, 167, 0)"
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: "rgb(255, 255, 255, 1)"
    }
  };

class Contacts extends Component {
    constructor()
    {
        super()
        this.state={
            email:sessionStorage.getItem("Email"),
            data:[],
            tags:[],
            detailsshow:false,
            contactdetails:{},
            starred:[],
            deleted:[],
            deleteHover:[],
            showDeleteStar:false,
            popup:false,
            selectedTags:[],
            originalData:[],
            bdayArray:[],
            bdaypop:false
        }
        if(!sessionStorage.getItem("Email"))
        {
            window.open('/','_self')
        }
    }

displayAllContacts=async ()=>{
const email = sessionStorage.getItem("Email")
const res = await getContacts(email);
if(res.user.allcontacts[0].name!=="")
{
    
    var tagdata=new Set();
    var deleteArr =[]
    var deleteHover = []
    var starArr = []
    for(var i=0;i<res.user.allcontacts.length;i++)
    {
        if(res.user.allcontacts[i].tags.length>0)
           {
            //    console.log(res.user.allcontacts[i].tags.length) 
                for(var j=0;j<res.user.allcontacts[i].tags.length;j++)
                {
                    tagdata.add(res.user.allcontacts[i].tags[j])
                }
                
           }
           
           deleteArr.push(false)
           deleteHover.push(false)
           starArr.push(res.user.allcontacts[i].star)
    }
    // console.log(tagdata)
    var bday = []
    for(var y=0;y<res.user.allcontacts.length;y++)
    {
        if(res.user.allcontacts[y].dob!==null && res.user.allcontacts[y].dob!==undefined)
        {
            bday.push({
                profilephoto:res.user.allcontacts[y].profilephoto,
                name:res.user.allcontacts[y].name,
                dob:res.user.allcontacts[y].dob,
                days:this.getBDay(res.user.allcontacts[y].dob)
            })
        }
    }
    bday.sort((a,b) => (a.days > b.days) ? 1 : ((b.days > a.days) ? -1 : 0))
    if(this.state.deleted.length>0)
    {
        this.setState({
            data:res.user.allcontacts,
            originalData:res.user.allcontacts,
            tags: Array.from(tagdata),
            starred:starArr,
            deleted:deleteArr,
            deleteHover:deleteHover,
            bdayArray:bday
        })
    }
    else{
        this.setState({
            data:res.user.allcontacts,
            originalData:res.user.allcontacts,
            tags: Array.from(tagdata),
            starred:starArr,
            deleted:deleteArr,
            deleteHover:deleteHover,
            bdayArray:bday
        })
    }
    console.log(this.state)


}

}

componentDidMount()
{
    this.displayAllContacts();
}

setDeleteStar(idx)
{
    let boolVal;
    let deleteArr = this.state.deleted;
    deleteArr[idx] =  !deleteArr[idx]
    let starArr = this.state.starred;
    starArr[idx] = !starArr[idx]
    boolVal = deleteArr[idx]
    for(let i=0;i<deleteArr.length;i++)
    {
        if(i!==idx)
        {
            if(deleteArr[i]){
                boolVal=true;
                break;
            }
        }
        // if(i===idx)
        // {
        //     boolVal=!deleteArr[i]

        // }
    }
    this.setState({
        deleted:deleteArr,
        starred:starArr,
        showDeleteStar:boolVal
        
    })
   
    // this.setState({
    //     showDeleteStar:boolVal
    // })
   // console.log(this.state)
}

setHover(idx)
{


    var deleteArr02 = this.state.deleteHover;
    deleteArr02[idx] = !this.state.deleteHover[idx];
    this.setState({
        deleteHover: deleteArr02
    })
}

async handleChange(e)
{
    var searchedItems=[]
    if(e.target.value==="" && this.state.selectedTags.length===0)
    {
        this.displayAllContacts();
    }
    else if(this.state.selectedTags.length>0)
    {
        if(e.target.value==="")
        {
            const response=await getContacts(this.state.email);
            if(this.state.email!==null)
            {
                let val=response.user.allcontacts;
               
                for(let i=0;i<val.length;i++)
                {
                    let f=0;
                    for(let j=0;j<this.state.selectedTags.length;j++)
                    {
                        for(let k=0;k<val[i].tags.length;k++)
                        {
                            if(val[i].tags[k]===this.state.selectedTags[j])
                            {
                                f=f+1;
                                break;
                            }
                        }
                       
                    }
                    if(f!==0)
                    {
                        searchedItems.push(val[i])
                    }
                }
            }
            let deleteArr=[]
            let starArr=[]
            let deleteHover=[]
            for(let i=0;i<searchedItems.length;i++)
            {
                deleteArr.push(false)
                starArr.push(searchedItems[i].star)
                deleteHover.push(false)
            }
            this.setState({data:searchedItems, deleted: deleteArr, starred: starArr, deleteHover:deleteHover});
        }
          else{  
            const response=await getContacts(this.state.email);
            if(this.state.email!==null)
            {
                let val=response.user.allcontacts;
                for(let i=0;i<val.length;i++)
                {
                    let f=0;
                    for(let j=0;j<this.state.selectedTags.length;j++)
                    {
                        for(let k=0;k<val[i].tags.length;k++)
                        {
                            if(val[i].tags[k]===this.state.selectedTags[j])
                            {
                                f=f+1;
                                break;
                            }
                        }
                       
                    }
                    if(f!==0)
                    {
                        searchedItems.push(val[i])
                    }
                }
            }
            const newSearchedItems=searchedItems.filter((item)=>
            item.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
            let deleteArr=[]
            let starArr=[]
            let deleteHover=[]
            for(let i=0;i<newSearchedItems.length;i++)
            {
                deleteArr.push(false)
                starArr.push(searchedItems[i].star)
                deleteHover.push(false)
            }
            this.setState({data:newSearchedItems, deleted: deleteArr, starred: starArr, deleteHover:deleteHover});
        // const searchedItems = this.state.data.filter((item)=>
        //    // console.log(item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        //     item.name.toLowerCase().includes(e.target.value.toLowerCase())
        // )
       
        // this.setState({data:searchedItems});
        // console.log(this.state.deleted)
        
        // const searchedItems = this.state.data.filter((item)=>
        //    // console.log(item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        //     item.name.toLowerCase().includes(e.target.value.toLowerCase())
        // )
        // // let deleteArr=[]
        // // let starArr=[]
        // // for(let i=0;i<searchedItems.length;i++)
        // // {
        // //     deleteArr.push(false)
        // //     starArr.push(searchedItems[i].star)
        // // }
        // this.setState({data:searchedItems});
          }
    }
    else{
        const response=await getContacts(this.state.email);
       
        if(this.state.email!==null)
        {
            let val=response.user.allcontacts;
        this.setState({
        
            data:val
        })
        const searchedItems = this.state.data.filter((item)=>
           // console.log(item.name.toLowerCase().includes(e.target.value.toLowerCase()))
            item.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
        let deleteArr=[]
        let starArr=[]
        let deleteHover=[]
        for(let i=0;i<searchedItems.length;i++)
        {
            deleteArr.push(false)
            starArr.push(searchedItems[i].star)
            deleteHover.push(false)
        }
        this.setState({data:searchedItems, deleted: deleteArr, starred: starArr, deleteHover:deleteHover});
        console.log(this.state.deleted)
    }
    }
}

async handleTagSearch(e)
{
    if(e.target.value==="" && this.state.selectedTags.length===0)
    {
        this.displayAllContacts();
    }
    else if(this.state.selectedTags.length>=0)
    {
        const res=await getContacts(this.state.email);
       
        if(this.state.email!==null)
        {
            // let val=res.user.allcontacts;
            var tagdata=new Set();
            for(var i=0;i<res.user.allcontacts.length;i++)
            {
                if(res.user.allcontacts[i].tags.length>0)
                   {
                    //    console.log(res.user.allcontacts[i].tags.length) 
                        for(var j=0;j<res.user.allcontacts[i].tags.length;j++)
                        {
                            tagdata.add(res.user.allcontacts[i].tags[j])
                        }
                   }
            }
            // console.log(tagdata)
            var finalTag = Array.from(tagdata);
            console.log(finalTag)
            var resTag = []
            for(let j=0;j<finalTag.length;j++)
            {
                let f=0;
                for(let i=0;i<this.state.selectedTags.length;i++)
                {
                    if(this.state.selectedTags[i]===finalTag[j])
                    {
                        f=f+1;
                        break;
                    }
                }
                if(f===0)
                {
                    resTag.push(finalTag[j])
                }
            }
            console.log(resTag)
        const searchedItems = resTag.filter((item)=>
           // console.log(item.name.toLowerCase().includes(e.target.value.toLowerCase()))
            item.toLowerCase().includes(e.target.value.toLowerCase())
        )
        console.log(searchedItems)
        this.setState({tags:searchedItems});

     
    }
}
    else{
        const res=await getContacts(this.state.email);
       
        if(this.state.email!==null)
        {
            let val=res.user.allcontacts;
            var tagdata=new Set();
            for(var i=0;i<res.user.allcontacts.length;i++)
            {
                if(res.user.allcontacts[i].tags.length>0)
                   {
                    //    console.log(res.user.allcontacts[i].tags.length) 
                        for(var j=0;j<res.user.allcontacts[i].tags.length;j++)
                        {
                            tagdata.add(res.user.allcontacts[i].tags[j])
                        }
                   }
            }
            // console.log(tagdata)
            this.setState({
                data:val,
                tags: Array.from(tagdata)
            })
        const searchedItems = this.state.tags.filter((item)=>
           // console.log(item.name.toLowerCase().includes(e.target.value.toLowerCase()))
            item.toLowerCase().includes(e.target.value.toLowerCase())
        )
        console.log(searchedItems)
        this.setState({tags:searchedItems});
    }
}
}

capitalize(str)
{
    const arr = str.split(" ");
for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

}

const str2 = arr.join(" ");
return str2
}
// down()
// {
//     document.getElementById("myDropdown").classList.toggle("show");
// }
async showDetails(idx,name)
{
    const email = sessionStorage.getItem("Email")
    const res = await getContacts(email);
    var detail = {}
    for(let i=0;i<res.user.allcontacts.length;i++)
    {
        if(res.user.allcontacts[i].name.toLowerCase()===name.toLowerCase())
        {
            detail = res.user.allcontacts[i];
            break
        }
    }
    // console.log(res.user.allcontacts[idx])
    this.setState({
        detailsshow:true,
        contactdetails:detail},
        console.log(detail)
    )
  
}
signOut()
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

findInitials(str)
{
    const arr = str.split(" ")
    var s="";
    for(var i=0;i<arr.length;i++)
    {
        s=s+" "+arr[i][0].toUpperCase()
    }
    return s;
}

getMonth(date)
{
    if(date!==null)
    {
const dd = date[8]+date[9];
const Newdate = new Date(date); 
const month = Newdate.toLocaleString('default', { month: 'long' });
return (month+", "+dd);
}
}
getBDay(date)
{
    if(date!==null)
    {
        const bday = new Date(date)
        const today = new Date()
        var nextBdayYear = today.getFullYear()
        if((today.getMonth()===bday.getMonth() && today.getDay()===bday.getDay()) || today.getMonth() > bday.getMonth())
        {
            nextBdayYear = today.year + 1
        }
        var nextBday = new Date(nextBdayYear,bday.getMonth(),bday.getDay())
        var diff=nextBday - today
        var days = (Math.round((diff)/(1000*60*60*24)))
        return days

    
    }
}
reset()
{
    // console.log("Button CLicked")
    // console.log(this.state.data)
    var deleteArr=[]
    var starArr=[]
    var deleteHover=[]
   
    for(let i=0;i<this.state.deleted.length;i++)
    {
        deleteArr[i]=false;
        starArr[i]=this.state.data[i].star;
        deleteHover[i]=false;
    }
    this.setState({
        deleted:deleteArr,
        starred:starArr,
        deleteHover:deleteHover,
        showDeleteStar:false
    })
}

deletePopUp()
{
const val = this.state.popup;
this.setState({popup:!val});

}

removeBday()
{
const val = this.state.bdaypop;
this.setState({bdaypop:!val});
}

async deleteContact()
{
    let newData = this.state.data;
    let deleteArr = this.state.deleted;
    let deletedTags = []
    console.log(deleteArr)
    for(let i=0;i<this.state.data.length;i++)
    {
     if(deleteArr[i]){
         newData.push(this.state.data[i])
        if(this.state.data[i].tags.length>0)
        {
           // for(let j=0;j<this.state.data[i].tags.length;j++)
                deletedTags.push(...this.state.data[i].tags)
        }
     }   
    }
    console.log(deletedTags)
    let uploadData = []
    for(let i=0;i<this.state.originalData.length;i++)
    { let f=0;
        for(let j=0;j<newData.length;j++)
        {
            if(this.state.originalData[i].name===newData[j].name && this.state.deleted[j])
            {
                f=f+1;
                break;
            }
        }
        if(f===0)
        {
            uploadData.push(this.state.originalData[i])
        }
    }
    // console.log(uploadData)
    //         var arr=this.state.selectedTags                                                                                                         
    //     var newTags = this.state.tags
    // console.log("NewTags",newTags)
    // console.log("ARrr",arr)

   const res = await changeContacts(this.state.email, uploadData);
    if(res.success)
    {
        console.log(res)
        
        var starArr2=[]
        var deleteArr2=[]
        var deleteHover2=[]
    
        // for(let i=0;i<this.state.deleted.length;i++)
        // {
        //     deleteArr2[i]=false;
        //     deleteHover2[i]=false;
            
        // }
        // this.setState({
        //     deleted:deleteArr2,
        //     deleteHover:deleteHover2,
        //     showDeleteStar:false,
        //     popup:false
            
        // })
        var arr=this.state.selectedTags                                                                                                         
        var newTags = this.state.tags
        var res2 = await getContacts(this.state.email)
        var tags=[]
        var originalData = res2.user.allcontacts
        var bday = []
        for(var y=0;y<res2.user.allcontacts.length;y++)
        {
            if(res2.user.allcontacts[y].dob!==null && res2.user.allcontacts[y].dob!==undefined)
            {
                bday.push({
                    profilephoto:res2.user.allcontacts[y].profilephoto,
                    name:res2.user.allcontacts[y].name,
                    dob:res2.user.allcontacts[y].dob,
                    days:this.getBDay(res2.user.allcontacts[y].dob)
                })
            }
        }
        bday.sort((a,b) => (a.days > b.days) ? 1 : ((b.days > a.days) ? -1 : 0))
            var searchedItems = []
            var moreTags = []
            for(let i=0;i<deletedTags.length;i++)
            {
                moreTags.push(deletedTags[i])
            }
            if(deletedTags.length===0)
            {
                moreTags = newTags;
            }
            for(let i=0;i<deletedTags.length;i++)
            { // var f=0;
                let x=0;
                for(let j=0;j<originalData.length;j++)
                {
                
                    if(originalData[j].tags.indexOf(deletedTags[i])!==-1)
                    {
                        x=x+1;
                        console.log("In Array",deletedTags[i])
                    }
                    // for(let k=0;k<originalData[j].tags.length;k++){
                    //     if(arr[i]===originalData[j].tags[k]){
                    //         f=f+1;break;
                    //     }
                    // }
                    
                }
                if(x===0)
                {
                    console.log("DeletedTags index",deletedTags[i]," More Tags index ",moreTags[i])
                    moreTags.splice(moreTags.indexOf(deletedTags[i]),1)
                }
                // if(f!==0){
                //     searchedItems.push(originalData[j])
                //     deleteArr2.push(false)
                //     deleteHover2.push(false)
                //     starArr2.push(originalData[j].star)
                // }
            }
            let arr2=[]
            let newTags2=[]
            console.log("MoreTags",moreTags,"DeletedTags",deletedTags)
            for(let j=0;j<arr.length;j++)
            {
                if(moreTags.indexOf(arr[j])!==-1)
                {
                    arr2.push(arr[j])
                }
            }
            for(let j=0;j<newTags.length;j++)
            {
                if(moreTags.indexOf(newTags[j])!==-1)
                {
                    newTags2.push(newTags[j])
                }
               // console.log(newTags[j])
            }
            
           var finalTag = new Set()

            for(let i=0;i<originalData.length;i++)
            {
                for(let j=0;j<originalData[i].tags.length;j++)
                {
                    finalTag.add(originalData[i].tags[j])
                }
            }
            var finalTag2=Array.from(finalTag)
            for(let i=0;i<finalTag2.length;i++)
            {
                if(newTags.indexOf(finalTag2[i])!==-1)
                {
                    newTags2.push(finalTag2[i])
                }
            }
            for(let j=0;j<finalTag2.length;j++)
            {
                if(arr.indexOf(finalTag2[j])!==-1)
                {
                    arr2.push(finalTag2[j])
                }
            }
            const newArr = Array.from(new Set(arr2))
            
            for(let j=0;j<originalData.length;j++)
            {
                var f=0;
                for(let i=0;i<newArr.length;i++)
                {
                    if(originalData[j].tags.indexOf(newArr[i])!==-1)
                    {
                        f=f+1;break;
                    }
                }
                if(f!==0)
                {
                    searchedItems.push(originalData[j])
                    deleteArr2.push(false)
                    deleteHover2.push(false)
                    starArr2.push(originalData[j].star)
                }
            }

            console.log(searchedItems)

            this.setState({data:searchedItems,
                tags:Array.from(new Set(newTags2)),
                selectedTags:Array.from(new Set(arr2)),
            originalData:originalData,
            deleted:deleteArr2,
            deleteHover:deleteHover2,
            starred:starArr2,
            showDeleteStar:false,
            popup:false,
        bdayArray:bday,
        detailsshow:false})
        
        if(arr2.length===0)
        {
            // var newTags3 = newTags
            // for(let i=0;i<deletedTags.length;i++)
            // {
            //     if(newTags3.indexOf(deletedTags[i])!==-1)
            //     {
            //         newTags3.splice(newTags3.indexOf(deletedTags[i]),1)
            //     }
            // }
            this.setState({data:res2.user.allcontacts,
                tags:Array.from(new Set(newTags2)),
                selectedTags:Array.from(new Set(arr2)),
            originalData:res2.user.allcontacts,
            deleted:deleteArr2,
            starred:starArr2,
            deleteHover:deleteHover2,
            showDeleteStar:false,
            popup:false,
        bdayArray:bday,
        detailsshow:false})
        }
            
            }
    
}

async updateStar()
{
    let newData = this.state.data;
    let starArr = this.state.starred;
    console.log(starArr)
    for(let i=0;i<newData.length;i++)
    {
        newData[i].star = starArr[i];
    }
    let uploadData = this.state.originalData;
    for(let i=0;i<uploadData.length;i++)
    {
        for(let j=0;j<newData.length;j++)
        {
            if(uploadData[i].name===newData[j].name)
            {
                uploadData[i]=newData[j]
                break;
            }
        }
    }
    console.log(uploadData)
    const res = await changeContacts(this.state.email, uploadData);
    if(res.success)
    {
        console.log(res)
        var deleteArr=[]
        var deleteHover =[]
        for(let i=0;i<this.state.deleted.length;i++)
        {
            deleteArr[i]=false;
            deleteHover[i]=false
        }
        this.setState({
            deleted:deleteArr,
            starred:starArr,
            deleteHover:deleteHover,
            showDeleteStar:false,
            
        })
        var arr=this.state.selectedTags                                                                                                         
        var newTags = this.state.tags
        var res2 = await getContacts(this.state.email)
        var originalData = res2.user.allcontacts
        var bday = []
        for(var y=0;y<res2.user.allcontacts.length;y++)
        {
            if(res2.user.allcontacts[y].dob!==null && res2.user.allcontacts[y].dob!==null)
            {
                bday.push({
                    profilephoto:res2.user.allcontacts[y].profilephoto,
                    name:res2.user.allcontacts[y].name,
                    dob:res2.user.allcontacts[y].dob,
                    days:this.getBDay(res2.user.allcontacts[y].dob)
                })
            }
        }
        bday.sort((a,b) => (a.days > b.days) ? 1 : ((b.days > a.days) ? -1 : 0))
        if(arr.length>0){
            const searchedItems = []
            for(let j=0;j<originalData.length;j++)
            { var f=0;
                for(let i=0;i<arr.length;i++)
                {
            
                    for(let k=0;k<originalData[j].tags.length;k++){
                        if(arr[i]===originalData[j].tags[k]){
                            f=f+1;break;
                        }
                    }
                
            }
            if(f!==0){
                searchedItems.push(originalData[j])
               
            }
        }
            
        this.setState({data:searchedItems,
            tags:newTags,
            selectedTags:arr,
            originalData:originalData,
            bdayArray:bday,
            detailsshow:false
        })
        }
        
        else{
            this.setState({data:originalData,
                tags:newTags,
                selectedTags:arr,
            originalData:originalData,
        bdayArray:bday,
    detailsshow:false})
            }
    }
    
}

tagClicked(idx)
{
    var arr=this.state.selectedTags
    arr.push(this.state.tags[idx])                                                                                                            
    var newTags = this.state.tags
    newTags.splice(idx,1)
    let searchedItems = []
    let deleteArr01=[]
    let starArr01 =[]
    for(let j=0;j<this.state.originalData.length;j++)
    { var f=0;
        for(let i=0;i<arr.length;i++)
        {
           
            for(let k=0;k<this.state.originalData[j].tags.length;k++){
                if(arr[i]===this.state.originalData[j].tags[k]){
                    f=f+1;break;
                }
            }
            
        }
        if(f!==0){
            searchedItems.push(this.state.originalData[j])
            
        }
    }
    for(let i=0;i<searchedItems.length;i++)
    {
        deleteArr01.push(false)
        starArr01.push(searchedItems[i].star)
    }
    console.log(starArr01)
    this.setState({

    data:searchedItems,
    tags:newTags,
    selectedTags:arr,
    deleted:deleteArr01,
    starred:starArr01

    })

}

tagNotClicked(idx)
{
    var arr=this.state.tags
    arr.push(this.state.selectedTags[idx])                                                                                                            
    var newTags = this.state.selectedTags
    newTags.splice(idx,1)
    var searchedItems = []
    let deleteArr01=[]
    let starArr01 =[]
    if(newTags.length>0)
    {
        for(let j=0;j<this.state.originalData.length;j++)
        { var f=0;
            for(let i=0;i<arr.length;i++)
            {
            
                for(let k=0;k<this.state.originalData[j].tags.length;k++){
                    if(newTags[i]===this.state.originalData[j].tags[k]){
                        f=f+1;break;
                    }
                }
                
            }
            if(f!==0){
                searchedItems.push(this.state.originalData[j])
            }
        }
    }
    else{
        searchedItems=this.state.originalData
    }
    for(let i=0;i<searchedItems.length;i++)
    {
        deleteArr01.push(false)
        starArr01.push(searchedItems[i].star)
    }
    this.setState({
        data:searchedItems,
        tags:arr,
        selectedTags:newTags,
        deleted:deleteArr01,
        starred:starArr01
    })
}

render() {
        return (
            <div>
                <div className='header'>
                                    <div className='logo-full'>
                                    
                                    <div className='logo'>

                                    <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32.666 32.666"
                                    className="logo"
                                    >
                                    <motion.path
                                    space="preserve"
                                    strokeWidth=".265"
                                        d="M28.189,16.504h-1.666c0-5.437-4.422-9.858-9.856-9.858l-0.001-1.664C23.021,4.979,28.189,10.149,28.189,16.504z
                                        M16.666,7.856L16.665,9.52c3.853,0,6.983,3.133,6.981,6.983l1.666-0.001C25.312,11.735,21.436,7.856,16.666,7.856z M16.333,0
                                    C7.326,0,0,7.326,0,16.334c0,9.006,7.326,16.332,16.333,16.332c0.557,0,1.007-0.45,1.007-1.006c0-0.559-0.45-1.01-1.007-1.01
                                    c-7.896,0-14.318-6.424-14.318-14.316c0-7.896,6.422-14.319,14.318-14.319c7.896,0,14.317,6.424,14.317,14.319
                                    c0,3.299-1.756,6.568-4.269,7.954c-0.913,0.502-1.903,0.751-2.959,0.761c0.634-0.377,1.183-0.887,1.591-1.529
                                    c0.08-0.121,0.186-0.228,0.238-0.359c0.328-0.789,0.357-1.684,0.555-2.518c0.243-1.064-4.658-3.143-5.084-1.814
                                    c-0.154,0.492-0.39,2.048-0.699,2.458c-0.275,0.366-0.953,0.192-1.377-0.168c-1.117-0.952-2.364-2.351-3.458-3.457l0.002-0.001
                                    c-0.028-0.029-0.062-0.061-0.092-0.092c-0.031-0.029-0.062-0.062-0.093-0.092v0.002c-1.106-1.096-2.506-2.34-3.457-3.459
                                    c-0.36-0.424-0.534-1.102-0.168-1.377c0.41-0.311,1.966-0.543,2.458-0.699c1.326-0.424-0.75-5.328-1.816-5.084
                                    c-0.832,0.195-1.727,0.227-2.516,0.553c-0.134,0.057-0.238,0.16-0.359,0.24c-2.799,1.774-3.16,6.082-0.428,9.292
                                    c1.041,1.228,2.127,2.416,3.245,3.576l-0.006,0.004c0.031,0.031,0.063,0.06,0.095,0.09c0.03,0.031,0.059,0.062,0.088,0.095
                                    l0.006-0.006c1.16,1.118,2.535,2.765,4.769,4.255c4.703,3.141,8.312,2.264,10.438,1.098c3.67-2.021,5.312-6.338,5.312-9.719
                                    C32.666,7.326,25.339,0,16.333,0z"
                                        variants={icon}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{
                                        default: { duration: 2, ease: "easeInOut" },
                                        fill: { duration: 2, ease: [1, 0, 0.8, 1] }
                                        }}
                                    /> </motion.svg>

                                    </div>
                                    <motion.h4
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            transition={{duration: 1}}
                                            className='app-title2'
                                    >
                                    Address Book
                                    </motion.h4>
                                    </div>
                                
                                    <div>
                                        <button className='sign-out-but' onClick={this.signOut}>Sign Out</button>
                                    </div>
                </div>
                <div className='content'>

                        <div className='side-bar'>
                        {this.state.showDeleteStar? <div className='top-search'>
                        <img src={cross} alt="" className='add-contact' onClick={()=>this.reset()}/>
                                <input type="text" placeholder='Search' className='search-bar' onChange={(e)=>this.handleChange(e)} />
                               <img src={trash} alt='delete' className='add-contact' onClick={()=>this.deletePopUp()}/><FaStar color='#0D00A7' className='add-contact' onClick={()=>this.updateStar()}/>
                                
                            </div>
                        :
                        <div className='top-search'>
                           
                        <div className='tags-search'>
                            <input type="text" placeholder='Search' className='search-bar' onChange={(e)=>this.handleChange(e)} />
                            <motion.div layout className='tag-button-small'>
                                            {
                                                this.state.selectedTags.map((val,idx)=>{

                                                    return(
                                                    <span key={idx} className='tag-items-selected' onClick={()=>this.tagNotClicked(idx) } style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}><span>{val}</span><img src={cross} alt='cross' className='cross-contact'/></span>
                                                    )
                                                })
                                            }
                                         </motion.div>
                        </div>
                      
                        <Link to='/add'><img src={plus} alt="add" className='add-contact'/></Link>
                        </div>
                        }
                            {this.state.data.length>0? <>   
                        <div style={{display:"flex",flexDirection:"column", overflowY: "auto",flexGrow: 0,flexShrink: 0,maxHeight: "70vh"}}> 
                            <motion.div className='starred' layout>
                                {
                                    
                                    this.state.data.map((val,idx)=>{
                                        const name = this.capitalize(val.name);
                                        const initials = this.findInitials(val.name)
                                        if(val.star){
                                        return (
                                            (val.profilephoto==="")?
                                           
                                       <div layout key={idx} className='contact-row'>
                                            {/* <h1>{idx}</h1> */}
                                            <label className='square' style={{}}>
                                          <input type="radio" name='checkbox' value={idx} onClick={()=>{
                                                                                                            this.setDeleteStar(idx)}} />
                                            <FaSquare color={this.state.deleteHover[idx] || this.state.deleted[idx]?"#0D00A7":"#C4C4C4"} onMouseEnter={()=>this.setHover(idx)} onMouseLeave={()=>this.setHover(idx)}/>
                                            </label>
                                            <p className={this.state.contactdetails.name===undefined?'profilepic':this.state.contactdetails.name===val.name?'profilepic-selected':'profilepic'}>{initials}</p>
                                            <div className='names'>
                                                <p className={this.state.contactdetails.name===undefined?'name':this.state.contactdetails.name===name?'name-selected':'name'} onClick={()=>this.showDetails(idx,name)}>{name}</p>
                                                <p className='desc'>{val.description}</p>
                                            </div>
                                            <img src={star} alt="star" className='star'/>
                                        </div>:
                                        <div layout key={idx} className='contact-row'>
                                        {/* <h1>{idx}</h1> */}
                                      
                                        <label className='square' style={{}}>
                                          <input type="radio" name='checkbox' value={idx} onClick={()=>this.setDeleteStar(idx)} onMouseEnter={()=>this.setHover(idx)} onMouseLeave={()=>this.setHover(idx)}/>
                                            <FaSquare color={this.state.deleteHover[idx] || this.state.deleted[idx]?"#0D00A7":"#C4C4C4"} onMouseEnter={()=>this.setHover(idx)} onMouseLeave={()=>this.setHover(idx)}/>
                                            </label>
                                            <motion.img src={val.profilephoto} alt="" className={this.state.contactdetails.profilephoto===undefined?'profilepic-image':this.state.contactdetails.profilephoto===val.profilephoto?'profilepic-image-selected':'profilepic-image'}
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    transition={{delay:1}}
                                    />
                                        <div className='names'>
                                        <p className={this.state.contactdetails.name===undefined?'name':this.state.contactdetails.name===name?'name-selected':'name'} onClick={()=>this.showDetails(idx,name)}>{name}</p>
                                            <p className='desc'>{val.description}</p>
                                        </div>
                                        <img src={star} alt="star" className='star'/>
                                    </div>
                                        
                                          )
                                        }
                                        })

                                    }
                                </motion.div>
                                <motion.div layout className='regular'> 
                                {
                                    this.state.data.map((val,idx)=>{
                                        if(!val.star){
                                            const name = this.capitalize(val.name);
                                            const initials = this.findInitials(val.name)
                                            return (
                                                (val.profilephoto==="")?
                                               
                                            <div layout key={idx} className='contact-row'>
                                                {/* <h1>{idx}</h1> */}
                                                <label className='square' style={{}}>
                                          <input type="radio" name='checkbox' value={idx} onClick={()=>this.setDeleteStar(idx)} onMouseEnter={()=>this.setHover(idx)} onMouseLeave={()=>this.setHover(idx)}/>
                                            <FaSquare color={this.state.deleteHover[idx] || this.state.deleted[idx]?"#0D00A7":"#C4C4C4"} onMouseEnter={()=>this.setHover(idx)} onMouseLeave={()=>this.setHover(idx)}/>
                                            </label>
                                                <p className={this.state.contactdetails.name===undefined?'profilepic':this.state.contactdetails.name===val.name?'profilepic-selected':'profilepic'}>{initials}</p>
                                                {/* <h1>{idx}</h1> */}
                                               
                                                <div className='names'>
                                                <p className={this.state.contactdetails.name===undefined?'name':this.state.contactdetails.name===name?'name-selected':'name'} onClick={()=>this.showDetails(idx,name)}>{name}</p>
                                                    <p className='desc'>{val.description}</p>
                                                </div>
                                            </div>:
                                          <div layout key={idx} className='contact-row'>
                                          {/* <h1>{idx}</h1> */}
                                          <label className='square' style={{}}>
                                          <input type="radio" name='checkbox' value={idx} onClick={()=>this.setDeleteStar(idx)} onMouseEnter={()=>this.setHover(idx)} onMouseLeave={()=>this.setHover(idx)}/>
                                            <FaSquare color={this.state.deleteHover[idx] || this.state.deleted[idx]?"#0D00A7":"#C4C4C4"} onMouseEnter={()=>this.setHover(idx)} onMouseLeave={()=>this.setHover(idx)}/>
                                            </label>
                                            <motion.img src={val.profilephoto} alt=""
                                             className={this.state.contactdetails.profilephoto===undefined?'profilepic-image':this.state.contactdetails.profilephoto===val.profilephoto?'profilepic-image-selected':'profilepic-image'}
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    transition={{delay:1}}
                                    />
                                          {/* <h1>{idx}</h1> */}
                                         
                                          <div className='names'>
                                          <p className={this.state.contactdetails.name===undefined?'name':this.state.contactdetails.name===name?'name-selected':'name'} onClick={()=>this.showDetails(idx,name)}>{name}</p>
                                              <p className='desc'>{val.description}</p>
                                          </div>
                                      </div>
                                        
                                          )
                                        
                                    }})
                                    }
                                
                                </motion.div>

                                </div>

                                        
                                      
                                </>:
                                        <div>No Contacts</div>} 
                    </div>
                                <div className={this.state.showDeleteStar?'wrapper details':'details'}>
                                   {this.state.showDeleteStar?<div className='grey-layer'></div>:
                                   <></>

                                   } 
                                   
                                        { this.state.detailsshow && !this.state.showDeleteStar?

                                   <motion.div layout className='contact-detail'>
                                       <div className='detail-header'>
                                       <img src={back} alt="" className='back' onClick={()=>{this.setState({detailsshow:false,contactdetails:{}})}}/>
                                               <center>
                                                  
                                                  {
                                                      
                                                     this.state.contactdetails.profilephoto===""?   
                                                      <div className='detail-header-inner'>
                                                          <p className='profilepic2'>{this.findInitials(this.state.contactdetails.name)}</p>
                                                            <p className='name2'>{this.capitalize(this.state.contactdetails.name)}
                                                            {
                                                                this.state.contactdetails.star?<img src={star} alt='' className='star'/>:
                                                                <></>
                                                            }
                                                            <LightTooltip arrow interactive 
                                                          PopperProps={{
                                                              modifiers:{
                                                              offset: {
                                                                  enabled: true,
                                                                  offset: '0px, 0px',
                                                              },
                                                              },
                                                          }}
                                                          title="Edit"><Link to='/edit' state={{contactDetails:this.state.contactdetails}}><img src={pen} alt="edit" className='star' style={{marginLeft:"20px", cursor:"pointer"}}/></Link></LightTooltip>
                                                            </p>

                                                             <p className='desc2'>{this.state.contactdetails.description}</p>
                                                        </div>
                                                        :
                                                       
                                                      <div className='detail-header-inner'>
                                                         <img src={this.state.contactdetails.profilephoto} alt="" className='profilepic2-image'/>
                                                            <p className='name2'>{this.capitalize(this.state.contactdetails.name)}
                                                            {
                                                                this.state.contactdetails.star?<img src={star} alt='' className='star'/>:
                                                                <></>
                                                            }
                                                          <LightTooltip arrow interactive 
                                                          PopperProps={{
                                                              modifiers:{
                                                              offset: {
                                                                  enabled: true,
                                                                  offset: '0px, 0px',
                                                              },
                                                              },
                                                          }}
                                                          title="Edit"><Link to='/edit' state={{contactDetails:this.state.contactdetails}}><img src={pen} alt="edit" className='star' style={{marginLeft:"20px", cursor:"pointer"}}/></Link></LightTooltip>
                                                            </p>

                                                             <p className='desc2'>{this.state.contactdetails.description}</p>
                                                        </div>

                                                  }
                                                   
                                                   </center>
                                       
                                       
                                       </div>
                                       {/* <div className='curve'>

                                       </div> */}
                                       <div className='detail-content'>
                                       
                                       <div className='personal'>
                                       
                                          {this.state.contactdetails.phone.length>0? <div className='phone'>
                                          <LightTooltip arrow interactive 
                                                PopperProps={{
                                                    modifiers:{
                                                    offset: {
                                                        enabled: true,
                                                        offset: '0px, 0px',
                                                    },
                                                    },
                                                }}
                                                title="Phone"><img src={phone} alt="" className='phone-icon'/></LightTooltip>
                                           <div className='phone-values'>
                                        {
                                            this.state.contactdetails.phone.map((val,idx)=>{
                                                return(<>
                                                    <p key={idx} className='phnumber'>{val.phonenumber}</p>
                                                    <p key={idx} className='phtype'>{val.phonetype}</p>
                                                    
                                                    </>
                                                )
                                            })
                                        }</div> </div>:<div></div>}
                                        {this.state.contactdetails.line2!==''||this.state.contactdetails.line1!==''||this.state.contactdetails.line1!==''?<div className='phone'>
                                        <LightTooltip arrow interactive 
                                            PopperProps={{
                                                modifiers:{
                                                offset: {
                                                    enabled: true,
                                                    offset: '0px, 0px',
                                                },
                                                },
                                            }}
                                            title="Address"><img src={location} alt="" className='phone-icon'/></LightTooltip>
                                            <p className='phnumber' style={{display:"flex",flexDirection:"column"}}>
                                                <span>{this.state.contactdetails.line1}</span>
                                                <span>{this.state.contactdetails.line2}</span>
                                                <span>{this.state.contactdetails.line3}</span>
                                                </p>
                                        </div>:<div></div>}
                                        {this.state.contactdetails.contactemail.length>0?<div className='phone'>
                                        <LightTooltip arrow interactive 
                                        PopperProps={{
                                            modifiers:{
                                            offset: {
                                                enabled: true,
                                                offset: '0px, 0px',
                                            },
                                            },
                                        }}
                                        title="Email"><img src={email} alt="" className='phone-icon'/></LightTooltip>
                                           <div className='phone-values'>
                                        {
                                            this.state.contactdetails.contactemail.map((val,idx)=>{
                                                return(<>
                                                    <p key={idx} className='phnumber'>{val.emailid}</p>
                                                    <p key={idx} className='phtype'>{val.emailtype}</p>
                                                    
                                                    </>
                                                )
                                            })
                                        }</div> </div>:<div></div>}
                                        {
                                            this.state.contactdetails.social.length>0?
                                            <div>
                                                {
                                                    this.state.contactdetails.social.map((val,idx)=>{
                                                        return(
                                                            <div className='phone'>
                                                            
                                                           
                                                          <LightTooltip arrow interactive 
                                                          PopperProps={{
                                                              modifiers:{
                                                              offset: {
                                                                  enabled: true,
                                                                  offset: '0px, 0px',
                                                              },
                                                              },
                                                          }}
                                                          title={this.capitalize(val.socialtype)}>
                                                              
                                                              
                                                              <img src={val.socialtype.toLowerCase()==="linkedin"?linkedin:val.socialtype.toLowerCase()==="twitter"?twitter:facebook} alt="" className='phone-icon'/></LightTooltip>
                                                    <div className='phone-values'>
                                                    <p className='phnumber'>{val.socialid}</p>
                                                    <p className='phtype'>{val.socialtype}</p></div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>:
                                            <div></div>
                                        }
                                       </div>
                                       <div className='extra-details'>
                                       {this.state.contactdetails.tags.length>0?<div className='phone'>
                                       <LightTooltip arrow interactive 
                                            PopperProps={{
                                                modifiers:{
                                                offset: {
                                                    enabled: true,
                                                    offset: '0px, 0px',
                                                },
                                                },
                                            }}
                                            title="Tags"><img src={tag} alt="" className='phone-icon'/></LightTooltip>
                                           <div className='small-tag'>
                                           
                                        {
                                            this.state.contactdetails.tags.map((val,idx)=>{
                                                return(<>
                                                    <p key={idx} className='tag2'>{val}</p>
                                                   
                                                    
                                                    </>
                                                )
                                            })
                                        } </div>
                                        
                                        </div>:<div></div>}
                                        {this.state.contactdetails.note!==""?<div className='phone'>
                                        <LightTooltip arrow interactive 
                                            PopperProps={{
                                                modifiers:{
                                                offset: {
                                                    enabled: true,
                                                    offset: '0px, 0px',
                                                },
                                                },
                                            }}
                                            title="Private Notes"><img src={notes} alt="" className='phone-icon'/></LightTooltip>
                                            <p className='note'>{this.state.contactdetails.note}</p>
                                        </div>:<div></div>}
                                        {this.state.contactdetails.dob!==null?<div className='phone'>
                                        <LightTooltip arrow interactive 
                                                 PopperProps={{
                                                     modifiers:{
                                                         offset: {
                                                            enabled: true,
                                                            offset: '0px, 0px',
                                                        },
                                                        },
                                                    }}
                                                    title="Birthday"><img src={cake} alt="" className='phone-icon'/></LightTooltip>
                                            <p className='phnumber'>{this.getMonth(this.state.contactdetails.dob)}</p>
                                            </div>:<div></div>}
                                       </div>
                                       </div>


                                                                         
                                       
                                   </motion.div>:
                                   
                                  <div className='contact-more-details'>
                                   <div className='tag-value'>
                                        <div className='search-items'>
                                            <img src={tag} alt="tag" className='tag-icon'/>
                                        <input type="text" placeholder='Private Tags' className='search-tag' onChange={(e)=>this.handleTagSearch(e)}/>
                                        </div>
                                        <motion.div layout className='tag-button'>
                                            {
                                                this.state.tags.map((val,idx)=>{

                                                    return(
                                                    <p key={idx} className='tag-items' onClick={()=>this.tagClicked(idx) }>{val}</p>
                                                    )
                                                })
                                            }
                                         </motion.div>
                                    </div>
                                     {this.state.detailsshow===false && this.state.bdayArray.length>0?   <motion.div layout className='bday-list'>
                                        <LightTooltip arrow interactive 
                                                 PopperProps={{
                                                     modifiers:{
                                                         offset: {
                                                            enabled: true,
                                                            offset: '0px, 0px',
                                                        },
                                                        },
                                                    }}
                                                    title="Upcoming Birthdays"><img src={cake} alt="" className='phone-icon' style={{marginBottom:"30px", marginLeft:"80px"}}/></LightTooltip>  
                                            {
                                                this.state.bdayArray.map((val,idx)=>{
                                                    if(val.dob!==null && idx<3)
                                                    return (<div className='bday-items'>

                                                       {val.profilephoto===""?<p className='profilepic-bday'>{this.findInitials(val.name)}</p>: <motion.img src={val.profilephoto} alt="" className='profilepic-image'
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    transition={{delay:1}}
                                    />}
                                                        <div className='bday-details'>
                                                            <span className='name-bday'>{val.name}</span><br />
                                                            <span className='bday-date' style={{color: "#0D00A7"}}>{this.getMonth(val.dob)}</span><br />
                                                            <span className='bday-date'>{val.days} days left</span><br />
                                                        </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                this.state.bdayArray.length>3?<p style={{color:"#0D00A7", marginLeft:"80px", fontWeight:"bold", cursor:"pointer"}} id="more-bday" onClick={()=>this.removeBday()}>More</p>:<></>
                                            }
                                        </motion.div>:<></>}
                                        </div>}
                                    
                                    
                        </div>
                    </div>
                    
               <DeleteContact trigger={this.state.popup} setTrigger={(e)=>this.deletePopUp()} deleteContact={(e)=>this.deleteContact(e)} />
                <DisplayBirthday trigger={this.state.bdaypop} bdayArray={this.state.bdayArray} setTrigger={(e)=>this.removeBday()}/>
        </div>
           
        );
    }
}

export default Contacts;
