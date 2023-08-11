/* eslint-disable prettier/prettier */
import React from 'react';
import "./style.scss";
import UploadDialog  from "../UploadDialog";
import { useStore } from '../../store';

function UploadPost() {
    const {state, dispatch}=useStore();
    const [open, setOpen] = React.useState(false);

    return(
        <div 
            className="conatner-upload"
            style={{
                backgroundColor: state.background ? '#242526' : 'white',
                color: '#6C7588',
            }}
        >
            <div className="upload-box">
                {state.author?.id && (
                    <img
                        src={`https://cdn.discordapp.com/avatars/${state.author?.id}/${state.author?.avatar}`}
                        alt="avatar"
                    />
                )}
                <p 
                    style={{
                        backgroundColor: state.background ? '#242526' : ' ',
                        color: '#6C7588',
                    }}
                    onClick={()=>setOpen(true)}>Share your post......</p>
            </div>
            <UploadDialog open={open} setOpen={setOpen} type="add"/>
        </div>
    )
}

export default UploadPost;