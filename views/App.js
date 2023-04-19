/* eslint-disable prettier/prettier */
import { createContext } from 'react';
import HeaderPage from './components/Header';
import MainContent from './features/layout';
export const AppContext = createContext();
import './app.scss';
function App(props) {
  const { data } = props;
  return (
    <AppContext.Provider value={{ posts: data }}>
      <React.Fragment>
        <HeaderPage />
        <MainContent />
      </React.Fragment>
    </AppContext.Provider>
  );
}
export default App;
