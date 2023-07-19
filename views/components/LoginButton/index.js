/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import { useStore } from '../../store';
import { getLogout } from '../../api/apiLogin';

const LoginButton = (props) => {
  const { state, dispatch } = useStore();
  const handleOnclick = () => {
    if (props.title === 'Logout' && state.author?.id) {
      getLogout(state.author?.id);
    }
  };
  return (
    <div className="container-lbutton">
      {props.title === 'Logout' ? (
        <div className="logout-button-info">
          <img
            src={`https://cdn.discordapp.com/avatars/${state.author?.id}/${state.author?.avatar}`}
            className="img-people-avatar"
            alt="avatar"
          />
          <div className="user-name">{state.author?.username}</div>
        </div>
      ) : null}
      <div className="navbar-logout" id="user" onClick={handleOnclick}>
        <a className="link" href={props.link}>
          <div className="link-image" style={{ backgroundColor: state.background ? "#6C7588": "#80808030"}}>
            <img className="icon-logout" src="./assets/img/login.png" />
          </div>
          <span className="text-logout">{props.title}</span>
        </a>
      </div>
    </div>
  );
};

export default LoginButton;
