/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import LoginButton from '../LoginButton';
import Notification from '../Notification';
import { useStore } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import {getNotificationSize} from '../../api/apiNotification';
import { Link } from "react-router-dom";

function HeaderPage() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = React.useState(false);
  const [openLabel, setOpenLabel] = React.useState(true);
  const [openNotification, setOpenNotification] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
    setOpenNotification(false);
  };
  React.useEffect(() => {
    if (state.author?.id) {
      getNotificationSize(state.author.id, dispatch).then((data) => {
        dispatch({type:"SET_SIZE_NOTIFICATION", payload: data?.size});
      });
    }
  }, [state.author?.id]);
  const handleNotification = async () => {
    setOpenNotification(true);
    setOpen(false);
  }

  return (
    <nav
      className="nav-header"
      style={{ backgroundColor: state.background ? '#242526' : 'white' }}
    >
      <Link to="/">
        <div className="logoNcc">
          <img src="./assets/img/favicon.png" alt="logo" />
        </div>
      </Link>
      {!state.author?.id ? (
        <div className="person-icon" onClick={() => handleClick()}>
          <img
            src="./assets/img/person.png"
            className="img-people-avatar"
            alt="avatar"
          />
          {open ? (
            <div className="dialog-button-light">
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
            style={{ backgroundColor: state.background ? "#1876f245": "#80808030"}} 
            onClick={() => dispatch({type:"CHANGE_BACKGROUND"})}
          >
            {state.background ? 
              <FontAwesomeIcon icon={faSun} style={{ color: "white"}}/>
            : 
              <FontAwesomeIcon icon={faMoon} style={{ color: "#6C7588"}}/>
            }
          </div>
          <div 
            className="icon"
            style={{ backgroundColor: openNotification ? "#1876f245": "#80808030"}}
            onClick={handleNotification}
          >
            <FontAwesomeIcon 
              icon={faBell} 
              style={{ color: openNotification ? "white": "#6C7588"}}
            />
            {state.sizeNotifi !== 0 && <p className="icon-notifi">{state.sizeNotifi}</p>}
            {openNotification ? (
              <div className={state.background ? 'dialog-button-dark dialog-button-dark_notifi' : 'dialog-button-light dialog-button-light_notifi'}>
                <Notification setOpenNotification={setOpenNotification}/>
              </div>
            ) : null}
          </div>
          <div className="person-icon logout" onClick={() => handleClick()}>
            <img
              src={`https://cdn.discordapp.com/avatars/${state.author?.id}/${state.author?.avatar}`}
              className="img-people-avatar"
              alt="avatar"
            />
            {open ? (
              <div 
                className={state.background ? 'dialog-button-dark' : 'dialog-button-light'}
                style={{ backgroundColor: state.background ? "#242526": "white"}} 
              >
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
