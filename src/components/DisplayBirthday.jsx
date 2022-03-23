import React from 'react';
import {motion} from 'framer-motion'
import cake from './icons/cake.svg';
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


function DisplayBirthday(props) {
    const getMonth=(date)=>
{
    if(date!==null)
    {
const dd = date[8]+date[9];
const Newdate = new Date(date); 
const month = Newdate.toLocaleString('default', { month: 'long' });
return (month+", "+dd);
}
}
const findInitials=(str)=>
{
    const arr = str.split(" ")
    var s="";
    for(var i=0;i<arr.length;i++)
    {
        s=s+" "+arr[i][0].toUpperCase()
    }
    return s;
}
    return (props.trigger)?(
        <div>
            <motion.div className='popup' initial={{opacity:0}}
            animate={{opacity:1}}>
                <div className='popup-inner'>
                <LightTooltip arrow interactive 
                                                 PopperProps={{
                                                     modifiers:{
                                                         offset: {
                                                            enabled: true,
                                                            offset: '0px, 0px',
                                                        },
                                                        },
                                                    }}
                                                    title="Upcoming Birthdays"><img src={cake} alt="" className='phone-icon' style={{marginBottom:"30px", marginLeft:"135px"}}/></LightTooltip>
                <motion.div layout className='bday-list bday-popup' style={{marginLeft:"0px",paddingTop:"30px"}}>
                                          
                                            {
                                                props.bdayArray.map((val,idx)=>{
                                                    
                                                    return (<div className='bday-items'>

                                                       {val.profilephoto===""?<p className='profilepic-bday'>{findInitials(val.name)}</p>: <motion.img src={val.profilephoto} alt="" className='profilepic-image-bday'
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    transition={{delay:1}}
                                    />}
                                                        <div className='bday-details'>
                                                            <span className='name-bday'>{val.name}</span><br />
                                                            <span className='bday-date' style={{color: "#0D00A7"}}>{getMonth(val.dob)}</span><br />
                                                            <span className='bday-date'>{val.days} days left</span><br />
                                                        </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </motion.div>
                    <button className='delete-button-cancel' onClick={(e)=>props.setTrigger(e)}>Cancel</button>
                </div>

            </motion.div>
        </div>
    ):'';
}

export default DisplayBirthday;