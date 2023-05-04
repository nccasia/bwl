/* eslint-disable prettier/prettier */
import ContainerItem from '../ContainerItem';
import './style.scss';
import useStore from '../../hook/useStore';

const Container = () => {
  const value = useStore();
  console.log('value', value.posts);
  return (
    <div className="container-list">
      {value.posts.map((post) => (
        <ContainerItem {...post} className="container-item" />
      ))}
    </div>
  );
};
export default Container;
