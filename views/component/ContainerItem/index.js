/* eslint-disable prettier/prettier */
import { useState } from 'react';
import './style.scss';
import UserInfo from '../userInfo';
const ContainerItem = () => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <div className="container-item">
      <UserInfo />
      <div className="container-item-img">
        <img src="./assets/img/pc2.png" />
      </div>
      <div className="container-item-reactTotal">
        <span>0</span>
      </div>
      <div className="container-item-react">
        <span className="react-like">Thích</span>
        <span onClick={() => handleClick()} className="react-comment">
          Bình luận
        </span>
      </div>
      {open ? (
        <div className="container-item-reactInfo">
          <input
            type="text"
            className="react-input"
            placeholder="Thêm bình luận"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default ContainerItem;
