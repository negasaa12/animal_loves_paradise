import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const initial_State = {
    username: "",
    password: "",
  };

  const navigate = useNavigate();
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

    // Call the onLogin function and check if it returns true for a successful login
    const loginSuccessful = await onLogin(formData.username, formData.password);

    if (loginSuccessful) {
      // If login was successful, navigate to "/profile"
      navigate("/profile");
    } else {
      // Handle failed login (display an error message, etc.)
      console.error("Login failed");
      setLoginFailed(true);
    }

    setFormData(initial_State);
  };

  return (
    <>
      <h1 className="display-4">Login</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            className="form-input"
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            type="password" // Change input type to password for password field
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button className="form-button" type="submit">
            Submit
          </button>

          {loginFailed && (
            <p className="error-message">
              Login failed. Username/password is wrong.
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default LoginForm;
