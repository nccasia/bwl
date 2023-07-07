/* eslint-disable prettier/prettier */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { deleteComment } from '../../api/apiComment';
import { useStore } from '../../store';
import './style.scss';
import {showToast} from "../../util/showToast";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Delcomment = (props)  => {
  const { state, dispatch } = useStore();
  const [openDeleteComment, setOpenDeleteComment] = React.useState(false);
  const handleDelete = async () => {
    if (state.author?.id) {
      deleteComment({ id: props?.id, messageId: state.author?.id }).then(data=> {
        if(data){
          showToast("success", data?.message)
        }
      });
    }
    setOpenDeleteComment(false);
  };

  const handleClickOpen = () => {
    setOpenDeleteComment(true);
  };

  const handleClose = () => {
    setOpenDeleteComment(false);
  };

  return (
    <div>
      <div 
        onClick={handleClickOpen}
        style={{display: "flex", gap: "5px"}}
      >
        <DeleteForeverIcon sx={{fontSize: "16px"}}/>
        <p>Delete</p>
      </div>
      <Dialog
        open={openDeleteComment}
        onClose={handleClose}
      >
        <div 
          style={{
            backgroundColor: state.background ? '#242526' : 'white',
            color: '#6C7588',
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <RemoveCircleOutlineIcon sx={{ color: "#f8bb86", fontSize: "85px" }} />
          </div>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="content">
              <h1>Delete comment?</h1>
              <p>Are you sure you want to delete this comment?</p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} >Cancel</Button>
            <Button onClick={()=>handleDelete(props.id)}  >
              Delete
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
export default Delcomment;

