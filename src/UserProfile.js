import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css"; // Import your CSS file
import axios from "axios";

const UserProfile = ({ userInfo }) => {
  const navigate = useNavigate();

  // Check if userInfo is null, and navigate to the home page if it is
  if (userInfo === null) {
    navigate("/");
  }

  const [favePets, setFavePets] = useState([]);
  const [userData, setUserData] = useState(userInfo);
  const [removeMessage, setRemoveMessage] = useState();
  const { userid } = userInfo.user;
    
  const fetchFavePets = async (userid) => {
    const {user, token} = userInfo;
      // console.log( "USER",user)
      const SomeData = {token};
    try {
      const response = await axios.get(`http://localhost:3002/pets/${userid}/favpets`, {
          params : {token, user}

      }   
        
      );
  
  
      
      const data = response.data;
      setFavePets(data);
    } catch (e) {
      console.log("Error, fetching favorite pets", e);
    }
  };
  

  useEffect(() => {
    setUserData(userInfo);
    fetchFavePets(userid);
  }, [userInfo, userid]);
  

  const handleButtonClick = async (petid)=>{
      const {token } = userData;
      const {user} = userData;
      try{
        const response = await axios.delete(`http://localhost:3002/pets/${petid}`);
        
        setFavePets((prevFavePets) => prevFavePets.filter((pet) => pet.petid !== petid));
        setRemoveMessage(<p>Pet has been deleted</p>);
        setTimeout(() => {
          setRemoveMessage();
        }, 2000);
        
       
      } catch(e){
        console.log(e);
         setRemoveMessage(<p>Can't delete pet</p>)
      }
    

  }; 
  // Render user data and favorite pets only if userInfo is not null
  return (

    <div className="user-profile-container">
      <div className="user-info">
        <h1 className="h1-headers-profile">Welcome back</h1>
        <h2 className="user-name">
          {userInfo.user.firstname} {userInfo.user.lastname}
        </h2>
      </div>
      {removeMessage && <p className="save-message-profile">{removeMessage}</p>}
      <div className="favorite-pets">
        <h3 className="favorite-pets-heading">Your Favorite Pets</h3>
        <div className="favorite-pets-list">
          {favePets.length === 0 ? (
            <h3 className="favorite-pet-message">No Favorites Yet?</h3>
          ) : (
            favePets.map((pet) => (
              <div key={pet.petid} className="favorite-pet-card">
               
                <h4 className="pet-name">{pet.name.toUpperCase()}</h4>
                <img src={pet.photo} alt={pet.name} className="pet-image" />
                <p className="pet-description">{pet.description}</p>
                <p className="pet-description">{pet.breed}</p>
                <p className="pet-description">{pet.age}</p>
                <p className="pet-description">{pet.gender}</p>
                <p className="pet-description">{pet.contact}</p>
                <button onClick={() => handleButtonClick(pet.petid)}>Unfavorite</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
  
            }
export default UserProfile;
