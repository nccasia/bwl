/* eslint-disable prettier/prettier */
import * as React from 'react';
import './style.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from '../../store';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ClearIcon from '@mui/icons-material/Clear';
import ContentRight  from "../ContentRight";

function ChannelHeader(props){

    const {state, dispatch}=useStore();
    const [openUsers, setOpenUsers] = React.useState(false);

    return(
        <div style={{ backgroundColor: state.background ? "rgb(36, 37, 38)": "white", borderRadius: "5px"}}>
            <div className="channel-header-container" style={{ backgroundColor: state.background ? "rgb(36, 37, 38)": "white"}}>
                {state.channelList ? state.channelList?.filter(item => item?.id === state.channel).map(item =>{
                    return(     
                        <div className="channel-header-item" key={item?.id}>
                            <h1>{item?.icon}</h1>
                            <div className="channel-header-name">
                                <h2>{item?.name}</h2>
                                <p>{item?.title}</p>
                            </div>
                        </div>
                    )
                }): null}
                <p 
                    className="res-onclick-channel"
                    onClick={()=>setOpenUsers(true)}
                >
                    <PersonSearchIcon sx={{fontSize: "25px", color: "#6C7588"}}/>
                </p>
            </div>
            {openUsers && (
                <div className="res-channel" style={{ backgroundColor: state.background ? "rgb(36, 37, 38)": "white"}}>
                  <div className="res-channel-header">
                    <PersonSearchIcon sx={{fontSize: "28px", color: "#6C7588"}}/>
                    <ClearIcon 
                      sx={{fontSize: "20px", color: "#6C7588"}}
                      onClick={()=>setOpenUsers(false)}
                    />
                  </div>
                  {props?.openReponsive && (<ContentRight />)}
                </div>
            )}
        </div>
    )
}

export default ChannelHeader;