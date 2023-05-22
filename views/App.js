import React from 'react';
import Bwl from './features/Bwl';
import './app.scss';
import { AppProvider } from './store';
import Login from './features/Login';
import Posts from './features/Posts';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Bwl />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/posts" element={<Posts />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
export default App;
