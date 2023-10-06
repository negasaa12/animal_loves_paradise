import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterForm from "../RegisterForm";

// Mock the useNavigate function
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

describe("RegisterForm", () => {
  // Define a mock function for the onRegister prop
  const mockOnRegister = jest.fn();

  beforeEach(() => {
    // Render the component with the mock onRegister prop
    render(<RegisterForm onRegister={mockOnRegister} />);
  });

  test("renders the form with input fields", () => {
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("handles form input and submission", () => {
    const usernameInput = screen.getByLabelText("Username");
    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const locationInput = screen.getByLabelText("Address");
    const contactInput = screen.getByLabelText("Phone Number");
    const submitButton = screen.getByText("Submit");

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(locationInput, { target: { value: "123 Main St" } });
    fireEvent.change(contactInput, { target: { value: "123-456-7890" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Check if the onRegister function was called with the form data
    expect(mockOnRegister).toHaveBeenCalledWith({
      username: "testuser",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: "password123",
      location: "123 Main St",
      contact: "123-456-7890",
    });
  });
});
