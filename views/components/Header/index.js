/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import LoginButton from '../LoginButton';
import Notification from '../Notification';
import { useStore } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { getNotificationSize } from '../../api/apiNotification';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SideBar from '../Sidebar';
import {postNotification } from '../../api/apiNotification';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function HeaderPage(props) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = React.useState(false);
  const [openNotification, setOpenNotification] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
    setOpenNotification(false);
    setIsHidden(false);
    dispatch({ type: 'CHANGE_MENU', payload: false });
  };
  React.useEffect(() => {
    if (state.author?.id) {
      getNotificationSize(state.author.id, dispatch).then((data) => {
        dispatch({ type: 'SET_SIZE_NOTIFICATION', payload: data?.size });
      });
    }
  }, [state.author?.id]);
  const handleNotification = async () => {
    setOpenNotification(!openNotification);
    setOpen(false);
    setIsHidden(false);
    dispatch({ type: 'CHANGE_MENU', payload: !openNotification  });
    if(openNotification && state?.notification[0]?.onLabel){
      postNotification(state.author?.id, dispatch);
    }
  };
  const [isHidden, setIsHidden] = React.useState(false);
  const openMenu =()=>{
    dispatch({ type: 'CHANGE_MENU', payload: !isHidden });
    setIsHidden(!isHidden);
    setOpen(false);
    setOpenNotification(false);
  }
  return (
    <nav
      className="nav-header"
      style={{ backgroundColor: state.background ? '#242526' : 'white' }}
    >
      <div className="nav-header-icon">
        {props.open!=="ONE" && (
          <div className="nav-header-menu">
            {isHidden  && (
              <div className={`sidebar_mobile ${isHidden ? "open" : " "}`}>
                <SideBar />
              </div>
            )} 
            {isHidden ?  <ArrowBackIcon onClick={openMenu} className="menu_icon"/> : <MenuIcon onClick={openMenu} className="menu_icon" />}  
          </div>
        )}
        <Link to="/">
          <div className="logoNcc">
            <img src="./assets/img/favicon.png" alt="logo" />
          </div>
        </Link>
      </div>
      {!state.author?.id ? (
        <div className="person-icon" onClick={() => handleClick()}>
          <img
            src="./assets/img/person.png"
            className="img-people-avatar"
            alt="avatar"
          />
          {open ? (
            <div className="dialog-button-light">
              <LoginButton title="Login" link="/login" />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="header-left">
          <div
            className="icon"
            style={{
              backgroundColor: state.background ? '#1876f245' : '#80808030',
            }}
            onClick={() => dispatch({ type: 'CHANGE_BACKGROUND' })}
          >
            {state.background ? (
              <FontAwesomeIcon icon={faSun} style={{ color: 'white' }} />
            ) : (
              <FontAwesomeIcon icon={faMoon} style={{ color: '#6C7588' }} />
            )}
          </div>
          <div
            className="icon"
            style={{
              backgroundColor: openNotification ? '#1876f245' : '#80808030',
            }}
            onClick={handleNotification}
          >
            <Badge badgeContent={state.sizeNotifi} color="primary">
              <NotificationsIcon sx={{ color: openNotification ? 'white' : '#6C7588'}} color="action" />
            </Badge>
            {openNotification && (
              <div
                className={
                  state.background
                    ? 'dialog-button-dark dialog-button-dark_notifi'
                    : 'dialog-button-light dialog-button-light_notifi'
                }
              >
                <Notification setOpenNotification={setOpenNotification} openNotification={openNotification}/>
              </div>
            )}
          </div>
          <div className="person-icon logout" onClick={() => handleClick()}>
            <img
              src={`https://cdn.discordapp.com/avatars/${state.author?.id}/${state.author?.avatar}`}
              className="img-people-avatar"
              alt="avatar"
            />
            {open ? (
              <div
                className={
                  state.background
                    ? 'dialog-button-dark'
                    : 'dialog-button-light'
                }
                style={{
                  backgroundColor: state.background ? '#242526' : 'white',
                }}
              >
                <LoginButton title="Logout" link="/" />
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
