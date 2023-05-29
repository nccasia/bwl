import * as React from 'react';
import Header from '../../components/Header';
import {useStore} from "../../store";
import {getUser} from '../../api/apiUser';
import {getOne} from '../../api/apiPosts';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from '../../components/Container';
import "./style.scss";

const Posts = () => {
  const {state, dispatch}=useStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const messageId = searchParams.get('messageId');

  React.useEffect(() => {
    const foo = async () =>{
      await getOne(messageId).then(data => dispatch({type:"SET_POST_ONE", payload:data}));
    }
    foo();
  }, [messageId]);

  const navigate = useNavigate();
  const handleChangePage = async (index) => {
    await dispatch({type: "SET_POSTS_NULL"});
    navigate("/");
  }

  return (
    <React.Fragment>
      <Header/>
      <h1  style={{marginTop: "80px"}} onClick={handleChangePage}>Trang chủ</h1>
      <div className="container-post">
        <Container/>
      </div>
    </React.Fragment>
  );
};
export default Posts;
