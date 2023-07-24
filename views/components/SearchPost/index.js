/* eslint-disable prettier/prettier */
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import {getSearchPost, getSearchTimePost} from "../../api/apiPosts";
import { formatDay } from '../../util/formatDay';
import ClearIcon from '@mui/icons-material/Clear';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function SearchPost(props){
    const {state, dispatch}=useStore();

    React.useEffect(()=> {
        if(props?.type==="searchUsersPosts" && state.pageUsers !== -1){
            getSearchPost({messageId: state.searchUsersPosts, page: state.pageUsers}, dispatch);
        }
        if(props?.type==="searchTimePosts" && state.pageUsers !== -1){
            getSearchTimePost(
                {
                    start: state.searchTime[0], 
                    end: state.searchTime[1], 
                    page: state.pageUsers
                }, 
                dispatch
            )
        }
    },[state.searchUsersPosts, state.pageUsers, state.searchTime, props?.type]);

    const handleClickSearchMessage =(index)=>{
        dispatch({type: "SET_SEARCH_MESSAGE", payload: index});
    }

    return(
        <div className="container-list-posts"
            style={{
                    backgroundColor: state.background ? '#242526' : '',
                    color: 'rgb(108, 117, 136)',
                    }}>
            <div className="list-post-header"
                style={{
                    backgroundColor: state.background ? '#242526' : '',
                    color: 'rgb(108, 117, 136)',
                    }}>
                <p>{state.lengthUsers} Posts</p>
                {state.searchTime?.length !== 2 &&(
                    <ClearIcon
                        sx={{fontSize: "20px", cursor: "pointer"}}
                        onClick={()=> {
                            handleClickSearchMessage("");
                            dispatch({type: "CHANGE_PAGE_USERS_POST", payload: ""});
                        }}
                    />
                )}
            </div>
            <div className="box-list">
                {state.searchPosts ? state.searchPosts?.map((item, index) =>{
                    return(
                        <div key={index} className="list-post">
                            <div className="list-post-author">
                                {state?.searchMessage !== item?.messageId ? (
                                    <NavigateBeforeIcon 
                                        className="list-icon"
                                        onClick={()=> handleClickSearchMessage(item?.messageId)}
                                    />
                                ): (
                                    <NavigateNextIcon
                                        className="list-icon"
                                        onClick={()=> {
                                            handleClickSearchMessage("");
                                            dispatch({type: "CHANGE_TAB_POST", payload: "New"});
                                        }}
                                    />
                                )}
                                <img src={item?.source ? `https://bwl.vn/assets/images/${item?.links[0]}` : `https://bwl.vn/images/${item?.links[0]}`} />
                            </div>
                            <p>{formatDay(item?.createdTimestamp?.$numberDecimal || item?.createdTimestamp)}</p>
                        </div>
                    )
                })
                : null}
            </div>
        </div>
    )
}
export default SearchPost;