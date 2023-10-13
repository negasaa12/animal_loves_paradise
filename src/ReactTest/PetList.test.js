import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom'; // Import `Routes`
import axios from 'axios';
import PetList from '../PetList';

jest.mock('axios');

describe('PetList Component', () => {
  // Mock `useParams` as a default export
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ type: 'dog' }),
  }));

  test('renders loading message while fetching data', async () => {
    // Mock axios.get to return a promise that resolves with an empty array
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={['/pets/dog']}>
        {/* Use <Routes> to wrap <Route> */}
        <Routes>
          <Route path="/pets/:type" element={<PetList currentUser={null} />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if loading message is displayed
    expect(screen.getByText('Our Cuties')).toBeInTheDocument();
    expect(screen.getByText('Loading ...')).toBeInTheDocument();
    
    // Wait for the data to load
    await waitFor(() => screen.getByText('Our Cuties'));

    
  });
  //Renders user FavPets
  test("render pets on petList", async ()=>{
    
    axios.get.mockResolvedValue({ data: [{
      id: 2,
      name: "tespet"
      
    }] });

    
    render(
      <MemoryRouter initialEntries={['/pets/dog']}>
        {/* Use <Routes> to wrap <Route> */}
        <Routes>
          <Route path="/pets/:type" element={<PetList currentUser={null} />} />
        </Routes>
      </MemoryRouter>
    );


  })
});
