/* eslint-disable prettier/prettier */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { toast } from 'react-toastify';
import { useStore } from '../../store';
import './style.scss';
import { deletePost } from '../../api/apiPosts';
import UploadDialog  from "../UploadDialog";

const DelPost = (props) => {
  const { state, dispatch } = useStore();
  const handleDelete = async () => {
    if (state.author?.id) {
      deletePost({ id: props?.id, messageId: state.author?.id });
    }
    setOpen(false);
    toast.success('Đã xóa bài đăng thành công', {
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
  const [openEdit, setOpenEdit] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="button" onClick={handleClickOpen}>
        Delete
      </div>
      <div className="button" onClick={()=>setOpenEdit(true)}>
        Edit
      </div>
      <UploadDialog open={openEdit} setOpen={setOpenEdit} type="edit" link={props?.link} id={props?.id} source={props?.source}/>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <RemoveCircleOutlineIcon
            sx={{ color: '#f8bb86', fontSize: '85px' }}
          />
        </div>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="content">
              <h1>Xóa bài đăng?</h1>
              <p>Bạn có chắc muốn xóa bài đăng này không?</p>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Thoát</Button>
          <Button onClick={() => handleDelete(props.id)} autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default DelPost;
