/* eslint-disable prettier/prettier */
import * as React from 'react';
import Header from '../../components/Header';
import {useStore} from "../../store";
import {getUser} from '../../api/apiUser';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from '../../components/Container';
import "./style.scss";
import HomeIcon from '@mui/icons-material/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';

const Posts = () => {
  const {state, dispatch}=useStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const messageId = searchParams.get('messageId');

  React.useEffect(() => {
    const foo = async () =>{
      dispatch({type: "SET_POSTS_PAGE", payload: true});
      if(!state.author?.id && document.cookie && document.cookie.split("=")[0] === "token"){
        await getUser(document.cookie.split("=")[1], dispatch);
      }
    }
    foo();
  }, [document.cookie, state.author?.id]);

  const navigate = useNavigate();
  const handleChangePage = async () => {
    navigate("/");
  }

  return (
    <React.Fragment>
      <Header open="ONE"/>
      <h1 
        className="home-posts"
        onClick={handleChangePage}
        style={{ backgroundColor: state.background ? "black": "#f5f5f500"}}
      >
        <HomeIcon />
        Home
      </h1>
      <div 
        className="container-post"
        style={{ backgroundColor: state.background ? "black": "#f5f5f500"}}
      >
        {state.posts?.length === 0 && state.loadingPost && state.changePage && (
          <div className="posts-progress">
            <CircularProgress sx={{color: "rgb(108, 117, 136)"}}/>
          </div>
        )}
        <Container type="ONE" messageId={messageId}/>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
      />
    </React.Fragment>
  );
};
export default Posts;
