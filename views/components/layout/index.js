/* eslint-disable prettier/prettier */
import * as React from 'react';
import Container from '../Container';
import './style.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from '../../store';
import {useDataDebouncer} from '../../util/useDebounce';
import SideBar from '../Sidebar';
import CircularProgress from '@mui/material/CircularProgress';
import  UploadPost from "../UploadPost";

const MainContent = () => {
  const {state, dispatch}=useStore();
  const [scroll, setScroll] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 100) {
        setScroll(true);
      } else if (window.scrollY < 100) {
        setScroll(false);
      }
    };
    if (window.scrollY >= 100) {
      setScroll(true);
    }
    window.addEventListener('scroll', () => {
      handleScroll();
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        if(!state.loadingPost && state.page !== -1){
          useDataDebouncer(dispatch({type: "CHANGE_PAGE", payload: state.page+ 1}), 500);
        }
      }
    })
  }, [dispatch, state.page, state.loadingPost]);
  
  const handleScrollUpClick = () => {
    const step = Math.max(window.scrollY / 50, 20);
    const animation = () => {
      if (window.scrollY > 0) {
        window.scrollTo(0, window.scrollY - step);
        requestAnimationFrame(animation);
      } else {
        setScrollY(0);
      }
    };
    requestAnimationFrame(animation);
  };
  return (
    <div style={{ backgroundColor: state.background ? "black": "#f5f5f500"}}>
      <div className="main-container">
        <div className="sidebar-left">
          <SideBar />
        </div>
        <div className="main-content">
          {state.author?.id && <UploadPost/>}
          <Container type="ALL"/>
          {state.loadingPost && (
            <div className="notifi-progress">
              <CircularProgress />
            </div>
          )}
        </div>
        {scroll && (
          <div onClick={handleScrollUpClick} className="scrollUp"></div>
        )}
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
    </div>
  );
};
export default MainContent;
