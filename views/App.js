/* eslint-disable prettier/prettier */
import React from 'react';
import './app.scss';
import Login from './features/Login';
import Posts from './features/Posts';
import Bwl from './features/Bwl';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useStore} from "./store";


function App() {
  const {state, dispatch}=useStore();
  React.useEffect(() => {
    const evtSource = new EventSource('/api/sse');
    evtSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      dispatch({type: 'SET_SSE', payload: message});
    };    
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Bwl />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/posts" element={<Posts />} />
      </Routes>
    </Router>
  );
}
export default App;
