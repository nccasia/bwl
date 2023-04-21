/* eslint-disable prettier/prettier */
import './style.scss';
const LoginButton = () => {
  return (
    <div className="navbar-logout" id="user">
      <a className="link" href="./login">
        <div className="link-image">
          <img className="icon-logout" src="./assets/img/login.png" />
        </div>
        <span className="text-logout">Đăng nhập</span>
      </a>
    </div>
  );
};

export default LoginButton;
