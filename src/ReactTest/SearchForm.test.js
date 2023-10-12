import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchForm from '../SearchForm';

describe('SearchForm', () => {
  it('should render correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SearchForm />);
    const locationInput = getByPlaceholderText("City, State or Postal Code");
    const genderInput = getByPlaceholderText('Gender');
    const searchButton = getByText('Search');

    expect(locationInput).toBeInTheDocument();
    expect(genderInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    const onSearchMock = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <SearchForm onSearch={onSearchMock} />
    );
    const locationInput = getByPlaceholderText("City, State or Postal Code");
    const genderInput = getByPlaceholderText('Gender');
    const searchButton = getByText('Search');

    fireEvent.change(locationInput, { target: { value: 'New York' } });
    fireEvent.change(genderInput, { target: { value: 'Male' } });
    fireEvent.click(searchButton);

    expect(onSearchMock).toHaveBeenCalledWith('New York', 'Male');
  });
});
