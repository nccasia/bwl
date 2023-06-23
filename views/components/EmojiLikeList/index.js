/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import { Dialog, Tabs, Tab, Box} from '@mui/material';
import { getLikes } from '../../api/apiLike';
import { getReactions } from '../../api/apiReactions';
import { useStore } from '../../store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const EmojiLikeList = (props) => {
  const { state, dispatch } = useStore();
  const [like, setLike] = React.useState([]);
  const [listReactions, setListReactions] = React.useState([]);
  React.useEffect(() => {
    const runList = async () => {
      if (props.open !== '') {
        if (props.like && props.open === 'like-icon-x') {
          setLike(props.like);
        }
        if (props.listReactions && props.open !== 'like-icon-x') {
          setListReactions(props.listReactions);
        }
      }
    };
    runList();
  }, [props.open]);
  const handleChange = (event, newValue) => {
    props.setOpen(newValue);
  };
  const handleClickGetLike = async () => {
    await getLikes(props?.messageId).then((item) => {
      if (item?.likes) {
        setLike(item?.likes);
      }
    });
  };
  const handleClickGetReactions = async (index) => {
    await getReactions({
      messageId: props?.messageId,
      emoji: index.emoji,
    }).then((item) => {
      setListReactions(item?.reactions);
    });
  };

  return (
    <Dialog
      open={props.open !== '' ? true : false}
      onClose={() => props.setOpen('')}
    >
      <div style={{ backgroundColor: state.background ? "#242526": "white"}}>
        <h1 className="header-all">
          Tất cả
        </h1>
        <Box className="box-reaction">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={props.open}
            onChange={handleChange}
            className="tabs-reaction"
          >
            {props?.totalLike > 0 && (
              <Tab
                value="like-icon-x"
                onClick={handleClickGetLike}
                className="btn-reaction"
                label={
                  <div className="button-emoji">
                    <ThumbUpOffAltIcon
                      style={{ color: "#6C7588"}}
                      className="emoji"
                    />
                    {props?.totalLike}
                  </div>
                }
              />
            )}
            {props?.reactions
              ? props?.reactions?.map((main, index) => {
                  return (
                    <Tab
                      key={index}
                      value={main.emoji}
                      className="btn-reaction"
                      onClick={() =>
                        handleClickGetReactions({ emoji: main.emoji })
                      }
                      label={
                        <div className="button-emoji">
                          {main.id ? (
                            <img
                              className="emoji"
                              src={`https://cdn.discordapp.com/emojis/${main.id}.png`}
                              alt={main.name}
                            />
                          ) : (
                            <p className="emoji">{main?.name}</p>
                          )}
                          <p>{main.count}</p>
                        </div>
                      }
                    />
                  );
                })
              : null}
            <Tab value="" />
          </Tabs>
          <div className="list-reaction">
            {props.open !== 'like-icon-x' && listReactions && props.open
              ? listReactions?.map((main, index) => {
                  if (props.open === main?.emoji) {
                    return (
                      <div key={index} className="list-reaction-user">
                        <img
                          src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`}
                        />
                        <p>{main?.author[0]?.username}</p>
                      </div>
                    );
                  }
                })
              : null}
            {props.open === 'like-icon-x' && like
              ? like?.map((main, index) => {
                  return (
                    <div key={index} className="list-reaction-user">
                      <img
                        src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`}
                      />
                      <p>{main?.author[0]?.username}</p>
                    </div>
                  );
                })
              : null}
          </div>
        </Box>  
      </div>
    </Dialog>
  );
};

export default EmojiLikeList;
