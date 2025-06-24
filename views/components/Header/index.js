/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import LoginButton from '../LoginButton';
import Notification from '../Notification';
import { useStore } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { getNotificationSize } from '../../api/apiNotification';
import { postNotification } from '../../api/apiNotification';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function HeaderPage() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = React.useState(false);
  const [openNotification, setOpenNotification] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
    setOpenNotification(false);
    dispatch({ type: 'CHANGE_MENU', payload: false });
  };
  React.useEffect(() => {
    if (state.author?.id) {
      getNotificationSize(state.author.id, dispatch);
    }
  }, [state.author?.id]);
  const handleNotification = async () => {
    setOpenNotification(!openNotification);
    setOpen(false);
    dispatch({ type: 'CHANGE_MENU', payload: !openNotification });
    if (openNotification) {
      if (state?.notification[0]?.onLabel) {
        postNotification(state.author?.id);
      }
      dispatch({ type: 'SET_NOTIFICATION' });
    }
  };

  return (
    <nav
      className="nav-header"
      style={{ backgroundColor: state.background ? '#242526' : 'white' }}
    >
      <div className="nav-header-icon">
        <div>
          <img
            src="./assets/img/logo.png"
            alt="logo"
            width="30px"
            height="30px"
          />
        </div>
      </div>
      <div
        className="channel-header"
      // style={{
      //   backgroundColor: state.background ? 'rgb(36, 37, 38)' : 'white',
      // }}
      >
        {state.channelList
          ? state.channelList
            ?.filter((item) => item?.id === state.channel)
            .map((item) => {
              return (
                <div className="channel-header-item" key={item?.id}>
                  {/* <h1>{item?.icon}</h1> */}
                  <div className="channel-header-name">
                    <h2>Welcome to {item?.name}</h2>
                    <p>{item?.title}</p>
                  </div>
                </div>
              );
            })
          : null}
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
              <NotificationsIcon
                sx={{ color: openNotification ? 'white' : '#6C7588' }}
                color="action"
              />
            </Badge>
            {openNotification && (
              <div
                className={
                  state.background
                    ? 'dialog-button-dark dialog-button-dark_notifi'
                    : 'dialog-button-light dialog-button-light_notifi'
                }
              >
                <Notification
                  setOpenNotification={setOpenNotification}
                  openNotification={openNotification}
                />
              </div>
            )}
          </div>
          <div className="person-icon logout" onClick={() => handleClick()}>
            <img
              src={`${state.author?.avatar}`}
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
