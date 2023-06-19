/* eslint-disable prettier/prettier */
import { toast } from 'react-toastify';

export const showToast = (type, message) => {
  toast(message, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type:type,
  });
};