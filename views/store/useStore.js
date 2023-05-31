/* eslint-disable prettier/prettier */
import React from 'react';
import context from './context';

export const useStore = () => {
  const { state, dispatch } = React.useContext(context);
  return { state, dispatch };
};
