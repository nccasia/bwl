/* eslint-disable prettier/prettier */
import SideBarItem from '../../component/SiderbarItem';
import './style.scss';
const SideBar = () => {
  return (
    <div className="sidebar-left-content">
      <h3 className="sidebar-left-title">Top BWL</h3>
      <SideBarItem />
      <hr />
      <SideBarItem />
      <hr />
      <SideBarItem />
      <hr />
      <SideBarItem />
      <hr />
      <div className="sidebar-left-bottom">
        <span>
          Privacy • Terms • Advertising • Ad Choices • Cookies • Flexbook © 2021
        </span>
      </div>
    </div>
  );
};
export default SideBar;
