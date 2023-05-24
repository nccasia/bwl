import React from 'react';
import MainContent from '../../components/Layout';
import Header from '../../components/Header';
import {getAll} from '../../api/apiPosts';
import {getUser} from '../../api/apiUser';
import {useStore} from "../../store";
import {useDataDebouncer} from '../../util/useDebounce';

const Bwl = () => {
  const {state, dispatch}=useStore();
  const debounce = useDataDebouncer(state.page, 300);
  React.useEffect(() => {
    const foo = async () =>{
      await getAll(debounce).then(data => dispatch({type:"SET_POSTS", payload:data}));
      if(document.cookie && document.cookie.split("=")[0] === "token"){
        await getUser(document.cookie.split("=")[1]).then(data => dispatch({type:"SET_AUTHOR", payload:data}));
      }
    }
    foo();
  }, [document.cookie, debounce]);

  return (
    <React.Fragment>
      <Header/>
      <MainContent/>
    </React.Fragment>
  );
};
export default Bwl;
