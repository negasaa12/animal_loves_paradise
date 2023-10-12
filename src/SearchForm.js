import React from "react";
import { useState } from "react";
import "./SearchForm.css";

const SearchForm = ({ onSearch }) => {
  const initial_State = {
    location: "",
    gender: "",
  };

  const [formData, setFormData] = useState(initial_State);
  const [loginFailed, setLoginFailed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pass the search parameters to the onSearch function
    const { location, gender } = formData;
     const foundPet = onSearch(location, gender);
     if(foundPet){
        setFormData(initial_State);
     }
    
   
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="search-input"
            placeholder="City, State or Postal Code"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="search-input"
            placeholder="Gender"
          >
            {/* <option value="">Select Gender</option> */}
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            
          
          </select>
        </div>
        <button className="search-button" type="submit">
          Search
        </button>
      </form>
      {loginFailed && (
        <p className="error-message">Search Failed.</p>
      )}
    </div>
  );
};

export default SearchForm;
