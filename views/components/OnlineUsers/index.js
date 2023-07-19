/* eslint-disable prettier/prettier */
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import {getUsers, getSearchUsers} from "../../api/apiUser";

function OnlineUsers(props){
    const {state, dispatch}=useStore();
    React.useEffect(()=> {
        if(props?.type=== "onlineUsers" && state.pageUsers !== -1){
            getUsers(state.pageUsers, dispatch);
        } 
        if(props?.type=== "searchUsers" && state.pageUsers !== -1 && state.searchUsersPosts === ""){
            getSearchUsers(state.search, state.pageUsers, dispatch)
        } 
    },[state.search, state.pageUsers, props?.type]);

    return(
        <div 
            className="container-list-users"
        >
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
            {props?.type=== "onlineUsers" && (
                <div>
                    <p>{"Online:  "} {state.sizeUsers}</p>
                    {state.users ? state.users?.filter(item => item?.online === true).map(item =>{
                        return(
                            <div key={Number(item?.id)} className="list-user">                       
                                <div className="list-user-author">
                                    <img
                                        src={`https://cdn.discordapp.com/avatars/${item?.id}/${item?.avatar}`}
                                    />
                                    <p>{item?.username}</p>
                                </div>
                                <p style={{fontSize: "14px"}}>{item?.online ? "Action" : "Deaction"}</p> 
                            </div>
                        )
                    })
                    : null}
                    <p>{"Offline:  "} {state.lengthUsers - state.sizeUsers}</p>
                    {state.users ? state.users?.filter(item => item?.online === false).map(item =>{
                        return(
                            <div key={Number(item?.id)} className="list-user">                       
                                <div className="list-user-author">
                                    <img
                                        src={`https://cdn.discordapp.com/avatars/${item?.id}/${item?.avatar}`}
                                    />
                                    <p>{item?.username}</p>
                                </div>
                                <p style={{fontSize: "14px"}}>{item?.online ? "Action" : "Deaction"}</p> 
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