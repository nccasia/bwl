import React from 'react';
import Bwl from './features/bwl';
import './app.scss';
import { AppProvider } from './store';
import Login from './features/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Router>
        <AppProvider>
          <Routes>
            <Route exact path="/" element={<Bwl />} />
            <Route exact path="/login" element={<Login />} />
          </Routes>
        </AppProvider>
      </Router>
  );
}
export default App;
