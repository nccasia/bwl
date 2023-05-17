/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import LoginButton from '../LoginButton';
import Notifycation from '../Notification';
import {useStore} from "../../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon } from '@fortawesome/free-solid-svg-icons';
import {getNotification} from '../../api/apiNotification';

function HeaderPage(props) {
  const {state, dispatch}=useStore();
  const [open, setOpen] = React.useState(false);
  const [openLabel, setOpenLabel] = React.useState(0);
  const [openNotification, setOpenNotification] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  React.useEffect(() => {
    if(state.author?.id) {
      getNotification(state.author.id).then(data => {
        dispatch({type:"CHANGE_NOTIFICATION", payload: data})
      })
    }
  }, [state.author?.id]);
  return (
    <nav className="nav-header" style={{ backgroundColor: state.background ? "#242526": "white"}}>
      <div className="logoNcc">
        <img src="./assets/img/favicon.png" alt="logo" />
      </div>
      {!state.author?.id? (
        <div className="person-icon" onClick={() => handleClick()}>
          <img
            src="./assets/img/person.png"
            className="img-people-avatar"
            alt="avatar"
          />
          {open ? (
            <div className="dialog-button ">
              <LoginButton title="Đăng nhập" link="/login"/>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="header-left">
          <div 
            className="icon" 
            style={{ backgroundColor: state.background ? "blue": "#80808030"}} 
            onClick={() => dispatch({type:"CHANGE_BACKGROUND"})}
          >
              <FontAwesomeIcon icon={faMoon} style={{ color: state.background ? "white": "black"}}/>
          </div>
          <div 
            className="icon"
            style={{ backgroundColor: openNotification ? "#1876f245": "#80808030"}}
            onClick={() => {
              setOpenNotification(!openNotification);
              setOpenLabel(1);
            }}
          >
            <FontAwesomeIcon icon={faBell} style={{ color: openNotification ? "blue": "black"}}/>
            {openLabel === 0 && <p className="icon-notifi">{state.notification?.length}</p>}
            {openNotification ? (
              <div className="dialog-button">
                <Notifycation notifications={state.notification}/>
              </div>
            ): null}
          </div>
          <div className="person-icon logout" onClick={() => handleClick()}>
            <img
              src={`https://cdn.discordapp.com/avatars/${state.author?.id}/${state.author?.avatar}`}
              className="img-people-avatar"
              alt="avatar"
            />
            {open ? (
              <div className="dialog-button">
                <LoginButton title="Đăng xuất" link="/"/>
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
