/* eslint-disable prettier/prettier */
import * as React from 'react';
import Container from '../Container';
import './style.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from '../../store';
import { useDataDebouncer } from '../../util/useDebounce';
import CircularProgress from '@mui/material/CircularProgress';
import UploadPost from '../UploadPost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ContentRight from '../ContentRight';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ClearIcon from '@mui/icons-material/Clear';

const MainContent = () => {
  const { state, dispatch } = useStore();
  const [scroll, setScroll] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const [openReponsive, setOpenReponsive] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 100) {
        setScroll(true);
      } else if (window.scrollY < 100) {
        setScroll(false);
      }
    };
    if (window.scrollY >= 100) {
      setScroll(true);
    }

    if (window.innerWidth <= 1240) {
      setOpenReponsive(true);
    } else {
      setOpenReponsive(false);
    }

    window.addEventListener('scroll', () => {
      handleScroll();
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        if (!state.loadingPost && state.page !== -1) {
          useDataDebouncer(
            dispatch({ type: 'CHANGE_PAGE', payload: { page: state.page } }),
            500,
          );
        }
      }
    });
  }, [state.page, state.loadingPost, window.innerWidth]);

  React.useEffect(() => {
    if (state?.searchMessage !== '') {
      setValue('3');
      dispatch({ type: 'CHANGE_TAB_POST', payload: 'Search' });
    }
    if (state?.searchMessage === '' && value === '3') {
      setValue('1');
    }
  }, [state?.searchMessage]);

  const handleScrollUpClick = () => {
    const step = Math.max(window.scrollY / 50, 20);
    const animation = () => {
      if (window.scrollY > 0) {
        window.scrollTo(0, window.scrollY - step);
        requestAnimationFrame(animation);
      } else {
        setScrollY(0);
      }
    };
    requestAnimationFrame(animation);
  };

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [openUsers, setOpenUsers] = React.useState(false);

  return (
    <div style={{ backgroundColor: state.background ? 'black' : '#f5f5f500' }}>
      <div className="main-container">
        <div
          className="main-content"
          style={{
            opacity: state.onMenu ? 0.5 : 1,
            pointerEvents: state.onMenu ? 'none' : 'auto',
          }}
        >
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
              }}
              className="box-tabs"
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  sx={{ color: 'rgb(108, 117, 136)' }}
                  label="New"
                  value="1"
                  onClick={() =>
                    dispatch({ type: 'CHANGE_TAB_POST', payload: 'New' })
                  }
                />
                <Tab
                  sx={{ color: 'rgb(108, 117, 136)' }}
                  label="Top"
                  value="2"
                  onClick={() =>
                    dispatch({ type: 'CHANGE_TAB_POST', payload: 'Hot' })
                  }
                />
                {state?.searchMessage !== '' && (
                  <Tab
                    sx={{ color: 'rgb(108, 117, 136)' }}
                    label="Search"
                    value="3"
                    onClick={() =>
                      dispatch({ type: 'CHANGE_TAB_POST', payload: 'Search' })
                    }
                  />
                )}
              </TabList>
              <p
                className="res-onclick-users"
                onClick={() => setOpenUsers(true)}
              >
                <PersonSearchIcon sx={{ fontSize: '25px', color: '#6C7588' }} />
              </p>
            </Box>
            <TabPanel className="TabPanel" value="1">
              {state.author?.id && <UploadPost />}
              <Container type="New" />
              {state.loadingPost && (
                <div className="notifi-progress">
                  <CircularProgress sx={{ color: 'rgb(108, 117, 136)' }} />
                </div>
              )}
            </TabPanel>
            <TabPanel className="TabPanel" value="2">
              <Container />
              {state.loadingPost && (
                <div className="notifi-progress">
                  <CircularProgress sx={{ color: 'rgb(108, 117, 136)' }} />
                </div>
              )}
            </TabPanel>
            {state?.searchMessage !== '' && (
              <TabPanel className="TabPanel" value="3">
                {state.loadingPost && (
                  <div className="notifi-progress">
                    <CircularProgress sx={{ color: 'rgb(108, 117, 136)' }} />
                  </div>
                )}
                <Container messageId={state?.searchMessage} />
              </TabPanel>
            )}
            {openUsers && (
              <div
                className="res-users"
                style={{
                  backgroundColor: state.background ? '#242526' : '',
                  color: 'rgb(108, 117, 136)',
                }}
              >
                <div className="res-users-header">
                  <PersonSearchIcon
                    sx={{ fontSize: '28px', color: '#6C7588' }}
                  />
                  <ClearIcon
                    sx={{
                      fontSize: '20px',
                      color: '#6C7588',
                      cursor: 'pointer',
                    }}
                    onClick={() => setOpenUsers(false)}
                  />
                </div>
                {openReponsive && <ContentRight />}
              </div>
            )}
          </TabContext>
        </div>
        <div
          className="sidebar-left"
          style={{
            opacity: state.onMenu ? 0.5 : 1,
            pointerEvents: state.onMenu ? 'none' : 'auto',
          }}
        >
          {!openReponsive && <ContentRight />}
        </div>
        {scroll && state.typePosts !== 'Search' && (
          <FontAwesomeIcon
            icon={faCircleChevronUp}
            className="scrollUp"
            onClick={handleScrollUpClick}
            style={{
              opacity: state.onMenu ? 0.5 : 1,
              pointerEvents: state.onMenu ? 'none' : 'auto',
              cursor:"pointer",
            }}
          />
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};
export default MainContent;
