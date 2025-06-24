/* eslint-disable prettier/prettier */
import React from 'react';
import './app.scss';
import Login from './features/Login';
import Bwl from './features/Bwl';
import { Routes, Route } from 'react-router-dom';
import { useStore } from "./store";

function App() {
  const {state, dispatch}=useStore();
  React.useEffect(() => {
    const evtSource = new EventSource('/api/sse');
    evtSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      dispatch({ type: 'SET_SSE', payload: message });
    };
    evtSource.onerror = () => {
      evtSource.close();
      window.location.reload();
    };
  }, []);
  
  return (
    <Routes>
      <Route exact path="/" element={<Bwl />} />
      <Route exact path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
