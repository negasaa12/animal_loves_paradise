import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, useParams } from 'react-router-dom'; 
import axios from "axios";
import PetList from '../PetList';

jest.mock('axios');

describe('PetList Component', () => {
  // Mock useParams to return a specific type
  useParams.mockReturnValue({ type: 'dog' });

  test('renders loading message while fetching data', async () => {
    // Mock axios.get to return a promise that resolves with an empty array
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={['/pets/dog']}>
        <Route path="/pets/:type">
          <PetList currentUser={null} />
        </Route>
      </MemoryRouter>
    );

    // Check if loading message is displayed
    expect(screen.getByText('Loading ...')).toBeInTheDocument();

    // Wait for the data to load
    await waitFor(() => screen.getByText('Our Cuties'));

    // Ensure loading message is no longer present
    expect(screen.queryByText('Loading ...')).toBeNull();
  });

  test('renders pet data and handles saving pets', async () => {
    // Mock axios.get to return a sample pet
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        name: 'Sample Pet',
        description: 'Sample Description',
        age: 2,
        gender: 'Male',
        size: 'Medium',
        type: 'Dog',
        breeds: { primary: 'Breed' },
        photos: [{ medium: 'sample-photo.jpg' }],
        status: 'Adopted',
      },
    });

    // Mock axios.post to return a successful response
    axios.post.mockResolvedValue({ data: 'Pet saved successfully.' });

    render(
      <MemoryRouter initialEntries={['/pets/dog']}>
        <Route path="/pets/:type">
          <PetList currentUser={{ user: { userid: 1 }, token: 'token' }} />
        </Route>
      </MemoryRouter>
    );

    // Wait for the data to load
    await waitFor(() => screen.getByText('Our Cuties'));

    // Check if pet data is displayed
    expect(screen.getByText('Sample Pet')).toBeInTheDocument();
    expect(screen.getByText('Sample Description')).toBeInTheDocument();

    // Simulate clicking the "Save" button
    fireEvent.click(screen.getByText('Save'));

    // Wait for the save message to appear
    await waitFor(() => screen.getByText('Pet "Sample Pet" has been saved.'));

    // Ensure the save message is displayed
    expect(screen.getByText('Pet "Sample Pet" has been saved.')).toBeInTheDocument();
  });
});
