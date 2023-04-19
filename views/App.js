/* eslint-disable prettier/prettier */
import HeaderPage from './components/Header';
import MainContent from './features/layout';
import './app.scss';
import { AppProvider } from './store';
function App() {
  return (
    <React.Fragment>
      <AppProvider>
        <HeaderPage />
        <MainContent />
      </AppProvider>
    </React.Fragment>
  );
}
export default App;
