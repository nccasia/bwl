/* eslint-disable prettier/prettier */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { toast } from 'react-toastify';
import { deleteComment } from '../../api/apiComment';
import { useStore } from '../../store';
import './style.scss';

const Delcomment = (props)  => {
    const { state, dispatch } = useStore();
    const handleDelete = async (id) => {
      if (state.author?.id) {
        deleteComment({ id: props?.id, messageId: state.author?.id });
      }
      setOpen(false)
      toast.success('Đã xóa bình luận thành công', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div  onClick={handleClickOpen}>
        Delete
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
            <Button onClick={()=>handleDelete(props.id)}  autoFocus>
              Delete
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
export default Delcomment;

