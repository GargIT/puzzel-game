import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the game heading', () => {
    render(<App />);
    const heading = screen.getByText(/15 Game/i);
    expect(heading).toBeInTheDocument();
  });
});
