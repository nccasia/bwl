/* eslint-disable prettier/prettier */
import AppContext from './context';
import contextValue from './value';
const AppProvider = (props) => {
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
