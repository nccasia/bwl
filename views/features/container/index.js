/* eslint-disable prettier/prettier */
import ContainerItem from '../../component/ContainerItem';
import './style.scss';
const Container = () => {
  return (
    <div className="container-list">
      <ContainerItem className="container-item" />
      <ContainerItem className="container-item" />
      <ContainerItem className="container-item" />
      <ContainerItem className="container-item" />
    </div>
  );
};
export default Container;
