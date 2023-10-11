import React from "react";
import {useState} from "react";
import { useNavigate } from "react-router-dom";



const RegisterForm = ({onRegister})=>{

    const initial_State = {
      username: "",
      firstName : "",
      lastName : "",
      email : "",
      password: "",
      location: "",
      contact: ""
        }

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
    
      
      const handleSubmit = (e) => {
        e.preventDefault();
 
        onRegister(formData)
        setFormData(initial_State);
        navigate("/login");
      };


    return(
        <>
        <h1 class="h1-headers" > Sign Up</h1>

        <div className="edit-form-container">
            <form  onSubmit={handleSubmit}>

            <label className="form-label" htmlFor="username" > Username</label>
                    <input
                    className="form-input"
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />

                <label className="form-label" htmlFor="firstName" > First Name</label>
                    <input
                    className="form-input"
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />

                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input
                className="form-input"
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                />

                <label className="form-label" htmlFor="email">Email</label>
                <input
                className="form-input"
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                />

                <label className="form-label" htmlFor="password">Password</label>
                <input
                className="form-input"
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                />

                  <label className="form-label" htmlFor="location">Address</label>
                <input
                className="form-input"
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                />
                   <label className="form-label" htmlFor="contact">Phone Number</label>
                <input
                className="form-input"
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                />


                <button className="form-button">Submit</button>
            </form>
        </div>
        </>
    )
}

export default RegisterForm ;
