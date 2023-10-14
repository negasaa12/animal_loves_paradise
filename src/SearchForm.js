import React from "react";
import { useState } from "react";
import "./SearchForm.css";

const SearchForm = ({ onSearch }) => {
    // Define the initial state for form inputs
  const initial_State = {
    location: "",
    gender: "",
  };

  // Use state to manage form data and error state
  const [formData, setFormData] = useState(initial_State);
  const [loginFailed, setLoginFailed] = useState(false);
  const[errorMessage ,setErrorMessage] = useState("");
  // Function to handle input changes and update the form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract search parameters from the form data
    const { location, gender } = formData;
    
    
    // Call the provided onSearch function with search parameters
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
           <div className="select-container">
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="search-input"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
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
