/* eslint-disable prettier/prettier */
import { useState } from 'react';
import './style.scss';
import UserInfo from '../userInfo';
const ContainerItem = (props) => {
  const { link, reactList, totalReact } = props;
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <div className="container-item">
      <UserInfo {...props} />
      <div className="container-item-img">
        <img src={`https://bwl.vn/images/${link}`} />
      </div>
      <ul className="container-item-reactTotal">
        {reactList.map((react) => {
          if (react.reactId !== '') {
            return (
              <li className="list-inline-item list-reaction">
                <button className="btn-reaction">
                  {react.reactId !== '' ? (
                    <img
                      className="emoji"
                      src={`https://cdn.discordapp.com/emojis/${react.reactId}.png`}
                      alt={react.reactName}
                    />
                  ) : (
                    <img
                      className="emoji"
                      src="./assets/img/default-react.png"
                      alt={react.reactName}
                    />
                  )}
                </button>
              </li>
            );
          }
        })}
        <span>{totalReact}</span>
      </ul>
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
