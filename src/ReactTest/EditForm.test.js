import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import EditForm from "../EditForm";

describe("EditForm", () => {
  // Define mock functions and data for testing
  const mockOnEdit = jest.fn();
  const userData = {
    user: {
      userid: 1,
    },
  };

  test("renders the form and handles password change", async () => {
    render(
      // Wrap EditForm in MemoryRouter
      <MemoryRouter>
        <EditForm userData={userData} onEdit={mockOnEdit} />
      </MemoryRouter>
    );

    // Fill in the form fields
    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");

    fireEvent.change(currentPasswordInput, {
      target: { name: "currentPassword", value: "currentPass" },
    });
    fireEvent.change(newPasswordInput, {
      target: { name: "newPassword", value: "newPass" },
    });

    // Mock the onEdit function to return true for a successful password change
    mockOnEdit.mockResolvedValue(true);

    // Submit the form
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    // Wait for the success message
    await waitFor(() =>
      expect(screen.getByText("Password Successfully Changed.")).toBeInTheDocument()
    );

    // Ensure that onEdit was called with the correct data
    expect(mockOnEdit).toHaveBeenCalledWith(
      { currentPassword: "currentPass", newPassword: "newPass" },
      userData.user.userid
    );
  });

 
});
