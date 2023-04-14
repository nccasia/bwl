/* eslint-disable prettier/prettier */
import './style.scss';
const LoginButton = () => {
  return (
    <div className="navbar-logout" id="user">
      <div className="link">
        <img className="icon-logout" src="./assets/img/login.png" />
      </div>
      <span className="text-logout">Đăng nhập</span>
    </div>
  );
};

export default LoginButton;
