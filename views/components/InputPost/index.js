/* eslint-disable prettier/prettier */
import './style.scss';
import { useStore } from '../../store';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextField from '@mui/material/TextField';
import EventIcon from '@mui/icons-material/Event';
import ClearIcon from '@mui/icons-material/Clear';
import { getTime, format } from 'date-fns';
import { showToast } from '../../util/showToast';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function InputPost() {
  const { state, dispatch } = useStore();
  const [text, setText] = React.useState('');
  const [dateRange, setDateRange] = React.useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [openPicker, setOpenPicker] = React.useState(false);

  const handleClickSearch = () => {
    if (text !== '') {
      if (
        dateRange[0] &&
        dateRange[1] &&
        text ===
          String(format(dateRange[0], 'dd/MM/yyyy')) +
            ' ~ ' +
            String(format(dateRange[1], 'dd/MM/yyyy'))
      ) {
        dispatch({
          type: 'SET_SEARCH_TIME',
          payload: [getTime(dateRange[0]), getTime(dateRange[1])],
        });
      } else {
        dispatch({ type: 'SET_SEARCH', payload: text });
      }
    }
    setOpenPicker(false);
  };

  const handleChangeSearch = (index) => {
    setText(index);
    if (index === '') {
      dispatch({ type: 'RESET_SEARCH', payload: '' });
      setDateRange([]);
    }
  };
  const handleChangeTime = (date) => {
    setDateRange(date);
    if (date[0]) {
      setText(format(date[0], 'dd/MM/yyyy') + ' ~ ');
    }
    if (date[0] && date[1]) {
      setText(
        String(format(date[0], 'dd/MM/yyyy')) +
          ' ~ ' +
          String(format(date[1], 'dd/MM/yyyy')),
      );
    }
  };

  const handleInputClick = () => {
    if (openPicker) {
      setOpenPicker(false);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClickSearch();
    }
  };
  return (
    <div
      className="container-input-posts"
      style={{
        backgroundColor: state.background ? 'rgb(36, 37, 38)' : 'white',
      }}
    >
      <div className="search-input">
        <TextField
          placeholder="Search name..."
          className="date-picker"
          sx={{
            backgroundColor: state.background ? 'rgb(36, 37, 38)' : 'white',
          }}
          value={text}
          onChange={(e) => handleChangeSearch(e?.target?.value)}
          autoFocus
          onKeyPress={handleKeyPress}
          onClick={handleInputClick}
          InputProps={{
            endAdornment: (
              <span className="icon-date-picker">
                {openPicker ? (
                  <ClearIcon
                    onClick={() => setOpenPicker(false)}
                    sx={{ color: '#6C7588', fontSize: '20px' }}
                  />
                ) : (
                  <EventIcon
                    onClick={() => setOpenPicker(true)}
                    sx={{ color: '#6C7588', fontSize: '18px' }}
                  />
                )}
              </span>
            ),
          }}
        />
        <button
          className="search-button"
          style={{
            backgroundColor: state.background ? 'rgb(36, 37, 38)' : 'white',
          }}
          onClick={handleClickSearch}
        >
          <SearchIcon sx={{ color: '#6C7588', fontSize: '18px' }} />
        </button>
        {openPicker && (
          <div
            className={
              state.background
                ? 'date-range-picker-dark'
                : 'date-range-picker-light'
            }
          >
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => handleChangeTime(update)}
              isClearable={true}
              inline
            />
            ) : (
            <EventIcon
              onClick={() => setOpenPicker(true)}
              sx={{ color: '#6C7588', fontSize: '18px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default InputPost;
