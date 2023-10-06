

import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <>
      <h1>Cat & Dog Love</h1>
      <div>
        <Link to="/pets/dog">Dogs</Link>
        <Link to="/pets/cat">Cats</Link>
      </div>
    </>
  );
};

export default Home;


