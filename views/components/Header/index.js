/* eslint-disable prettier/prettier */
import { useState } from 'react';
import './style.scss';
import LoginButton from '../LoginButton';
import useStore from '../../hook/useStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon } from '@fortawesome/free-solid-svg-icons';

function HeaderPage() {
  const value = useStore();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <nav className="nav-header">
      <div className="logoNcc">
        <img src="./assets/img/favicon.png" alt="logo" />
      </div>
      {value.userProfile.userId === null ? (
        <div className="person-icon" onClick={() => handleClick()}>
          <img
            src="./assets/img/person.png"
            className="img-people-avatar"
            alt="avatar"
          />
          {open ? <LoginButton title="Đăng nhập" /> : <></>}
        </div>
      ) : (
        <div className="header-left">
          <div className="icon">
            <FontAwesomeIcon icon={faMoon} />
          </div>
          <div className="icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="person-icon logout" onClick={() => handleClick()}>
            <img
              src={`https://cdn.discordapp.com/avatars/${value.userProfile.userId}/${value.userProfile.userAvatar}`}
              className="img-people-avatar"
              alt="avatar"
            />
            {open ? (
              <div className="logout-button">
                <div className="logout-button-info">
                  <img
                    src={`https://cdn.discordapp.com/avatars/${value.userProfile.userId}/${value.userProfile.userAvatar}`}
                    className="img-people-avatar"
                    alt="avatar"
                  />
                  <div className="user-name">{value.userProfile.userName}</div>
                </div>
                <div className="button">
                  <LoginButton title="Đăng xuất" />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
export default HeaderPage;
