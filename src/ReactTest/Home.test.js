import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; 

import Home from "../Home"; 
import { toBeInTheDocument } from "@testing-library/jest-dom/matchers";



test("renders Home component with links", () => {
  render(
    <Router>
      <Home />
    </Router>
  );

  expect(screen.getByText("Furry Friend Finder")).toBeInTheDocument();
  expect(screen.getByText("Dogs")).toBeInTheDocument();
  expect(screen.getByText("Cats")).toBeInTheDocument();

 
});
