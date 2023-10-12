import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditForm.css"; // Import your CSS file for additional styling

const EditForm = ({ userData, onEdit }) => {
  const initial_State = {
    currentPassword: "",
    newPassword: "",
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initial_State);
  const [updateFailed, setUpdateFailed] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const changedPassword = await onEdit(formData, userData.user.userid);
      console.log("changed password", changedPassword);
  
      if (changedPassword) {
        setUpdateFailed(false);
        setUpdateMessage("Password successfully changed.");
      } else {
        setUpdateFailed(true);
        setUpdateMessage("Password change failed.");
      }
  
      setFormData(initial_State);
    } catch (error) {
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
