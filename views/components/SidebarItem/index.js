/* eslint-disable prettier/prettier */
import UserInfo from '../userInfo';
import './style.scss';

const SideBarItem = (props) => {
  const { link } = props;
  return (
    <div className="sidebar-item">
      <div className="sidebar-item-image">
        <img src={`https://bwl.vn/images/${link}`} />
      </div>
      <UserInfo {...props} />
    </div>
  );
};
export default SideBarItem;
