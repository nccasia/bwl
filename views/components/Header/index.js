/* eslint-disable prettier/prettier */
import { useState } from 'react';
import './style.scss';
import LoginButton from '../LoginButton';

function HeaderPage() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <nav className="nav-header">
      <div className="logoNcc">
        <img src="./assets/img/favicon.png" alt="logo" />
      </div>
      <div className="person-icon" onClick={() => handleClick()}>
        <img
          src="./assets/img/person.png"
          className="img-people-avatar"
          alt="avatar"
        />
      </div>
      {open ? <LoginButton /> : <></>}
    </nav>
  );
}
export default HeaderPage;
