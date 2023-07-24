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
import {showToast}  from "../../util/showToast";

function InputPost(){
    const {state, dispatch}=useStore();
    const [text, setText]= React.useState("");
    const [dateRange, setDateRange] = React.useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [openPicker, setOpenPicker]= React.useState(false);

    const handleClickSearch =()=>{
        if(text !== ""){
            if(dateRange[0] && dateRange[1] && text === (String(format(dateRange[0], 'dd/MM/yyyy')) + " ~ " + String(format(dateRange[1], 'dd/MM/yyyy')))){
                dispatch({type:"SET_SEARCH_TIME", payload: [getTime(dateRange[0]), getTime(dateRange[1])]});
            } else {
                dispatch({type:"SET_SEARCH", payload: text});
            }
        }
    }

    const handleChangeSearch =(index)=>{
        setText(index);
        if(index === ""){
            dispatch({type:"RESET_SEARCH", payload: ""});
            setDateRange([]);
        }
    }
    const handleChangeTime =(date)=>{
        setDateRange(date);
        if(date[0]){
            setText(format(date[0], 'dd/MM/yyyy') + " ~ ");
        }
        if(date[0] &&  date[1]){
            setText(String(format(date[0], 'dd/MM/yyyy')) + " ~ " + String(format(date[1], 'dd/MM/yyyy')));
        }
        
    }
    return(
        <div className="container-input-posts">
            <div className="search-input">
                <TextField
                    placeholder="Search name..."
                    className="date-picker"
                    value={text}
                    onChange={e => handleChangeSearch(e?.target?.value)}
                    InputProps={{
                        endAdornment: (
                            <span className="icon-date-picker">
                                {openPicker ? 
                                    <ClearIcon onClick={()=> setOpenPicker(false)} sx={{color: "#6C7588", fontSize: "20px"}}/> 
                                    : <EventIcon onClick={()=> setOpenPicker(true)} sx={{color: "#6C7588", fontSize: "18px"}}/>
                                }
                            </span>
                        ),
                    }}
                />
                <button 
                    className="search-button"
                    onClick={handleClickSearch}
                >
                    <SearchIcon sx={{color: "#6C7588", fontSize: "18px"}}/>
                </button>
            </div>
            {openPicker && (
                <div className="date-range-picker">
                    <DatePicker 
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => handleChangeTime(update)}
                        isClearable={true}
                        inline
                    />
                </div>
            )}
        </div>
    )
}
export default InputPost;