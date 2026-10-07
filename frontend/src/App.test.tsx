import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

// Deliberately untagged scaffolding: no requirement tag and no TC ID.
// Milestone 0 ships no product behavior, so this asserts only that the frontend
// test harness runs and renders the placeholder shell. It evidences no FR or NFR
// and appears in no requirement's verification table — a TC ID here would claim
// evidence that does not exist. See "Acceptance criteria and test case IDs" in
// appointment-booking-project.md. Behavioral frontend tests, tagged and with TC
// IDs, arrive with the slots view in milestone 1.
describe('App shell', () => {
  it('renders the milestone 0 placeholder', () => {
    render(<App />);
    expect(screen.getByText(/Milestone 0 placeholder/)).toBeTruthy();
  });
});
