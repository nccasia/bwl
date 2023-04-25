/* eslint-disable prettier/prettier */
import * as React from 'react';
import Container from '../Container';
import SideBar from '../sidebar';
import './style.scss';
const MainContent = () => {
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
    <div className="main-container">
      <div className="sidebar-left">
        <SideBar />
      </div>
      <div className="main-content">
        <Container />
      </div>
      {scroll && <div onClick={handleScrollUpClick} className="scrollUp"></div>}
    </div>
  );
};
export default MainContent;
