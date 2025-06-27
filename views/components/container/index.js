/* eslint-disable prettier/prettier */
import React from 'react';
import { getAll, getHotPosts, getOne } from '../../api/apiPosts';
import { useStore } from '../../store';
import ContainerItem from '../ContainerItem';
import './style.scss';

const Container = (props) => {
  const { state, dispatch } = useStore();
  const lastApiCall = React.useRef(null);

  React.useEffect(() => {
    if (!props.isActive) {
      return;
    }

    const apiKey = `${props.tabType}-${state?.author?.id || 'null'}-${state.page}-${state.channel}-${props?.messageId || ''}`;
    if (lastApiCall.current === apiKey) {
      return;
    }

    lastApiCall.current = apiKey;
    const foo = (index) => {
      if (props.tabType === "New") {
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
      if (props.tabType === "Search" && props?.messageId) {
        getOne({ messageId: props?.messageId, id: index }, dispatch);
      }
      if (props.tabType === "Hot") {
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
      if (state?.author?.id) {
        foo(state?.author?.id);
      } else {
        foo(null);
      }
    }
  }, [
    props.isActive,
    props.tabType,
    state?.author?.id,
    state.page,
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
