/* eslint-disable prettier/prettier */
import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from './store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

