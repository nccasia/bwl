/* eslint-disable prettier/prettier */
import ContainerItem from '../ContainerItem';
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import { getAll, getOne, getHotPosts } from '../../api/apiPosts';

const Container = (props) => {
  const { state, dispatch } = useStore();
  React.useEffect(()=>{
    const foo = async () => {
      if(state.typePosts==="New" || props?.type ==="New"){
        await getAll(
          {
            page: state.page, 
            size: state.size, 
            messageId: state?.author?.id
          }, 
          dispatch
        );
      }
      if(state.typePosts==="Search" && props?.messageId){
        await getOne({messageId: props?.messageId, id: state?.author?.id}, dispatch);
      }
      if(state.typePosts==="Hot"){
        getHotPosts(
          {
            messageId:state?.author?.id, 
            page: state.page, 
            size: state.size, 
          }
        , dispatch);
      }
    };
    if(state.page !== -1){
      foo();
    }
  },[state?.author?.id, state.page, state.typePosts, state.changePage, state.size, props?.messageId]);

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
