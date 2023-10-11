import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter for NavLink
import NavBar from '../NavBar';

describe('NavBar Component', () => {
  test('renders navigation links when user is not logged in', () => {
    render(
      <Router>
        <NavBar userInfo={null} />
      </Router>
    );

    // Check if the navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dogs')).toBeInTheDocument();
    expect(screen.getByText('Cats')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();

    // Check that profile-related links and logout button are not present
    expect(screen.queryByText('My Profile')).toBeNull();
    expect(screen.queryByText('Log Out')).toBeNull();
    expect(screen.queryByText('Change Password')).toBeNull();
  });

  test('renders navigation links and profile links when user is logged in', () => {
    const userInfo = { 
        msg: "logged in",
        token : "sdasldlasdkas;lksd;askd;afasf",                    
            
          user : {
            userid: 1,
            username: "tesUser",
            firstName: "testname"
          }      };

    render(
      <Router>
        <NavBar userInfo={userInfo} />
      </Router>
    );

    // Check if the navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dogs')).toBeInTheDocument();
    expect(screen.getByText('Cats')).toBeInTheDocument();

    // Check that profile-related links and logout button are present
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();

    // Check that Sign Up and Log In links are not present
    expect(screen.queryByText('Sign Up')).toBeNull();
    expect(screen.queryByText('Log In')).toBeNull();
  });

  
});
