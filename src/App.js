import logo from './logo.svg';
import './App.css';
import Home from './components/Home'
import Login from './components/Login';
import Contacts from './components/Contacts';
import NewAccount from './components/NewAccount';
import AddContact from './components/AddContact';
import {Routes,Route,Link} from "react-router-dom";
import EditContact from './components/EditContact';
import Forgot from './components/Forgot';
import Verify from './components/Verify';
function Empty()
{
  return <h1>There's Nothing to display</h1>
}
function App() {
  return (
    <>
   <Routes>
   <Route path="/" element={<Home/>}/>
   <Route path="login" element={<Login/>}/>
   <Route path="forgot" element={<Forgot/>}/> 
   <Route path="account" element={<NewAccount/>}/> 
   <Route path="contacts" element={<Contacts/>}/> 
   <Route path="verify" element={<Verify/>}/> 
   <Route path="add" element={<AddContact/>}/> 
   <Route path="edit" element={<EditContact/>}/> 
   <Route path="*" element={<Empty/>}/>
   
  </Routes>
  </>
  );
}

export default App;
