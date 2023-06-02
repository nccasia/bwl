/* eslint-disable prettier/prettier */
import * as React from 'react';
import Container from '../Container';
import './style.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from '../../store';
import SideBar from '../sidebar';
import {useDataDebouncer} from '../../util/useDebounce';
import { getAll } from '../../api/apiPosts';
import CircularProgress from '@mui/material/CircularProgress';

const MainContent = () => {
  const {state, dispatch}=useStore();
  const [scroll, setScroll] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const debounce = useDataDebouncer(state.page, 300)
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
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight && state.page !== -1) {
        dispatch({type: "CHANGE_PAGE", payload: debounce});
      }
    })
    const foo = async (index) => {
      await getAll({page:state.page, messageId: index}, dispatch);
    };
    if( state.page > 0) {
      if (!document.cookie && document.cookie.split("=")[0] !== "token") {
        foo(null);
      }else {
        if(state?.author?.id) {
          foo(state?.author?.id);
        }
      }
    }
  }, [debounce, state?.author?.id]);
  
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
          <Container />
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
