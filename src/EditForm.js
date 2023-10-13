import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditForm.css"; // Import your CSS file for additional styling



const EditForm = ({ userData, onEdit }) => {
  
  //initial state of the input field
  const initial_State = {
    currentPassword: "",
    newPassword: "",
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState(initial_State); //formdata starts with the initial state
  const [updateFailed, setUpdateFailed] = useState(false); //boolean to false for the update fail
  const [updateMessage, setUpdateMessage] = useState(""); // update message when the update either fails or it successful

// Function to handle form input changes
const handleChange = (e) => {
  // Extract the 'name' and 'value' from the event target
  const { name, value } = e.target;

  // Update the state using the previous state and the new 'name' and 'value'
  setFormData((formData) => ({
    ...formData,
    [name]: value,
  }));
};

// Function to handle form submission
const handleSubmit = async (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  try {
    // Attempt to change the password using the 'onEdit' function with form data and user ID
    const changedPassword = await onEdit(formData, userData.user.userid);
    console.log("changed password", changedPassword);

    // Check if the password change was successful
    if (changedPassword) {
      // Password change was successful
      setUpdateFailed(false);
      setUpdateMessage("Password successfully changed.");
    } else {
      // Password change failed
      setUpdateFailed(true);
      setUpdateMessage("Password change failed.");
    }

    // Reset the form data to its initial state
    setFormData(initial_State);
  } catch (error) {
    // Handle errors that occur during the password change process
    console.error("Error changing password:", error);
    setUpdateFailed(true);
    setUpdateMessage("An error occurred while changing the password.");
  }
};


  return (
    <div className="edit-form-container">
      <h1 className="edit-form-heading">Change Password</h1>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="currentPassword" className="form-label">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="form-button">
          Submit
        </button>

        <button onClick={() => navigate("/profile")} className="form-button">
          Go Back
        </button>

        {updateMessage && (
          <p className={updateFailed ? "error-message" : "success-message"}>
            {updateMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default EditForm;
