import React, { useState ,useEffect , useRef } from "react"

import DatePicker from "react-multi-date-picker"
import './DateRangePicker.css'
import Toolbar from "react-multi-date-picker/plugins/toolbar"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import transition from "react-element-popper/animations/transition"
import opacity  from "react-element-popper/animations/opacity"

const CustomRangeInput = ({ value, datePickerRef}) => {
let dateRef = datePickerRef.current

  
  return (
    <>
      <input
          className='date-input-dep'
          value={value[0]? `Departure at ${value[0]}`: ""}
          readOnly
          placeholder="&#x1F4C5; Deaprture at"
          onClick = {() =>
            dateRef.isOpen? 
            dateRef.closeCalendar():
            dateRef.openCalendar() 
          }

      />
      {/* <div class="cal-icon1"><BsFillCalendarDayFill /></div> */}

      <input
      
        className='date-input-arr'
        value={value[1]? `Arrival at ${value[1]}`: ""}
        readOnly
        onClick = {() =>
          dateRef.isOpen? 
          dateRef.closeCalendar():
          dateRef.openCalendar() 
        }

        placeholder="&#x1F4C5; Arival at"
      />
      {/* <i class="cal-icon2"><BsFillCalendarDayFill /></i> */}

  </>
  )
}


const DateRangePicker = ({ updateDates } ) => {
  const datePickerRef = useRef(null)

  let [numberOfMonths, setNumberOfMonths] = useState()


  useEffect(() => {
    //Initial screen width    
    window.matchMedia('(max-width: 800px)').matches? setNumberOfMonths(1):setNumberOfMonths(2)
  }, [])


  //Set listener for screen change
  const mql = window.matchMedia('(max-width: 800px)');
  mql.onchange = (e) => { e.matches? setNumberOfMonths(1):setNumberOfMonths(2) }


  return (
    <>
      <DatePicker
        ref={datePickerRef}
        containerClassName="date-picker" 
        render={<CustomRangeInput datePickerRef = {datePickerRef}/> }
        onChange={updateDates}
          animations={[
            opacity(), 
            transition({ from: 35, duration: 800 })       
          ]} 

          numberOfMonths={numberOfMonths}
          range
          fixMainPosition 
          calendarPosition="bottom-center"
          format="DD/MM/YY"
          minDate={new Date()} 
          plugins={[
            <Toolbar 
            position="bottom"
            names ={{
            today: "TODAY",
            deselect: "CLEAR",
            close: "SELECT"
            }}
            />,
            weekends([6])      
          ]}
        >
      </DatePicker>
         
    </>
    )
  }
export default DateRangePicker