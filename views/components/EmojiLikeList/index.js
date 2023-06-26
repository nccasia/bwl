/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import { Dialog, Tabs, Tab, Box} from '@mui/material';
import { useStore } from '../../store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import EmojiList  from "../EmojiList";

const EmojiLikeList = (props) => {
  const { state, dispatch } = useStore();
  
  const [page, setPage]= React.useState(1);
  const handleChange = (event, newValue) => {
    props.setOpen(newValue);
    setPage(1);
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
                      label={
                        <div className="button-emoji">
                          {main.id ? (
                            <img
                              className="emoji"
                              src={`https://cdn.discordapp.com/emojis/${main.id}.png`}
                              alt={main.name}
                            />
                          ) : (
                            <p className="emoji">{main?.emoji}</p>
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
          <EmojiList 
            page={page}
            setPage={setPage}
            messageId={props?.messageId}
            open={props?.open}
            setOpen={props?.setOpen}
          />
        </Box>  
      </div>
    </Dialog>
  );
};

export default EmojiLikeList;
