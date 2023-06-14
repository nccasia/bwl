/* eslint-disable prettier/prettier */
import ContainerItem from '../ContainerItem';
import './style.scss';
import { useStore } from '../../store';
import React from 'react';

const Container = () => {
  const { state, dispatch } = useStore();
  console.log("hello: ", state.posts);
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
