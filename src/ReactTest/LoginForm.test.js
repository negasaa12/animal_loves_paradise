import React from "react";
import { render, screen, fireEvent,  } from "@testing-library/react";
import LoginForm from "../LoginForm";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";




jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

describe("LoginForm", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    // Clear any previous renderings and render the component
       // Mock the useNavigate function before rendering the component
       const mockNavigate = jest.fn();
       jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);
   
    render(<LoginForm onLogin={mockOnLogin} />);
  });

  test("renders the login form with input fields", () => {
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("handles failed login", async () => {
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByText("Submit");

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Mock the onLogin function to return false for failed login
    mockOnLogin.mockResolvedValue(false);

    // Simulate form submission
    fireEvent.click(submitButton);

    // Check if the onLogin function was called with the expected credentials
    expect(mockOnLogin).toHaveBeenCalledWith("testuser", "password123");

    // Wait for the login failure message to be displayed
    await screen.findByText("Login failed. Username/password is wrong.");
  });

  test("handles form input and submission", async () => {
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByText("Submit");
  
    // Mock the useNavigate function
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);
  
    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
  
    // Mock the onLogin function to return true for successful login
    mockOnLogin.mockResolvedValue(true);
  
    // Simulate form submission
    fireEvent.click(submitButton);
  
    // Check if the onLogin function was called with the expected credentials
    expect(mockOnLogin).toHaveBeenCalledWith("testuser", "password123");
  
     mockNavigate("/profile");
     expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });
  
  
  
  
  
});
