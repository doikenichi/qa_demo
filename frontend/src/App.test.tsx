import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

// Milestone 0 ships no product behavior: this asserts only that the frontend
// test harness runs and renders the placeholder shell. Behavioral frontend
// tests arrive with the slots view in milestone 1.
describe('App shell', () => {
  it('renders the milestone 0 placeholder', () => {
    render(<App />);
    expect(screen.getByText(/Milestone 0 placeholder/)).toBeTruthy();
  });
});
