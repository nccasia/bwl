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
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { getTime, format } from 'date-fns';
import { showToast } from '../../util/showToast';

function InputPost() {
  const { state, dispatch } = useStore();
  const [text, setText] = React.useState('');
  const [dateRange, setDateRange] = React.useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [openPicker, setOpenPicker] = React.useState(false);

  React.useEffect(() => {
    if (state.search !== '') {
      setText(state.search);
    }
    if (state.searchTime?.length === 2) {
      setText(
        String(format(state.searchTime[0], 'dd/MM/yyyy')) +
          ' ~ ' +
          String(format(state.searchTime[1], 'dd/MM/yyyy')),
      );
    }
  }, [state.search, state.searchTime]);

  const handleClickSearch = () => {
    if (text.trim() !== '') {
      if (
        dateRange[0] &&
        dateRange[1] &&
        text ===
          String(format(dateRange[0], 'dd/MM/yyyy')) +
            ' ~ ' +
            String(format(dateRange[1], 'dd/MM/yyyy'))
      ) {
        if (
          state.searchTime?.length === 2 &&
          text.trim() ===
            String(format(state.searchTime[0], 'dd/MM/yyyy')) +
              ' ~ ' +
              String(format(state.searchTime[1], 'dd/MM/yyyy'))
        ) {
          //showToast("warning", "Khi bạn làm việc với máy tính, sự trùng nhau không bao giờ là lỗi, đó là tính năng!")
        } else {
          dispatch({
            type: 'SET_SEARCH_TIME',
            payload: [getTime(dateRange[0]), getTime(dateRange[1])],
          });
        }
      } else {
        if (text.trim() === state.search) {
          //showToast("warning", "Khi bạn làm việc với máy tính, sự trùng nhau không bao giờ là lỗi, đó là tính năng!")
        } else {
          dispatch({ type: 'SET_SEARCH', payload: text });
        }
      }
    }
    setOpenPicker(false);
  };

  const handleChangeSearch = (index) => {
    setText(index);
    if (index === '') {
      dispatch({ type: 'RESET_SEARCH', payload: '' });
      setDateRange([]);
      dispatch({ type: 'CHANGE_PAGE_USERS_POST', payload: '' });
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
          placeholder="Search by name or date..."
          className="date-picker"
          sx={{
            backgroundColor: state.background ? 'rgb(36, 37, 38)' : 'white',
          }}
          value={text}
          onChange={(e) => handleChangeSearch(e?.target?.value)}
          autoFocus
          onKeyUp={handleKeyPress}
          InputProps={{
            startAdornment: (
              <span className="icon-date-picker">
                {openPicker ? (
                  <EventBusyIcon
                    onClick={() => setOpenPicker(false)}
                    className="icon"
                  />
                ) : (
                  <EventIcon
                    onClick={() => setOpenPicker(true)}
                    className="icon"
                  />
                )}
              </span>
            ),
            endAdornment: (
              <span className="icon-date-picker">
                {text && (
                  <ClearIcon
                    onClick={() => {
                      setOpenPicker(false);
                      handleChangeSearch('');
                    }}
                    sx={{
                      color: '#6C7588',
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
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
      </div>
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
            showYearDropdown
            dropdownMode="select"
            inline
          />
        </div>
      )}
    </div>
  );
}
export default InputPost;
