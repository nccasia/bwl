/* eslint-disable prettier/prettier */
import { AppContext } from '../App';
import { useContext } from 'react';
const useStore = () => {
  const appData = useContext(AppContext);
  return appData;
};
export default useStore;
