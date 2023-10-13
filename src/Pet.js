import React from "react";
import "./Pet.css";
import defaultPhoto from "./images/animalPhoto.webp";



//Pet component that shows a a Pet Card with all their details

const Pet = ({ id, name, breed, age, size, gender, type, description, photo, adopted, contact, onSave}) => {
  const mediumPhoto = photo.length > 0 ? photo[0].medium : defaultPhoto;
  
  return (
    <div className="pet-card">
      <h2 className="pet-name">{name}</h2>
      <img src={mediumPhoto} alt={name} className="pet-image" />
      <p className="pet-details">Breed: {breed.primary}</p>
      <p className="pet-details">Age: {age}</p>
      <p className="pet-details">Gender: {gender}</p>
      <p className="pet-details">Type: {type}</p>
      <p className="pet-details">Size: {size}</p>
      <p className="pet-details">Description: {description}</p>
      <p className="pet-details">Contact: {contact}</p>
      {adopted === "adoptable" ? (
        <p className="adopt-message">Adopt Me !!!</p>
      ) : (
        <p className="adopt-message">Adopted!</p>
      )}
       <button className="save-button" onClick={() => onSave(id)}>Save</button>
    </div>
  );
};

export default Pet;