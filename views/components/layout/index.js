/* eslint-disable prettier/prettier */
import * as React from 'react';
import Container from '../Container';
import SideBar from '../sidebar';
import './style.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStore from '../../hook/useStore';

const MainContent = () => {
  const [scroll, setScroll] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const value = useStore();
  console.log('value122r', value);
  console.log('value122r---', value.hotPost.commentPost);
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 100) {
        setScroll(true);
      } else if (window.scrollY < 100) {
        setScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  React.useEffect(() => {
    if (window.scrollY >= 100) {
      setScroll(true);
    }
  }, []);
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
    <>
      <div className="main-container">
        <div className="sidebar-left">
          <SideBar />
        </div>
        <div className="main-content">
          <Container />
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
    </>
  );
};
export default MainContent;
