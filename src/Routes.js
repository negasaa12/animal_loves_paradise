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
import NotFound from "./NotFound";
import AuthGuard from "./AuthGuard";




const RoutePaths = () =>{
  

  const navigate = useNavigate()
  const [currentUser, setUser] = useState(() => {
     // Retrieve the current user from localStorage, or set it to null if not present
    const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;

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

   



  // Function to log in a user
  const loginUser = async (username, password) => {
    try {
      
      const url = `http://localhost:3002/login`;
  
      const response = await fetch(url, {
        method: 'POST', // Assuming you're using POST for authentication
        headers: {
          'Content-Type': 'application/json',
          
        },
        //include the credentials in the request body or headers as needed
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
      if(updatedUser){
        console.log("USER PASSWORD SUCCESFULLY UPDATED")
        return true
      }
      
    } catch(e){
    
      console.error(e);
    }
  }
    // Function to handle user registration
   async function handleUserRegistration(formData) {
    try {
      // Send a POST request to your backend
      const response = await axios.post('http://localhost:3002/register', formData);
      
      // Update the user list after a successful registration
      
      const user = response.data;
      return user
    } catch (error) {
      // Handle any errors that occurred during the request
      throw error
      
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
            <Route
          path="/profile"
          element={
            <AuthGuard userInfo={currentUser}>
              <UserProfile userInfo={currentUser} />
            </AuthGuard>
          }
        />
       
      
            <Route exact path="/profile/edit" element={<EditForm   onEdit={handleEditForm}userData={currentUser}/> }></Route>
            <Route path="*" element={<NotFound/>}></Route>
        </Routes>

        </>
    ) 
}

export default RoutePaths ;