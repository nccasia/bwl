/* eslint-disable prettier/prettier */
import ContainerItem from '../ContainerItem';
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import { getAll, getOne, getHotPosts } from '../../api/apiPosts';

const Container = (props) => {
  const { state, dispatch } = useStore();
  React.useEffect(() => {
    const foo = async (index) => {
      if (
        state.typePosts === 'New' ||
        (props?.type === 'New' && state.page !== -1)
      ) {
        await getAll(
          {
            page: state.page,
            size: state.size,
            messageId: index,
            channel: state.channel,
          },
          dispatch,
        );
      }
      if (
        state.typePosts === 'Search' &&
        props?.messageId &&
        state.page !== -1
      ) {
        await getOne({ messageId: props?.messageId, id: index }, dispatch);
      }
      if (state.typePosts === 'Hot' && state.page !== -1) {
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
    if (state.page !== -1) {
      if (!document.cookie && document.cookie.split('=')[0] !== 'token') {
        foo(null);
      } else {
        if (state?.author?.id) {
          foo(state?.author?.id);
        }
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
