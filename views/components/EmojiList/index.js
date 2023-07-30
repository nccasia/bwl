/* eslint-disable prettier/prettier */
import React from 'react';
import "./style.scss";
import { getReactions } from '../../api/apiReactions';
import { getLikes } from '../../api/apiLike';

function EmojiList(props) {

    const [listReactions, setListReactions] = React.useState([])
    const [like, setLike] = React.useState([]);
    const [numberTotal, setNumberTotal] = React.useState(0);
    React.useEffect(()=> {
        const runList = async()=>{
            if (props.open !== '' && props?.page===1) {
                if (props.open !== 'like-icon-x') {
                    await getReactions({
                        messageId: props?.messageId,
                        emoji: props.open,
                        size: true,
                        page: 1,
                    }).then((item) => {
                        setListReactions(item?.reactions);
                        setNumberTotal(Math.ceil(item?.total / 5))
                    });
                }
                if (props.open === 'like-icon-x') {
                    await getLikes({
                        messageId:props?.messageId,
                        size: true,
                        page: 1,
                      }).then((item) => {
                        if (item?.likes) {
                          setLike(item?.likes);
                          setNumberTotal(Math.ceil(item?.total / 5))
                        }
                    });
                }
            }
        }
        runList();
    },[props.open]);

    const handleClickPage = async(index) => {
        if(numberTotal > index && props.open !== ''){
            if (props?.page && props.open !== 'like-icon-x') {
                getReactions({
                    messageId: props?.messageId,
                    emoji: props.open,
                    size: true,
                    page: index+1,
                }).then((data) =>{
                    if (data?.reactions) {
                        setListReactions([...listReactions, ...data?.reactions]);
                    }
                });
            }
            if (props?.page && props.open === 'like-icon-x') {
                await getLikes({
                    messageId:props?.messageId,
                    size: true,
                    page: index+ 1,
                  }).then((item) => {
                    if (item?.likes) {
                        setLike([...like, ...item?.likes]);
                    }
                });
            }
            props.setPage(index+1);
        }
    }  

    return (
        <div className="list-reaction-like">
            {props.open !== 'like-icon-x' && listReactions && props.open
                ? listReactions?.map((main, index) => {
                    if (props.open === main?.emoji) {
                    return (
                        <div key={index} className="list-reaction-user">
                        {main?.author[0]?.id ? (
                            <img
                            className="list-notifi-image"
                            src={`https://cdn.discordapp.com/avatars/${main?.author[0]?.id}/${main?.author[0]?.avatar}`}
                            alt="avatar"
                            />
                        ): (
                            <img
                            src="./assets/img/person.png"
                            className="img-people-avatar"
                            alt="avatar"
                            />
                        )}
                        {main?.author[0]?.username ? main?.author[0]?.username : "The Lost"}
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
            {numberTotal > props?.page && (
                <p 
                    className="add-list"
                    onClick={() => handleClickPage(props?.page)}
                >
                    See More
                </p>
            )}
        </div>
    );
}
export default EmojiList;
