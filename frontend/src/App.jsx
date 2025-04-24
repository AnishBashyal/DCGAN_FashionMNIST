import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/HomePage";
import EpochHistoryPage from "./pages/EpochHistoryPage";
import GenerateRandomPage from "./pages/GenerateRandomPage";
import MorphPage from "./pages/MorphPage";

const AppContainer = styled.div`
  font-family: sans-serif;
  text-align: center;
  padding: 20px;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  justify-content: center;
  background-color: #f8f8f8; /* Light gray background */
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  border-radius: 5px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333; /* Dark gray link color */
  font-weight: bold;
  font-size: 1.1em;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ddd; /* Lighter gray on hover */
    color: #007bff; /* Blue on hover */
  }
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navigation>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/history">Epoch History</NavLink>
          <NavLink to="/generate">Generate Random</NavLink>
          <NavLink to="/morph">Fashion Fusion</NavLink>
        </Navigation>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<EpochHistoryPage />} />
          <Route path="/generate" element={<GenerateRandomPage />} />
          <Route path="/morph" element={<MorphPage />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
