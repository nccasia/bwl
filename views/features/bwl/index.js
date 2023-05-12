/* eslint-disable prettier/prettier */
import * as React from 'react';
import MainContent from '../../components/layout';
import Header from '../../components/Header';
import {getAll} from '../../api/apiAll';
import {getNotification} from '../../api/apiNotification';
import {getUser} from '../../api/apiUser';
import {useStore} from "../../store";

const Bwl = () => {
  const {state, dispatch}=useStore();
  React.useEffect(() => {
    const foo = async () =>{
      await getAll(state.page).then(data => dispatch({type:"SET_POSTS", payload:data}));
      if(document.cookie && document.cookie.split("=")[0] === "token"){
        await getUser(document.cookie.split("=")[1]).then(data => dispatch({type:"SET_AUTHOR", payload:data}));
      }
    }
    foo();
  }, [document.cookie, state.page]);

  return (
    <React.Fragment>
      <Header/>
      <MainContent/>
    </React.Fragment>
  );
};
export default Bwl;
