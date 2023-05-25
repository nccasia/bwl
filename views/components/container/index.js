/* eslint-disable prettier/prettier */
import ContainerItem from '../ContainerItem';
import './style.scss';
import {useStore} from "../../store";
import React from 'react';
import {getAll} from '../../api/apiPosts';
import CircularProgress from '@mui/material/CircularProgress';

const Container = (props) => {
  const {state, dispatch}=useStore();
  React.useEffect(() => {
    const foo = async () =>{
      await getAll(state.page, dispatch);
    };
    foo();
  }, [state.page]);

  return (
    <div className="container-list">
      {state.posts?.map((post, index) => (
        <div key={index}>
          <ContainerItem {...post} className="container-item"/>
        </div>
      ))}
      {state.loadingPost && (
        <div className="notifi-progress">
          <CircularProgress/>
        </div>
      )}
    </div>
  );
};
export default Container;
