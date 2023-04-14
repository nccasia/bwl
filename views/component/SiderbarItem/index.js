/* eslint-disable prettier/prettier */
import UserInfo from '../userInfo';
import './style.scss';

const SideBarItem = () => {
  return (
    <div className="sidebar-item">
      <div className="sidebar-item-image">
        <img src="./assets/img/pc1.jpg" />
      </div>
      <UserInfo />
    </div>
  );
};
export default SideBarItem;
