/* eslint-disable prettier/prettier */
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
          <Route path="/" element={<Bwl />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}
export default App;
