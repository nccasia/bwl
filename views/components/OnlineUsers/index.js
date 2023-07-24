/* eslint-disable prettier/prettier */
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import {getSearchUsers} from "../../api/apiUser";
import {getChannel} from "../../api/apiPosts";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function OnlineUsers(props){
    const {state, dispatch}=useStore();
    React.useEffect(()=> {
        if(props?.type=== "channelList"){
            getChannel(dispatch);
        } 
        if(props?.type=== "searchUsers" && state.pageUsers !== -1 && state.searchUsersPosts === ""){
            getSearchUsers(state.search, state.pageUsers, dispatch)
        } 
    },[state.search, state.pageUsers, props?.type]);

    const handleClickChangeChannel =(index)=>{
        dispatch({type: "SET_CHANNEL", payload: index})
    }

    //console.log(state?.channelList);

    return(
        <div className="container-list-users" style={{ backgroundColor: state.background ? "rgb(36, 37, 38)": "white"}}>
            {props?.type=== "searchUsers" && (
                <div>
                    <p>{"Searches: "} {state.lengthUsers}</p>
                    {state.users ? state.users?.map(item =>{
                        return(
                            <div key={Number(item?.id)} className="list-user">                       
                                <div className="list-user-author">
                                    <img
                                        src={`https://cdn.discordapp.com/avatars/${item?.id}/${item?.avatar}`}
                                    />
                                    <p>{item?.username}</p>
                                </div>
                                <p 
                                    style={{fontSize: "14px"}} 
                                    className="post-onclick-p"
                                    onClick={() => {
                                        if(item?.total){
                                            dispatch({type: "CHANGE_PAGE_USERS_POST", payload: item?.id});
                                        }
                                    }}
                                >
                                    {item?.total ? item?.total + " Posts" : " 0 Posts"}
                                </p>
                            </div>
                        )
                    })
                    : null}
                </div>
            )}
            {props?.type=== "channelList" && (
                <div>
                    <h1 className="list-channel-header">Channel</h1>
                    {state.channelList ? state.channelList?.map(item =>{
                        return(
                            <div key={Number(item?.id)} 
                                className="list-channel"
                                onClick={()=> {
                                    if(item?.id !== state.channel){
                                        handleClickChangeChannel(item?.id);
                                    }
                                }}
                            >                       
                                <div className="list-channel-icon">
                                    {item?.id === state.channel ? <NavigateNextIcon /> : <NavigateBeforeIcon/>}
                                    <p>{item?.icon}</p>
                                    <p>{item?.name}</p>
                                </div>
                                <p className="list-channel-total">{item?.total + " Posts"} </p>
                            </div>
                        )
                    })
                    : null}
                </div>
            )}
        </div>
    )
}
export default OnlineUsers;