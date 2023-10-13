import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchForm from '../SearchForm';



// Test suite for the 'SearchForm' component
describe('SearchForm', () => {

  // Test: Ensure that the 'SearchForm' component renders correctly
  it('should render correctly', () => {
    // Render the 'SearchForm' component
    const { getByPlaceholderText, getByText } = render(<SearchForm />);
    
    // Get elements by their placeholder text and text content
    const locationInput = getByPlaceholderText("City, State or Postal Code");
    const genderInput = getByPlaceholderText('Gender');
    const searchButton = getByText('Search');

    // Assert that the input fields and the search button are present in the rendered component
    expect(locationInput).toBeInTheDocument();
    expect(genderInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  // Test: Ensure that the 'SearchForm' component handles form submission
  it('should handle form submission', () => {
    // Create a mock function for the 'onSearch' prop
    const onSearchMock = jest.fn();
    
    // Render the 'SearchForm' component with the 'onSearch' prop
    const { getByPlaceholderText, getByText } = render(
      <SearchForm onSearch={onSearchMock} />
    );

    // Get elements by their placeholder text and text content
    const locationInput = getByPlaceholderText("City, State or Postal Code");
    const genderInput = getByPlaceholderText('Gender');
    const searchButton = getByText('Search');

    // Simulate changes in the input fields and form submission
    fireEvent.change(locationInput, { target: { value: 'New York' } });
    fireEvent.change(genderInput, { target: { value: 'Male' } });
    fireEvent.click(searchButton);

    // Assert that the 'onSearch' prop is called with the expected values
    expect(onSearchMock).toHaveBeenCalledWith('New York', 'Male');
  });
});
