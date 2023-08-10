/* eslint-disable prettier/prettier */
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import OnlineUsers  from "../OnlineUsers";
import InputPost  from "../InputPost";
import {useDataDebouncer} from '../../util/useDebounce';
import CircularProgress from '@mui/material/CircularProgress';
import SearchPost  from "../SearchPost";
import ClearIcon from '@mui/icons-material/Clear';

function ContentRight(){
    const {state, dispatch}=useStore();
    const spanRef = React.useRef(null);
    React.useEffect(() => {
        const scrollElement = spanRef.current;
        const handleScroll = () => {
            if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight -5) {
                if(!state.loadingUsers && state.pageUsers !== -1 && state.lengthUsers > 10){
                    useDataDebouncer(dispatch({type: "CHANGE_PAGE_USERS", payload: {page: state.pageUsers + 1, length: state.lengthUsers} }), 500);
                }
            }
        };
        scrollElement.addEventListener('scroll', handleScroll);
    }, [state.loadingUsers, state.pageUsers, state.lengthUsers]);
    
    return(
        <div className="content-right-container" style={{ backgroundColor: state.background ? "rgb(36, 37, 38)": "white"}}>
            <InputPost/>
            <div className="content-right-header">
                {state.search === ""  && state.searchTime?.length !==2 && state.searchUsersPosts === "" && <h1>Channel</h1>}
                {state.search !== "" && state.searchUsersPosts === "" && state.searchTime?.length !==2 && (
                    <h1>
                        {"Searches: "} 
                        {state.loadingUsers ? 
                            <CircularProgress sx={{color: "rgb(108, 117, 136)", fontSize: "12px"}} size={15}/>
                            : state.lengthUsers
                        }
                    </h1>
                )}
                {state.searchUsersPosts !== "" && state.search !== "" && state.searchTime?.length !==2 && (
                    <div className="list-post-header"
                        style={{
                            backgroundColor: state.background ? '#242526' : 'white',
                            color: 'rgb(108, 117, 136)',
                        }}
                    >
                        <p>
                            {"Posts: "}
                            {state.loadingUsers ? 
                                <CircularProgress sx={{color: "rgb(108, 117, 136)", fontSize: "12px"}} size={15}/>
                                : state.lengthUsers
                            }
                        </p>
                        {state.searchTime?.length !== 2 &&(
                            <ClearIcon
                                sx={{fontSize: "20px", cursor: "pointer"}}
                                onClick={()=> {
                                    dispatch({type: "SET_SEARCH_MESSAGE", payload: ""});
                                    dispatch({type: "CHANGE_PAGE_USERS_POST", payload: ""});
                                }}
                            />
                        )}
                    </div>
                )}
                {state.searchTime?.length ===2 && state.search === "" && 
                    <h1>
                        {"Posts: "}
                        {state.loadingUsers ? 
                            <CircularProgress sx={{color: "rgb(108, 117, 136)"}} size={15}/>
                            : state.lengthUsers
                        }
                    </h1>
                }
            </div>
            <div 
                ref={spanRef}
                className="content-right-scroll"
                style={{ backgroundColor: state.background ? "rgb(36, 37, 38)": "white"}}
            >
                {state.search === ""  && state.searchTime?.length !==2 && state.searchUsersPosts === "" && <OnlineUsers type="channelList"/>}
                {state.search !== "" && state.searchUsersPosts === "" && state.searchTime?.length !==2 && <OnlineUsers type="searchUsers"/>}
                {state.searchUsersPosts !== "" && state.search !== "" && state.searchTime?.length !==2 && <SearchPost type="searchUsersPosts"/>}
                {state.searchTime?.length ===2 && state.search === "" && <SearchPost type="searchTimePosts"/>}
                {state.loadingUsers && (
                    <div className="content-right-progress">
                        <CircularProgress sx={{color: "rgb(108, 117, 136)"}}/>
                    </div>
                )}
            </div>
        </div>
    )
}
export default ContentRight;