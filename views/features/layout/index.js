/* eslint-disable prettier/prettier */
import Container from '../container';
import SideBar from '../sidebar';
import './style.scss';
const MainContent = () => {
  return (
    <div className="main-container">
      <div className="sidebar-left">
        <SideBar />
      </div>
      <div className="main-content">
        <Container />
      </div>
    </div>
  );
};
export default MainContent;
