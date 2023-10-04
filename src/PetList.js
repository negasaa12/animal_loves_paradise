import React from "react";
import { useState, useEffect } from "react";
import Pet from "./Pet";
import axios from "axios";
import { useParams } from "react-router-dom";

const PetList = ({ currentUser }) => {
    const [pets, setPets] = useState([]);
    const [saveMessage, setSaveMessage] = useState(null); // State for displaying save status message
    const {type} = useParams();
    console.log(type);
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
    }, [type]); // Pass an empty dependency array to useEffect for one-time data fetching
  
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
            const { name, age, size, gender, photos, type, description, breeds, status } = petDetails;
            const primaryBreed = breeds ? breeds.primary : null;
            const mediumPhoto = photos.length === 0 ? "none":photos[0].medium  ;
            const noDescripition = description === null ? "no description": description;
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
              user
          }
            console.log(petData);
            const savedPet = await axios.post("http://localhost:3002/pets/add", petData);
  
        
  
        // Set a message to indicate that the pet has been saved
        setSaveMessage(`Pet "${name}" has been saved.`);
      } catch (e) {
        console.log(e);
        // Handle the error, e.g., display an error message
        setSaveMessage("Error saving the pet. Please try again later.");
      }
    };
  
    return (
      <>
        <h1>Our Cuties</h1>
        {saveMessage && <p>{saveMessage}</p>}
        <div>
          {pets.length === 0 ? (
            <p>Loading ...</p>
          ) : (
            pets.map((pet) => (
              <div key={pet.id}>
                <Pet
                  id={pet.id}
                  name={pet.name}
                  description={pet.description}
                  age={pet.age}
                  gender={pet.gender}
                  size={pet.size}
                  type={pet.type}
                  breed={pet.breeds}
                  photo={pet.photos}
                />
                <button onClick={() => handlePetButtonClick(pet.id)}>Save</button>
              </div>
            ))
          )}
        </div>
      </>
    );
  };
  
  export default PetList;
  
  
  

