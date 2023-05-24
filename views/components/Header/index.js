/* eslint-disable prettier/prettier */
import React from 'react';
import './style.scss';
import LoginButton from '../LoginButton';
import Notification from '../Notification';
import {useStore} from "../../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon } from '@fortawesome/free-solid-svg-icons';
import {getNotification, getNotificationSize} from '../../api/apiNotification';
import { Link } from "react-router-dom";

function HeaderPage(props) {
  const {state, dispatch}=useStore();
  const [open, setOpen] = React.useState(false);
  const [openLabel, setOpenLabel] = React.useState(true);
  const [openNotification, setOpenNotification] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const [size, setSize] = React.useState(0);
  React.useEffect(() => {
    if(state.author?.id) {
      getNotificationSize(state.author.id).then(data => {
        setSize(data?.size);
      })
    }
  }, [state.author?.id]);

  const handleNotification = async () =>{
    setOpenNotification(true);
    if(state.author?.id) {
      await getNotification({messageId: state.author.id, onLabel: true}).then(data => {
        dispatch({type:"CHANGE_NOTIFICATION", payload: data?.notifications})
      })
    }
  }

  return (
    <nav className="nav-header" style={{ backgroundColor: state.background ? "#242526": "white"}}>
      <Link to="/">
        <div className="logoNcc">
          <img src="./assets/img/favicon.png" alt="logo" />
        </div>
      </Link>
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
          <div>
            <div 
              className="icon"
              style={{ backgroundColor: openNotification ? "#1876f245": "#80808030"}}
              onClick={handleNotification}
            >
              <FontAwesomeIcon 
                icon={faBell} 
                style={{ color: openNotification ? "blue": "black"}}
              />
              {size !== 0 && openLabel && <p className="icon-notifi">{size}</p>}
            </div>
            {openNotification ? (
                <div className="dialog-button">
                  <Notification setOpen={setOpenNotification} setLabel={setOpenLabel}/>
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
