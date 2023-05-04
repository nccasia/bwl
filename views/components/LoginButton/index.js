/* eslint-disable prettier/prettier */
import './style.scss';
const LoginButton = (props) => {
  return (
    <div className="navbar-logout" id="user">
      <a className="link" href={props.link}>
        <div className="link-image">
          <img className="icon-logout" src="./assets/img/login.png" />
        </div>
        <span className="text-logout">{props.title}</span>
      </a>
    </div>
  );
};

export default LoginButton;
