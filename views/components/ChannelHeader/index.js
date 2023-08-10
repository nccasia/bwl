/* eslint-disable prettier/prettier */
import * as React from 'react';
import './style.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from '../../store';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ClearIcon from '@mui/icons-material/Clear';
import ContentRight from '../ContentRight';
import { useRef } from 'react';
import { getChannel } from '../../api/apiPosts';

function ChannelHeader(props) {
  const { state, dispatch } = useStore();
  const [openUsers, setOpenUsers] = React.useState(false);
  const inputRef = useRef(null);

  React.useEffect(() => {
    if (state.channelList?.length === 0 && props?.innerWidth <= 986) {
      getChannel(dispatch);
    }
  }, [state.channelList, props?.innerWidth]);

  const handlehinebox = () => {
    inputRef.current.classList.add('icon_clear');
    setTimeout(() => {
      setOpenUsers(false);
    }, 190);
  };
  return (
    <div
      style={{
        backgroundColor: state.background ? 'rgb(36, 37, 38)' : 'white',
        borderRadius: '5px',
      }}
    >
      <div
        className="channel-header-container"
        style={{
          backgroundColor: state.background ? 'rgb(36, 37, 38)' : 'white',
        }}
      >
        {state.channelList
          ? state.channelList
              ?.filter((item) => item?.id === state.channel)
              .map((item) => {
                return (
                  <div className="channel-header-item" key={item?.id}>
                    {/* <h1>{item?.icon}</h1> */}
                    <div className="channel-header-name">
                      <h2>Welcome to {item?.name}</h2>
                      <p>{item?.title}</p>
                    </div>
                  </div>
                );
              })
          : null}
        <p className="res-onclick-channel" onClick={() => setOpenUsers(true)}>
          <PersonSearchIcon sx={{ fontSize: '25px', color: '#6C7588' }} />
        </p>
      </div>
      {openUsers && (
        <div
          ref={inputRef}
          className="res-channel"
          style={{
            backgroundColor: state.background ? 'rgb(36, 37, 38)' : 'white',
          }}
        >
          <div className="res-channel-header">
            <PersonSearchIcon sx={{ fontSize: '28px', color: '#6C7588' }} />
            <ClearIcon
              sx={{ fontSize: '20px', color: '#6C7588', cursor: 'pointer' }}
              onClick={() => handlehinebox()}
            />
          </div>
          {props?.innerWidth <= 986 && <ContentRight />}
        </div>
      )}
    </div>
  );
}

export default ChannelHeader;
