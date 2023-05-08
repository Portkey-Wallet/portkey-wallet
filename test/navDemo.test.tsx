import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from './utils/render';
import '@testing-library/jest-dom';
import { Link, Route, Routes } from 'react-router-dom';

const Home = () => <div>home page</div>;
const About = () => <div>about page</div>;

const Goto = () => (
  <div>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </div>
);

/**
 * UT DEMO
 */
describe('components', () => {
  test('Goto', async () => {
    renderWithRouter(<Goto />);

    expect(screen.getByText('home page')).toBeInTheDocument();

    await userEvent.click(screen.getByText('About')); // mock click event

    expect(screen.getByText('about page')).toBeInTheDocument();
  });
});
