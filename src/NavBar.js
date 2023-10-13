import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css"; // Adjust the path if needed
import { useState } from "react";




const NavBar = ({ userInfo, handleLogOut }) => {



  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); 

  //setProfile to reveal the drop down nav div
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
  <NavLink className="nav-link" exact to="/pets/dog">
    Dogs
  </NavLink>
</li>
<li className="nav-item">
  <NavLink className="nav-link" exact to="/pets/cat">
    Cats
  </NavLink>
</li>

        
        {userInfo !== null ? (
          <>
               <li className="nav-item">
              <div className="nav-dropdown" onClick={toggleProfileDropdown}>
                Profile
                <div
                  className={`nav-dropdown-content ${
                    profileDropdownOpen ? "nav-dropdown-open" : ""
                  }`}
                >
                  <NavLink className="nav-link-dropdown" exact to="/profile">
                    My Profile
                  </NavLink>
                  <NavLink className="nav-link-dropdown" exact to="/profile/edit">
                    Change Password
                  </NavLink>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <button className="nav-logout-button" onClick={handleLogOut}>
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/login">
                Log In
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/register">
                Sign Up
              </NavLink>
            </li>
          
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;


  
 