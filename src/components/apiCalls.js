import axios from 'axios'

export const getUsers = async () =>{
    return axios.get('https://address-book2022-server.herokuapp.com/users/').then(res => res.data)
}

export const register = async (name, email, password, cpassword) =>{
    return axios.post('https://address-book2022-server.herokuapp.com/users/register',{username:name, email:email,password:password, confirmationPassword:cpassword}).then(res => res.data)
}

export const login = async (name,email,password) =>{
    return axios.post('https://address-book2022-server.herokuapp.com/users/login',{username:name, email:email,password:password}).then(res => res.data)
}

export const verify = async (token) =>{
    return axios.post('https://address-book2022-server.herokuapp.com/users/verify',{secretToken:token}).then(res => res.data)
}

export const defaultContacts = async (email,data) =>{
    return axios.post('https://address-book2022-server.herokuapp.com/users/contacts',{email:email,allcontacts:data}).then(res=>res.data)
}

export const changeContacts = async(email, data)=>{
    return axios.put('https://address-book2022-server.herokuapp.com/users/contacts',{email:email,allcontacts:data}).then(res=>res.data)
}

export const editContacts=async(email,name,data)=>{
    return axios.put('https://address-book2022-server.herokuapp.com/users/contacts-edit',{email:email,name:name,allcontacts:data}).then(res=>res.data)
}

export const getContacts = async(email)=>{
    return axios.get('https://address-book2022-server.herokuapp.com/users/contacts?email='+email,{email:email}).then(res=>res.data)
}

export const deleteUser = async(email)=>{
    return axios.delete('https://address-book2022-server.herokuapp.com/users/register?email='+email,{email:email}).then(res => res.data)
}