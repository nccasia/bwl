/* eslint-disable prettier/prettier */
import ContainerItem from '../ContainerItem';
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import { getAll, getOne } from '../../api/apiPosts';

const Container = (props) => {
  const { state, dispatch } = useStore();
  React.useEffect(()=>{
    const foo = async (index) => {
      if(props?.type==="ALL" && !state.changePage){
        if(state.page>0){
          await getAll({page: state.page, messageId: index}, dispatch);
        }
      }
      if(props?.type==="ONE" && state.page=== -1){
        await getOne({messageId: props?.messageId, id: state.author?.id}, dispatch);
      }
    };
    if (!document.cookie && document.cookie.split("=")[0] !== "token") {
      foo(null);
    }else {
      if(state?.author?.id) {
        foo(state?.author?.id);
      }
    }
  },[state?.author?.id, state.page, props?.type, state.changePage]);

  return (
    <div className="container-list">
      {state.posts?.map((post, index) => (
        <div key={index}>
          <ContainerItem {...post} className="container-item" />
        </div>
      ))}
    </div>
  );
};
export default Container;
