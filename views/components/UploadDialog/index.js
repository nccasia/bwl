/* eslint-disable prettier/prettier */
import React from 'react';
import { Button, Input, InputLabel, Dialog, Tooltip } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { addPost, editPost } from '../../api/apiPosts';
import { useStore } from '../../store';
import './style.scss';
import axios from 'axios';
import { showToast } from '../../util/showToast';
import ClearIcon from '@mui/icons-material/Clear';
import { Buffer } from 'buffer';
function UploadDialog(props) {
  const { state, dispatch } = useStore();
  const [data, setData] = React.useState();
  const [image, setImage] = React.useState('');
  const [openImage, setOpenImage] = React.useState(false);
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setData(formData);
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setOpenImage(true);
  };
  const handlePaste = async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        try {
          await createImageBitmap(blob);
          const imageUrl = URL.createObjectURL(blob);
          setImage(imageUrl);
          setOpenImage(true);
          const formData = await convertImageUrlToFormData(imageUrl);
          setData(formData);
        } catch (error) {
          setOpenImage(false);
        }
      } else if (item.type === 'text/plain') {
        const base64Data = await new Promise((resolve) => item.getAsString(resolve));
        if (base64Data.startsWith('data:image/')) {
          const rawData = base64Data.split(',')[1];
          const byteArray = new Uint8Array(Buffer.from(rawData, 'base64'));
          const imageBlob = new Blob([byteArray], { type: base64Data.split(':')[1].split(';')[0] });
          try {
            await createImageBitmap(imageBlob);
            const imageUrl = URL.createObjectURL(imageBlob);
            setImage(imageUrl);
            setOpenImage(true);
            const formData = await convertImageUrlToFormData(imageUrl);
            setData(formData);
          } catch (error) {
            setOpenImage(false);
          }
        }
      }
    }
  };
  const handleChange = async (event) => {
    const img = event.target.value;
    setImage(img);
    if (checkURLStartsWithHTTP(img)) {
      const isValidURL = await isValidImageURL(img);
      if (isValidURL) {
        setOpenImage(true);
      }
    }
  };
  function checkURLStartsWithHTTP(urlString) {
    const pattern = /^(http|https):\/\//;
    return pattern.test(urlString);
  }

  const isValidImageURL = async (url) => {
    try {
      const response = await axios.head(url);
      const contentType = response.headers['content-type'];
      if (contentType && contentType.startsWith('image/')) {
        const formData = await convertImageUrlToFormData(url);
        setData(formData);
        return true;
      } else {
        setOpenImage(false);
        return false;
      }
    } catch (error) {
      setOpenImage(false);
      return false;
    }
  };

  const handleUpdate = async () => {
    if (data && state.author?.id) {
      if (props?.type === 'add') {
        await addPost({
          formData: data,
          id: state.author?.id,
          channelId: state.channel,
        }).then((data) => {
          if (data) {
            props?.setOpen(false);
          }
        });
      }
      if (props?.type === 'edit') {
        await editPost({
          formData: data,
          messageId: state.author?.id,
          id: props?.id,
        }).then((data) => {
          if (data) {
            props?.setOpen(false);
          }
        });
      }
    } else {
      showToast('warning', 'Not an image!');
    }
    setOpenImage(false);
    setImage('');
  };
  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    const foo = async () => {
      if (props?.type === 'edit') {
        const img = props?.source
          ? `https://bwl.vn/assets/images/${props?.link}`
          : `https://bwl.vn/images/${props?.link}`;
        setImage(img);
        if (checkURLStartsWithHTTP(img)) {
          const isValidURL = await isValidImageURL(img);
          if (isValidURL) {
            setOpenImage(true);
          }
        }
      }
      if (props?.type === 'add') {
        setImage('');
        setOpenImage(false);
      }
    };
    foo();
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [props?.type, props?.open]);

  const convertImageUrlToFormData = async (imageUrl) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', imageUrl, true);
      xhr.responseType = 'blob';

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const file = new File([blob], 'image.png', { type: blob.type });
          const formData = new FormData();
          formData.append('image', file);
          resolve(formData);
        } else {
          reject(new Error('Failed to load image'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      xhr.send();
    });
  };

  const handleDelete = () => {
    setOpenImage(false);
    setImage('');
  };

  const handleOpen = () => {
    props?.setOpen(false);
    setImage('');
    setOpenImage(false);
  };

  return (
    <Dialog
      onClose={handleOpen}
      open={state.onMenu ? false : props?.open}
      className="upload-dialog"
    >
      <div
        className="upload-dialog-box"
        style={{
          backgroundColor: state.background ? '#242526' : 'white',
          color: '#6C7588',
        }}
      >
        <div className="upload-dialog-div">
          <h1>{props?.type === 'add' ? 'New Post' : 'Edit Post'}</h1>
          <p onClick={handleOpen}>
            <HighlightOffIcon sx={{ fontSize: '25px' }} />
          </p>
        </div>
        <div className="upload-dialog-div">
          <div className="upload-dialog-div-user">
            {state.author?.id && (
              <img
                src={`${state.author?.avatar}`}
                alt="avatar"
              />
            )}
            <p>{state.author?.username}</p>
          </div>
          <InputLabel htmlFor="file-upload">
            <Input
              id="file-upload"
              type="file"
              inputProps={{
                style: { display: 'none', margin: 0 },
                accept: 'image/*',
                onChange: handleUpload,
              }}
            />
            <Tooltip title="Upload image">
              <Button component="span" sx={{ minWidth: "20px" }}>
                <PhotoCameraIcon sx={{ fontSize: '20px' }} />
              </Button>
            </Tooltip>
          </InputLabel>
        </div>
        {!openImage && (
          <textarea
            type="text"
            placeholder="Paste image or provide link..."
            value={image}
            onChange={handleChange}
            autoFocus
            className="upload-input"
            style={{
              backgroundColor: state.background ? '#242526' : 'white',
              color: '#6C7588',
            }}
          />
        )}
        <div className="upload-div-image">
          {image && openImage && (
            <div
              onClick={handleDelete}
              className="upload-delete-image"
              style={{
                backgroundColor: state.background ? '#242526' : 'white',
                color: '#6C7588',
              }}
            >
              {!openImage && (
                <textarea
                  type="text"
                  placeholder="Paste image or provide link..."
                  value={image}
                  onChange={handleChange}
                  autoFocus
                  className="upload-input"
                  style={{
                    backgroundColor: state.background ? '#242526' : 'white',
                    color: '#6C7588',
                  }}
                />
              )}
              {image && openImage && (
                <div
                  className={
                    state.background
                      ? 'upload-div-image-dark'
                      : 'upload-div-image-light'
                  }
                >
                  <div
                    onClick={handleDelete}
                    className="upload-delete-image"
                    style={{
                      backgroundColor: state.background ? '#242526' : 'white',
                      color: '#6C7588',
                    }}
                  >
                    <ClearIcon />
                  </div>
                  <img src={image} alt="Preview" className="upload-image" />
                </div>
              )}
              <button
                onClick={handleUpdate}
                className="upload-button"
                style={
                  image && openImage
                    ? { backgroundColor: '#00bbff', color: '#f8f8f8' }
                    : {
                      backgroundColor: state.background
                        ? '#0000000a'
                        : 'white',
                      color: 'rgb(108, 117, 136)',
                    }
                }
              >
                {props?.type === 'add' ? 'Create' : 'Update'}
              </button>
            </div>
          )}
          {image && openImage && (
            <div className="upload-image">
              <img src={image} alt="Preview" className="images" />
            </div>
          )}
        </div>
        <button
          onClick={handleUpdate}
          className="upload-button"
          style={
            image && openImage
              ? { backgroundColor: '#00bbff', color: '#f8f8f8' }
              : {
                backgroundColor: state.background ? '#0000000a' : 'white',
                color: 'rgb(108, 117, 136)',
              }
          }
        >
          {props?.type === 'add' ? 'Create' : 'Update'}
        </button>
      </div>
    </Dialog>
  );
}

export default UploadDialog;

