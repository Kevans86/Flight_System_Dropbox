import React, { useState ,useEffect , useRef, useMemo} from "react"
import TimeSelector from './components/TimeSelector';
import DatePicker , { DateObject } from "react-multi-date-picker"
import './DateRangePicker.css'
import Toolbar from "react-multi-date-picker/plugins/toolbar"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import transition from "react-element-popper/animations/transition"
import opacity  from "react-element-popper/animations/opacity"
import { format} from "date-fns";
import { FcClock } from 'react-icons/fc';



const DateRangePicker = ({ currentDepDate, currentArrDate , resetProps }) => {
  const datePickerRef = useRef(null)
  const dates = useRef(null)
  const [calPosition, setCalPosition,] = useState("right-center")
  const [timeOnly, setTimeOnly] = useState(false)
  const [numberOfMonths, setNumberOfMonths] = useState(2)


  useEffect(() => {

    //set Initial calendar width and location    
    if (window.matchMedia('(max-width: 900px)').matches) {
    setNumberOfMonths(1)
    setCalPosition("top-end")} 

  }, [])


  // Set listener for screen change and resize the calendar accordingly 
  const mql = window.matchMedia('(max-width: 900px)');
  mql.onchange = (e) => { 
    if(e.matches) {
      setNumberOfMonths(1) 
      setCalPosition("top-end")}
    else  {
        setNumberOfMonths(2) 
        setCalPosition("right-center")}
    }

  //checks if the component runs the first time and loads the dates , 
  //fix for dates restored to default every render
  // if reset is active ( button pressed ) and it on update page, the date time resets to default date   

  if((currentDepDate && !(datePickerRef.current)) || (currentDepDate && resetProps.reset))  
    {dates.current =  [
      new DateObject(new Date(currentDepDate).toISOString().replace('T', ' ')),
      new DateObject(new Date(currentArrDate).toISOString().replace('T', ' '))
      ]}
   
  // if reset is activated and on new flight page it clears the page     
  if(resetProps.reset && !currentDepDate ){dates.current = []}


  return (

      <DatePicker 
        ref={datePickerRef} 
        value ={ dates.current }

        containerClassName="date-time-picker" 
        render={<CustomRangeInput dates = {dates} datePickerRef = { datePickerRef } setTimeOnly = { setTimeOnly }/>}
        animations={[
            opacity(), 
            transition({ from: 35, duration: 800 })       
          ]} 
          onChange={(e) => dates.current = e}
          portal 
          numberOfMonths={ numberOfMonths }
          range
          disableDayPicker = { timeOnly }
          calendarPosition = { calPosition }
          format="DD/MM/YY HH:mm"   
          minDate={new Date()} 

          plugins={[
    
          timeOnly?<TimeSelector />:<></>,

          <Toolbar 
            position="bottom"
            names ={{
            today: "TODAY",
            deselect: "CLEAR",
            close: "SELECT"
            }}
            />,

            weekends([6]),

            
          ]}
        >
      </DatePicker>
         
    )
  }


  
const CustomRangeInput = ({dates , value, datePickerRef, setTimeOnly }) => {
  let datePickerRefCurrent = datePickerRef.current
  let datesCurrent = dates?.current

  // 'value' is date picker native display only string formatted DD/MM/YY HH:mm. 
  //'dates' is an output object of date picker , it is easily convertble to other formats. 

    return (
      <>
 
        {/* hidden inputs for form data collection 
         the format is different from display inputs */} 

        <input 
            type='datetime-local' 
            id='departure_time' 
            name='departure_time'
            required 
            readOnly 
            hidden 
            value= {datesCurrent && datesCurrent[0]?format(new Date(datesCurrent[0]), "yyyy-MM-dd' 'HH:mm") : ""} 
        />

        <input 
          type='datetime-local' 
          id='landing_time'
          name='landing_time'
          required 
          readOnly 
          hidden 
          value= {datesCurrent && datesCurrent[1]?format(new Date(datesCurrent[1]), "yyyy-MM-dd' 'HH:mm") : ""}
        />


        <DateTimeFields 
            className = 'date-input-dep'
            value = { value[0] }
            datePickerRefCurrent = { datePickerRefCurrent }
            setTimeOnly = { setTimeOnly }
            datePlaceholder = "&#x1F4C5; Deaprture"
        />
        < DateTimeFields 
          className = 'date-input-arr'
          value = { value[1] }
          datePickerRefCurrent = { datePickerRefCurrent }
          setTimeOnly = { setTimeOnly }
          datePlaceholder = "&#x1F4C5; Arival"
        />
  
    </>
    )

  }
  
  
const DateTimeFields = ({className, value, datePickerRefCurrent, setTimeOnly , datePlaceholder}) => {

  return (
    <>

      {/* fakeForm is added so those inputs are not included in form submit. 
        those are diplay only */}

      <input
        className= { className }
        form="fakeForm"
        value={value? value.slice(0 ,8): ""}
        readOnly
        placeholder= { datePlaceholder }
        onClick = {() => 
          datePickerRefCurrent.isOpen? (
            setTimeOnly(false)):
            (datePickerRefCurrent.openCalendar(),
            setTimeOnly(false)
            ) 
        }
      />
  
      <input
        className='date-input-time'
        form="fakeForm"
        value={ value? value.slice(-5): "" }
        readOnly
        disabled = { !value }
        placeholder="&#128336; Time"
        onClick = {() =>
          datePickerRefCurrent.isOpen? 
          (setTimeOnly(true)):
          (datePickerRefCurrent.openCalendar(),
            setTimeOnly(true))
        }
      />

</>
  )

}

export default DateRangePicker

