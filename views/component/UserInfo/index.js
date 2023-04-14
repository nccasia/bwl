/* eslint-disable prettier/prettier */
import './style.scss';
const UserInfo = () => {
  return (
    <div className="userInfo-item">
      <div className="userInfo-item-UserAvatar">
        <img src="./assets/img/default-avatar.png" />
      </div>
      <div className="userInfo-item-userInfo">
        <p className="userInfo-name">example.name</p>
        <p className="userInfo-time">13/04/2023 11:20 AM</p>
      </div>
    </div>
  );
};
export default UserInfo;
