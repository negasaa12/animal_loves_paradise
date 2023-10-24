import React from "react";
import { useState, useEffect } from "react";
import Pet from "./Pet";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PetList.css";
import defaultPhoto from "./images/animalPhoto.webp";
import SearchForm from "./SearchForm";

// Pet List component 
const PetList = ({ currentUser }) => {
  
    const [pets, setPets] = useState([]);
    const [saveMessage, setSaveMessage] = useState(null); // State for displaying save status message
    const {type} = useParams();
   
    // async function: gets Pets Object from the API backend 
    const fetchPets = async (location, gender) => {
      try {
        const response = await axios.get(`http://localhost:3002/pets/type/${type}`, {
          params: {
            location: location || undefined, // Pass undefined if location is empty
            gender: gender || undefined, // Pass undefined if gender is empty
          },
        });
  
        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }
  
        const data = response.data;
        setPets(data);
      } catch (e) {
        console.log("Error, fetching pets", e);
      }
    };

    useEffect(() => {
      fetchPets(); // Initialize with empty location and gender
    }, [type]);
  



    // function handles adding a pet to the Users Fav petList
    const handlePetButtonClick = async (petId) => {
      
        if (currentUser === null) {
            // Set a message to indicate that the user needs to log in
            setSaveMessage("You need to log in to save a pet.");
            return;
        }
            const {user} = currentUser;
            
            const userid = currentUser.user.userid;
            const token = currentUser.token;
          
      try {
            //send GET request to /pets/id/petId that gets pet information from PET API
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
            
            const savedPet = await axios.post("http://localhost:3002/pets/add", petData);
  
        
  
        // Set a message to indicate that the pet has been saved
        setSaveMessage(`Pet "${name}" has been saved.`);
        setTimeout(() => {
          setSaveMessage(null);
        }, 2000);
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
        <SearchForm  onSearch={fetchPets}/>
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
  
  
  

