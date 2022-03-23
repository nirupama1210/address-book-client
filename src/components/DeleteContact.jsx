import React from 'react';
import {motion} from 'framer-motion'

function DeleteContact(props) {
    return (props.trigger)?(
        <div>
            <motion.div className='popup' initial={{opacity:0}}
            animate={{opacity:1}}>
                <div className='popup-inner'>
                    <p id='delete-warning'>Are you sure you want to delete?</p>
                    <button className='delete-button-save' onClick={(e)=>props.deleteContact(e)}>Delete</button>
                    <button className='delete-button-cancel' onClick={(e)=>props.setTrigger(e)}>Cancel</button>
                </div>

            </motion.div>
        </div>
    ):'';
    
}

export default DeleteContact;