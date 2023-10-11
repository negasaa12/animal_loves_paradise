import React from 'react';
import { Link } from 'react-router-dom';
import dogImage from  "./images/dog-24.png"; // Import the dog image
import catImage from "./images/cat.png"; // Import the cat image
import './Home.css';

const Home = () => {
  return (
    <>

    <h1 className='h1-headers'> Furry Friend Finder</h1>

    
    <div className="center-container">
      <Link to="/pets/dog" className="nav-item">
        <div className="rounded-container">
          <img src={dogImage} alt="Dog" className="rounded-image" />
          <span className='home-span big-text'>Dogs</span>
        </div>
      </Link>
      <Link to="/pets/cat" className="nav-item">
        <div className="rounded-container">
          <img src={catImage} alt="Cat" className="rounded-image" />
          <span className='home-span big-text'>Cats</span>
        </div>
      </Link>
    </div>
    </>
  );
};

export default Home;
