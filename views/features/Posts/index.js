import * as React from 'react';
import Header from '../../components/Header';
import {useStore} from "../../store";
import {getUser} from '../../api/apiUser';
import {getOne} from '../../api/apiPosts';
import { useLocation } from 'react-router-dom';
import Container from '../../components/Container';
import "./style.scss";

const Posts = () => {
  const {state, dispatch}=useStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const messageId = searchParams.get('messageId');

  React.useEffect(() => {
    const foo = async () =>{
      if(document.cookie && document.cookie.split("=")[0] === "token"){
        await getUser(document.cookie.split("=")[1]).then(data => dispatch({type:"SET_AUTHOR", payload:data}));
      }
      await getOne(messageId).then(data => dispatch({type:"SET_POST_ONE", payload:data}));
    }
    foo();
  }, [document.cookie, messageId]);

  return (
    <React.Fragment>
      <Header/>
      <div className="container-post">
        <Container/>
      </div>
    </React.Fragment>
  );
};
export default Posts;
