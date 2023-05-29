import * as React from 'react';
import Header from '../../components/Header';
import {useStore} from "../../store";
import {getUser} from '../../api/apiUser';
import {getOne} from '../../api/apiPosts';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from '../../components/Container';
import "./style.scss";
import HomeIcon from '@mui/icons-material/Home';

const Posts = () => {
  const {state, dispatch}=useStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const messageId = searchParams.get('messageId');

  React.useEffect(() => {
    const foo = async () =>{
      if(document.cookie && document.cookie.split("=")[0] === "token"){
        await getUser(document.cookie.split("=")[1], dispatch);
      }
      await getOne(messageId).then(data => dispatch({type:"SET_POST_ONE", payload:data}));
    }
    foo();
  }, [messageId, document.cookie]);

  const navigate = useNavigate();
  const handleChangePage = async (index) => {
    await dispatch({type: "SET_POSTS_NULL"});
    navigate("/");
  }

  return (
    <React.Fragment>
      <Header/>
      <h1 
        className="home-posts"
        onClick={handleChangePage}
        style={{ backgroundColor: state.background ? "black": "#f5f5f500"}}
      >
        <HomeIcon />
        Trang chủ
      </h1>
      <div 
        className="container-post"
        style={{ backgroundColor: state.background ? "black": "#f5f5f500"}}
      >
        <Container/>
      </div>
    </React.Fragment>
  );
};
export default Posts;
