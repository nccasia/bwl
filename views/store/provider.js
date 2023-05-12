/* eslint-disable prettier/prettier */
import AppContext from './context';
import React, {useReducer} from 'react'
import context from "./context";
import reducer, {initState} from "./reducer";

const AppProvider = (props) => {
  const [state, dispatch]= useReducer(reducer, initState);
  return (
    <context.Provider value={{state, dispatch}}>{props.children}</context.Provider>
  );
};

export default AppProvider;
