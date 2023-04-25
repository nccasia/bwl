/* eslint-disable prettier/prettier */
import './style.scss';
import UserInfo from '../userInfo';
import useStore from '../../hook/useStore';
import React, { useState } from 'react';
const ContainerItem = (props) => {
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const { link, reactList, totalReact, messageId } = props;
  const [open, setOpen] = useState(false);
  const value = useStore();
  const { getComment } = value;
  const handleClick = (messageId) => {
    setOpen(!open);
    getComment(messageId);
  };
  return (
    <div key={messageId} className="container-item">
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
        <span onClick={() => handleClick(messageId)} className="react-comment">
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
          <button onClick={() => handleInputChange()}>😀</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default ContainerItem;
