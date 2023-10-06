import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UserProfile from "../UserProfile";
import axios from "axios";

// Mock the useNavigate function
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock Axios requests
jest.mock("axios");

describe("UserProfile Component", () => {
  it("renders user information and favorite pets when userInfo is not null", async () => {
    const userInfo = {
      user: {
        firstname: "John",
        lastname: "Doe",
      },
      token: "your_token",
      userid: "your_userid",
    };

    const favePetsData = [
      {
        petid: 1,
        name: "Fluffy",
        description: "Cute pet",
        photo: "fluffy.jpg",
      },
      {
        petid: 2,
        name: "Buddy",
        description: "Friendly pet",
        photo: "buddy.jpg",
      },
    ];

    // Mock Axios get request for fetching favorite pets
    axios.get.mockResolvedValueOnce({ data: favePetsData });

    render(<UserProfile userInfo={userInfo} />);

    // Check if user information is rendered
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Wait for favorite pets to be loaded
    await waitFor(() => {
      expect(screen.getByText("Your Favorite Pets")).toBeInTheDocument();
      expect(screen.getByText("Fluffy")).toBeInTheDocument();
      expect(screen.getByText("Buddy")).toBeInTheDocument();
    });
  });

  it("renders a message when there are no favorite pets", async () => {
    const userInfo = {
      user: {
        firstname: "John",
        lastname: "Doe",
      },
      token: "your_token",
      userid: "your_userid",
    };

    // Mock Axios get request for fetching favorite pets with an empty array
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<UserProfile userInfo={userInfo} />);

    // Check if user information is rendered
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Wait for the message to be displayed
    await waitFor(() => {
      expect(screen.getByText("Your Favorite Pets")).toBeInTheDocument();
      expect(screen.getByText("No Favorites huh?")).toBeInTheDocument();
    });
  });

 

});
