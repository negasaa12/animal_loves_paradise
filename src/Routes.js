import React, { useState, useEffect } from "react";
import {Route, Routes, NavLink} from "react-router-dom";
import Home from "./Home";
import NavBar from "./NavBar";
import RegisterForm from "./RegisterForm";
import PetList from "./PetList";
import axios from "axios";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import UserProvider, {useUser} from "./UserContext";
import { useNavigate } from "react-router-dom";
import EditForm from "./EditForm";
const RoutePaths = () =>{
  

  const navigate = useNavigate()
  const [currentUser, setUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    
    return storedUser !== "undefined"? JSON.parse([storedUser]) : null;
  });

  useEffect(() => {
    // Store user data in localStorage when it changes
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

    const logOut = ()=>{
       localStorage.removeItem("currentUser");
      setUser(null);
      navigate("/")
    };  
  //  const [pets, setPets] = useState([]);

    console.log("CURRENT USER", currentUser);
   



 
const loginUser = async (username, password) => {
    try {
      
      const url = `http://localhost:3002/login`;
  
      const response = await fetch(url, {
        method: 'POST', // Assuming you're using POST for authentication
        headers: {
          'Content-Type': 'application/json',
          
        },
        // You can include the credentials in the request body or headers as needed
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      // Handle the user data, e.g., update the user interface or application state
      setUser(data);
      console.log('User data:', data);
      return true;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  
  
  async function handleEditForm(formData, userId){
    try{
    const response = await axios.patch(`http://localhost:3002/users/password/${userId}`, formData);
        
    const updatedUser = response.data;

    setUser(updatedUser);
    } catch(e){
    
      console.error(e);
    }
  }

   async function handleUserRegistration(formData) {
    try {
      // Send a POST request to your backend
      const response = await axios.post('http://localhost:3002/register', formData);
      
      // Update the user list after a successful registration
      
      const user = response.data;
      
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error(error);
      setUser({ registrationResult: 'Registration failed' });
    }
  }
    
    
    return(
        <>
        <NavBar userInfo={currentUser} handleLogOut={logOut}/>

        <Routes>
            <Route exact path="/" element={<Home/>}></Route>
            <Route exact path="/pets/:type" element={<PetList currentUser={currentUser} />}></Route>
            <Route></Route>
            <Route></Route>
            <Route exact path="/register" element={<RegisterForm onRegister={handleUserRegistration}/>}></Route>
            <Route exact path="/login" element={<LoginForm onLogin={loginUser}/>}></Route>
            <Route exact path="/profile" element={<UserProfile userInfo={currentUser}/> }></Route>
            <Route exact path="/profile/edit" element={<EditForm   onEdit={handleEditForm}userData={currentUser}/> }></Route>
        </Routes>

        </>
    ) 
}

export default RoutePaths ;