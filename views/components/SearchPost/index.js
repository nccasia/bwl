/* eslint-disable prettier/prettier */
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import { getSearchPost, getSearchTimePost } from '../../api/apiPosts';
import { formatDay } from '../../util/formatDay';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function SearchPost(props) {
  const { state, dispatch } = useStore();

  React.useEffect(() => {
    if (props?.type === 'searchUsersPosts' && state.pageUsers !== -1) {
      getSearchPost(
        {
          messageId: state.searchUsersPosts,
          page: state.pageUsers,
          channelId: state.channel,
        },
        dispatch,
      );
    }
    if (props?.type === 'searchTimePosts' && state.pageUsers !== -1) {
      getSearchTimePost(
        {
          start: state.searchTime[0],
          end: state.searchTime[1],
          page: state.pageUsers,
          channelId: state.channel,
        },
        dispatch,
      );
    }
  }, [
    state.searchUsersPosts,
    state.pageUsers,
    state.searchTime,
    props?.type,
    state.channel,
  ]);

  const handleClickSearchMessage = (index) => {
    dispatch({ type: 'SET_SEARCH_MESSAGE', payload: index });
  };

  const handleClickChangeSearch = (index) => {
    if (state?.searchMessage !== index) {
      handleClickSearchMessage(index);
    } else {
      handleClickSearchMessage('');
      dispatch({ type: 'CHANGE_TAB_POST', payload: 'New' });
    }
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="container-list-posts"
      style={{
        backgroundColor: state.background ? '#242526' : '',
        color: 'rgb(108, 117, 136)',
      }}
    >
      <div className="box-list">
        {state.searchPosts
          ? state.searchPosts?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="list-post"
                  onClick={() => handleClickChangeSearch(item?.messageId)}
                >
                  <div className="list-post-author">
                    {state?.searchMessage !== item?.messageId ? (
                      <NavigateBeforeIcon
                        sx={{ color: '#6C7588' }}
                        className="list-icon"
                      />
                    ) : (
                      <NavigateNextIcon
                        sx={{ color: 'rgb(25, 118, 210)' }}
                        className="list-icon"
                      />
                    )}
                    <img
                      src={
                        item?.source
                        ? `${item?.links[0]}`
                        : `https://bwl.vn/${item?.links[0]}`
                      }
                    />
                  </div>
                  <p
                    style={{
                      color:
                        state?.searchMessage === item?.messageId
                          ? 'rgb(25, 118, 210'
                          : '#6C7588',
                    }}
                  >
                    {formatDay(
                      item?.createdTimestamp?.$numberDecimal ||
                        item?.createdTimestamp,
                    )}
                  </p>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
export default SearchPost;
