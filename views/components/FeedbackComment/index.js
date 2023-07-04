/* eslint-disable prettier/prettier */
import './style.scss';
import React from 'react';
import  CommentItem from "../CommentItem";
import {getCommentItem } from "../../api/apiComment"
import { useStore } from '../../store';
import {updateSize} from "../../util/updateSize";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function FeedbackComment(props){

    const { state, dispatch } = useStore();
    const [open, setOpen] = React.useState(false);
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

    return (
        <div>
            {props?.length > 0 && (
                <div>
                    <p 
                        className="header-text"
                        onClick={handleClickNumber}
                    >
                        <KeyboardArrowDownIcon sx={{fontSize: "14px"}}/>
                        {props?.length + " Reply"} 
                    </p>
                    <div className="comment-feedback-div">
                        {open && props?.item ? props?.item.map((main, index) => (
                            <div className="comment-feedback" key={index}>
                                <CommentItem {...main} type="false"/>
                            </div>
                        )): null}
                        { open && numberComment > page && <p className="show-page-comment" onClick={() => handleClickPage(page)}>Xem thêm</p>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FeedbackComment;