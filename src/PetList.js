import React from "react";
import { useState, useEffect } from "react";
import Pet from "./Pet";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PetList.css";
import defaultPhoto from "./images/animalPhoto.webp";



const PetList = ({ currentUser }) => {
    const [pets, setPets] = useState([]);
    const [saveMessage, setSaveMessage] = useState(null); // State for displaying save status message
    const {type} = useParams();
   



    useEffect(() => {
      const fetchPets = async (type) => {
        try {
          const response = await fetch(`http://localhost:3002/pets/type/${type}`); 
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          setPets(data);
        } catch (e) {
          console.log("Error, fetching pets", e);
        }
      };

        
      fetchPets(type);
    }, [type]);



  
    const handlePetButtonClick = async (petId) => {
      
        if (currentUser === null) {
            // Set a message to indicate that the user needs to log in
            setSaveMessage("You need to log in to save a pet.");
            return;
        }
            const {user} = currentUser;
            console.log("SOLE USER", user);
            const userid = currentUser.user.userid;
            const token = currentUser.token;
          
      try {
            const response = await axios.get(`http://localhost:3002/pets/id/${petId}`);
            
            const petDetails = response.data.animal;
            const { name, age, size, gender, photos, type, description, breeds, status, contact } = petDetails;
            const primaryBreed = breeds ? breeds.primary : null;
            const mediumPhoto = photos.length === 0 ? defaultPhoto : photos[0].medium  ;
            const noDescripition = description === null ? "no description": description;
            const noContact = contact.email === null ? "no contact" : contact.email;
            const petData = {
              name,
              age,
              size,
              gender,
              photo :mediumPhoto,
              type,
              description : noDescripition,
              breed: primaryBreed,
              adopted: status,
              userId: userid,
              token,
              user,
              contact : noContact
          }
            console.log(petData);
            const savedPet = await axios.post("http://localhost:3002/pets/add", petData);
  
        
  
        // Set a message to indicate that the pet has been saved
        setSaveMessage(`Pet "${name}" has been saved.`);
        setTimeout(() => {
          setSaveMessage(null);
        }, 5000);
      } catch (e) {
        console.log(e);
        // Handle the error, e.g., display an error message
        setSaveMessage("Error saving the pet. Please try again later.");
        
      }
    };
      console.log(pets);
      return (
        <>
        <h1 className="h1-headers" >Take A Look Around</h1>
          <h2 className="pet-list-h2">Our Cuties</h2>
      
          {saveMessage && (
            <p className={`save-message${saveMessage.startsWith("You") ? ' error-message' : ''}`}>
              {saveMessage}
            </p>
          )}
          <div className="pet-list-container">
            {pets.length === 0 ? (
              <p className="loading-p">Loading ...</p>
            ) : (
              pets.map((pet) => (
                <div key={pet.id}>
                  <Pet
                    id={pet.id}
                    name={pet.name.toUpperCase()}
                    description={pet.description ? pet.description : "N/A"}
                    age={pet.age}
                    gender={pet.gender}
                    size={pet.size}
                    type={pet.type}
                    breed={pet.breeds}
                    photo={pet.photos ? pet.photos : defaultPhoto}
                    contact={pet.contact.email}
                    adopted={pet.status}
                    onSave={handlePetButtonClick}
                  />
                </div>
              ))
            )}
          </div>
        </>
      );
      
  };
  
  export default PetList;
  
  
  

