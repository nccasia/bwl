/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import HeaderPage from './component/Header';
import MainContent from './features/layout';
import './app.scss';
function App() {
  return (
    <React.Fragment>
      <HeaderPage />
      <MainContent />
    </React.Fragment>
  );
}

export default App;
