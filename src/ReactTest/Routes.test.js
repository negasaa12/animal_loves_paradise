import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RoutePaths from '../Routes';
describe('RoutePaths Component', () => {
  // Mock the localStorage getItem and setItem methods
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };

  beforeEach(() => {
    // Mock localStorage for each test
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('renders the Home component for the / route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RoutePaths />
      </MemoryRouter>
    );
    expect(screen.getByText("Cat & Dog Love")).toBeInTheDocument();
  });


 
});
