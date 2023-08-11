/* eslint-disable prettier/prettier */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useStore } from '../../store';
import './style.scss';
import { deletePost } from '../../api/apiPosts';
import UploadDialog from '../UploadDialog';
import { showToast } from '../../util/showToast';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const DelPost = (props) => {
  const { state, dispatch } = useStore();
  const handleDelete = async () => {
    if (state.author?.id) {
      deletePost({ id: props?.id, messageId: state.author?.id });
    }
    setOpen(false);
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
      {!open && !openEdit && (
        <div
          className="button-dialog"
          style={{
            backgroundColor: state.background ? '#242526' : 'white',
            color: '#6C7588',
          }}
        >
          <div className="button" onClick={() => setOpenEdit(true)}>
            <EditIcon sx={{ fontSize: '16px' }} />
            <p>Edit</p>
          </div>
          <div className="button" onClick={handleClickOpen}>
            <DeleteForeverIcon sx={{ fontSize: '16px' }} />
            <p>Delete</p>
          </div>
        </div>
      )}
      <UploadDialog
        open={openEdit}
        setOpen={setOpenEdit}
        type="edit"
        link={props?.link}
        id={props?.id}
        source={props?.source}
      />
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
                <h1>Delete post?</h1>
                <p>Are you sure you want to delete this post?</p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => handleDelete(props.id)} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};
export default DelPost;
