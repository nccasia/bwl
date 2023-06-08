import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
        Xóa
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="content">
            <h1>Xóa comment?</h1>
            <p>Bạn có chắc muốn xóa comment này không?</p>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} >Thoát</Button>
          <Button onClick={()=>handleDelete(props.id)}  autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default Delcomment;

