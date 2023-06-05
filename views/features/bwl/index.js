/* eslint-disable prettier/prettier */
import React from 'react';
import MainContent from '../../components/Layout';
import Header from '../../components/Header';
import {getUser} from '../../api/apiUser';
import {useStore} from "../../store";

const Bwl = () => {
  const {state, dispatch}=useStore();
  React.useEffect(() => {
    const foo = async() =>{
      await dispatch({type: "SET_POSTS_PAGE", payload: false});
      if(document.cookie && document.cookie.split("=")[0] === "token"){
        await getUser(document.cookie.split("=")[1], dispatch);
      }
    };
    foo();
  }, [document.cookie]);

  return (
    <React.Fragment>
      <Header />
      <MainContent />
    </React.Fragment>
  );
};
export default Bwl;
