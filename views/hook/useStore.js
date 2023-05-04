/* eslint-disable prettier/prettier */
import { AppContext } from '../store';
import { useContext } from 'react';
const useStore = () => {
  const appData = useContext(AppContext);
  return appData;
};
export default useStore;
