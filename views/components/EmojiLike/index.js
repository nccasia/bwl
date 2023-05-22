import './style.scss';
import React from 'react';
import {getLikes} from "../../api/apiLike";
import {getReactions} from "../../api/apiReactions";
import Tooltip from '@mui/material/Tooltip';
import EmojiLikeList from "../EmojiLikeList";

const EmojiLike = (props) => {
  const [like, setLike] = React.useState([]);
  const [openLike, setOpenLike] = React.useState(false);
  const [reactions, setReactions] = React.useState([]);
  const [openReactions, setOpenReactions] = React.useState("");
  const [reactions1, setReactions1] = React.useState([]);

  const handleClickGetLike = async () => {
    await getLikes(props?.messageId).then((item) => {
      if(item?.likes){
        setLike(item?.likes);
      }
    });
    setOpenLike(true);
    setOpenReactions(false);
  };
  const handleClickGetReactions = async (index) => {
    await getReactions({messageId: props?.messageId, emoji: index.emoji}).then((item) => {
      setReactions({list: item?.reactions, index: index});
    });
    setOpenReactions(index.emoji);
    setOpenLike(false);
  };
  const changeReactions = (index) => {
    if (index) {
      let list = [];
      index?.list?.forEach((item) => {
        list.push(item?.author[0]?.username);
      });
      return { list, main: index.index };
    }
  };
  const changeLike = (index) => {
    if (index) {
      let list = [];
      index?.forEach((item) => {
        list.push(item?.author[0]?.username);
      });
      return list;
    }
  };

  const [openList, setOpenList] = React.useState("");

  return (
    <ul className="container-item-reactTotal">
      <EmojiLikeList 
        open={openList} 
        setOpen={setOpenList}
        like={like}
        listReactions={reactions?.list}
        {...props}
      />
      {props?.reactions?.map((main, index) => {
        return (
          <Tooltip 
            arrow
            placement="top"
            open={openReactions === main.emoji ? true : false}
            onOpen={() => handleClickGetReactions(main)} 
            onClose={() => setOpenReactions("")}
            key={index}
            title={
              <div 
                className="dialog-like-list"
                onClick={() => setOpenList(main.emoji)}
              >
                {changeReactions(reactions)?.main?.id ? (
                  <img
                    className="reactions-emoji"
                    src={`https://cdn.discordapp.com/emojis/${
                      changeReactions(reactions)?.main?.id
                    }.png`}
                    alt={changeReactions(reactions)?.main?.name}
                  />
                ) : (
                  <p className="reactions-emoji">
                    {changeReactions(reactions)?.main?.name}
                  </p>
                )}
                <p>
                  <b>{changeReactions(reactions)?.main?.name}:</b>
                  {' đã được tương tác bởi: '}
                  {changeReactions(reactions)?.list?.length < 4 ? (
                    changeReactions(reactions)?.list?.join(', ')
                  ) : (
                    <span>
                      {changeReactions(reactions)?.list?.slice(0, 3).join(', ')}
                      {' và '}
                      <u>
                        {changeReactions(reactions)?.list?.length - 3}
                        {' người khác'}
                      </u>
                    </span>
                  )}
                </p>
              </div>
            }
          >
            <li className="list-inline-item list-reaction">
              <button className="btn-reaction">
                {main.id ? (
                  <img
                    className="emoji"
                    src={`https://cdn.discordapp.com/emojis/${main.id}.png`}
                    alt={main.name}
                  />
                ) : (
                  <p>{main?.name}</p>
                )}
                {main.count}
              </button>
            </li>
          </Tooltip>
        );
      })}
      {props?.totalLike > 0 ? (
          <Tooltip 
            arrow
            placement="top"
            open={openLike}
            onOpen={handleClickGetLike} 
            onClose={() => setOpenLike(false)}
            title={
              <div 
                className="dialog-like-list"
                onClick={() => setOpenList("like-icon-x")}
              >
                <img
                  src="./assets/img/default-react.png"
                  alt="icon-like"
                  className="icon-like"
                />
                <p>
                  <b>Like:</b>
                  {' đã được tương tác bởi: '}
                  {like && changeLike(like)?.length < 4 ? (
                    changeLike(like).join(', ')
                  ) : (
                    <span>
                      {changeLike(like)?.slice(0, 3).join(', ')}
                      {' và '}
                      <u>
                        <button>
                          {changeLike(like).length - 3}
                          {' người khác'}
                        </button>
                      </u>
                    </span>
                  )}
                </p>
              </div>
            }
          >
            <li className="list-inline-item list-reaction ">
              <button className="btn-reaction">
                <img
                  className="emoji"
                  src="./assets/img/default-react.png"
                  alt="icon"
                />
                {props?.totalLike}
              </button>
            </li>
          </Tooltip>
      ) : null}
    </ul>
  );
};
export default EmojiLike;
