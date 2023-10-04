import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; 

import Home from "../Home"; 

test("renders Home component with links", () => {
  render(
    <Router>
      <Home />
    </Router>
  );

  expect(screen.getByText("Cat & Dog Love")).toBeInTheDocument();
  expect(screen.getByText("Dogs")).toBeInTheDocument();
  expect(screen.getByText("Cats")).toBeInTheDocument();

 
});
