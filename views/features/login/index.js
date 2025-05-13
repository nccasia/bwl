/* eslint-disable prettier/prettier */
import * as React from 'react';
import './style.scss';
import { getLogin } from '../../api/apiLogin';

const Login = () => {
  const handleClick = async () => {
    await getLogin().then((url) => {
      window.location.href = url;
    });
  };
  return (
    <div className="container-login">
      <div className="box-login">
        <h1> Welcome to <br /> <span>BWL</span></h1>
        <form>
          <button className="btn-login" type="button" onClick={handleClick}>
            <span>Login with Mezon</span>
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
