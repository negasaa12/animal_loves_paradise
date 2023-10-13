import React from "react";
import {useState} from "react";
import { useNavigate } from "react-router-dom";


//Register Form component for user to Register to the site.
const RegisterForm = ({onRegister})=>{


    //initial state for the form inputs 
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
    const [message, setMessage ]= useState("");

    
    const handleChange = (e) => {

      //extract name and value from the event target
        const { name, value } = e.target;
        setFormData((formData) => ({
          ...formData,
          [name]: value,
        }));
      };
    
      
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const newUser = await onRegister(formData);
          
          //if user is not undefined
          if (newUser) {
            
            setLoginFailed(false);
            //setFormData to initial State
            setFormData(initial_State);
            //navigate to login
            navigate("/login");
          }

          
        } catch (error) {
          console.error("Error registering", error);
          
          setLoginFailed(true);
          //setMessage to the error thrown by the backend
          setMessage(error.response.data.error.message);
         
        }
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
                type="password"
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
                {message && (
          <p className={loginFailed ? "error-message" : "success-message"}>
            {message}
          </p>
                )}
            </form>
        </div>
        </>
    )
}

export default RegisterForm ;
