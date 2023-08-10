/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import  CommentItem from "../CommentItem";
import {getCommentItem } from "../../api/apiComment"
import { useStore } from '../../store';
import {updateSize} from "../../util/updateSize";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CircularProgress from '@mui/material/CircularProgress';
import {changeNumber} from "../../util/changeNumber";

function FeedbackComment(props){

    const { state, dispatch } = useStore();
    const [open, setOpen] =React.useState(false);
    React.useEffect(()=>{
        if(open && props?.id){
            getCommentItem(state.author?.id, props?.id, 1, 5,  dispatch, props?.messageId, true);
        }
    }, [open, props?.id]);

    const [page, setPage] = React.useState(0);
    const [size, setSize] = React.useState(0);
    React.useEffect(()=>{
      if(props?.size){
        setSize(props?.size);
      }
      if(props.page){
        setPage(props.page);
      }
    },[props?.size, props.page]); 
    const numberComment= Math.ceil(size / 5);
    const handleClickPage = async(index) => {
        const test = updateSize(props?.item?.length);
        if(numberComment > index){
            getCommentItem(state.author?.id, props?.id, test?.page, test?.size, dispatch, props?.messageId, false);
            setPage(test?.page);
            setSize(test?.size);
        }
    }  
    const handleClickNumber =()=>{
        setOpen(!open);
        setPage(1);
    }
    const [renderComment, setRenderComment] = React.useState(false);
    React.useEffect(() => {
        if (open) {
          setRenderComment(true);
        } else {
          setTimeout(() => {
            setRenderComment(false);
          }, 700);
        }
    }, [open]);

    return (
        <div>
            {props?.length > 0 && (
                <div className="feedback-comment-container">
                    <p 
                        className="header-text"
                        onClick={handleClickNumber}
                    >
                        <div>{open ? <KeyboardArrowUpIcon sx={{fontSize: "14px"}}/> : <KeyboardArrowDownIcon sx={{fontSize: "14px"}}/>}</div>
                        {changeNumber(props?.length) + " Reply"} 
                    </p>
                    <div className={`comment-feedback-div ${open ? 'open-feedback' : 'closed-feedback'}`} >
                        {renderComment && props?.item ? 
                            props?.item.map((main) => (
                                <div className="comment-feedback" key={main?._id}>
                                    <CommentItem {...main} type="false" authorMessage={props?.authorMessage}/>
                                </div>
                            )
                        ): null}
                        {renderComment && props?.loading && (
                            <div className="comment-item-progress">
                                <CircularProgress sx={{color: "rgb(108, 117, 136)"}}/>
                            </div>
                        )}
                        { renderComment && numberComment > page && <p className="show-page-comment" onClick={() => handleClickPage(page)}>See More</p>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FeedbackComment;