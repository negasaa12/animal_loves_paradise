import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css"; // Adjust the path if needed





const NavBar = ({ userInfo, handleLogOut }) => {
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
              <NavLink className="nav-link" exact to="/profile">
                My Profile
              </NavLink>
            </li>

            <li className="nav-item">
              <button className="nav-logout-button" onClick={handleLogOut}>
                Log Out
              </button>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/profile/edit">
                Edit Profile
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/register">
                Sign Up
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/login">
                Log In
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;


  
 