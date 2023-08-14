/* eslint-disable prettier/prettier */
import ContainerItem from '../ContainerItem';
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import { getAll, getOne, getHotPosts } from '../../api/apiPosts';

const Container = (props) => {
  const { state, dispatch } = useStore();
  React.useEffect(()=>{
    const foo = (index) => {
      if(state.typePosts==="New"){
        getAll(
          {
            page: state.page,
            size: state.size,
            messageId: index,
            channel: state.channel,
          },
          dispatch,
        );
      }
      if(state.typePosts==="Search" && props?.messageId){
        getOne({messageId: props?.messageId, id: index}, dispatch);
      }
      if(state.typePosts==="Hot"){
        getHotPosts(
          {
            messageId: index,
            page: state.page,
            size: state.size,
            channel: state.channel,
          },
          dispatch,
        );
      }
    };
    if(state.page !== -1){
      if(state?.author?.id) {
        foo(state?.author?.id);
      } else{
        foo(null);
      }
    }
  }, [
    state?.author?.id,
    state.page,
    state.typePosts,
    state.changePage,
    state.size,
    props?.messageId,
    state.channel,
  ]);

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
