import React , { useRef} from 'react'
import "./TimeSelector.css"
import { IoIosArrowUp } from 'react-icons/io';
import { IoIosArrowDown } from 'react-icons/io';



const TimeSelector = ({state , handleChange }) => {

    let departure = 0
    let arrival = 1


    let sameDay = state.selectedDate[arrival]? 
        state.selectedDate[departure]?.format("DD/MM/YY") === 
        state.selectedDate[arrival]?.format("DD/MM/YY"):false 
    
        const mainBtn = useRef(null);
    let temp

    let addZiro = (i) => {
        let temp = i
        if (i < 10) temp = "0" + temp
        return temp}

     
    let dateLabelDisplay = (depArr) => {

        return (
        state.selectedDate[depArr]?
            <>
                {state.selectedDate[depArr].weekDay.name}
                <div className = "show-date-label-day">{state.selectedDate[depArr].day} </div>
                { state.selectedDate[depArr].month.name }  { state.selectedDate[depArr].year }

            </> :
            <>
                - - - - 
                <div className = "show-date-label-day">- -</div>
                - - - -    - - - -             
            </>
        )
    }    
  
    return (       

        <div className = "time-picker-container">

            <span className="show-date-label"> {dateLabelDisplay(departure)} </span>
            <span className="show-date-label"> {dateLabelDisplay(arrival)} </span>


            <div className= "departure-time">
                <HourSelector 
                    addZiro = { (event) => addZiro(event) } 
                    state = { state } mainBtn = { mainBtn } 
                    handleChange = { handleChange }  
                    temp = { temp }
                    depOrArr = { departure }
                    sameDay = { sameDay }
                />

                <div className='time-splitter'>:</div>

                <MinuteSelector 
                    addZiro = { (event) => addZiro(event) } 
                    state = { state } mainBtn = { mainBtn }
                    handleChange = { handleChange } 
                    temp = { temp }
                    depOrArr = { departure }
                    sameDay = { sameDay }
                />
            </div>

           
            <div className= "arrival-time">
                <HourSelector 
                    addZiro = { (event) => addZiro(event) } 
                    state = { state } mainBtn = { mainBtn } 
                    handleChange = { handleChange }  
                    temp = { temp }
                    depOrArr = { arrival }
                    sameDay = { sameDay }
                />
                :
                <MinuteSelector 
                    addZiro = { (event) => addZiro(event) } 
                    state = { state } mainBtn = { mainBtn }
                    handleChange = { handleChange } 
                    temp = { temp }
                    depOrArr = { arrival }
                    sameDay = { sameDay }
                />

            </div>

        </div>

    )
}




const HourSelector = ({addZiro , state, mainBtn, handleChange , temp  ,depOrArr , sameDay}) => {
    const showHours = useRef(null)
    

    let hourBtns = []
    
    for (let i = 0; i < 23; i+=2) {hourBtns.push(addZiro(i))} 


    let updateHours =(time) => {
        state.selectedDate[depOrArr].setHour(time)

        if (sameDay && state.selectedDate[0].hour >= state.selectedDate[1].hour) { 
            !depOrArr?  
                state.selectedDate[1].setHour(time):
                state.selectedDate[0].setHour(time)
        }
        else state.selectedDate[depOrArr].setHour(time)
        
        handleChange(state.selectedDate)
    } 
            
    
    let add = () =>{
        temp = parseInt(state?.selectedDate[depOrArr]?.hour)
        temp < 23? updateHours(temp += 1):<></>
        // updateHours(temp += 1)
        }

    let subtruct = () => {
        temp = parseInt(state?.selectedDate[depOrArr]?.hour)
        temp > 0? updateHours(temp -= 1): <></>
        // updateHours(temp -= 1)
}

    let disable = !state.selectedDate[depOrArr]
    return (
        <div className='hour-column'>
            <button disabled = {disable} className='buttons' onClick={() => add()}><div className='icon-center'><IoIosArrowUp /></div></button>
            <button  disabled = {disable} ref={ mainBtn } className='buttons' onClick={()=> {showHours.current.hidden = false}} > 
                {state.selectedDate[depOrArr]? addZiro(state.selectedDate[depOrArr]?.hour): "- -" }
            </button>
  
            <div className='time-menu'
                disabled = {disable}
                ref={showHours}              
                hidden>
                {hourBtns.map((num) => <button key={num}
                    className='selector-buttons' 
                    onClick={() => {
                        updateHours(num)
                        showHours.current.hidden = true
                        }
                    }>
                        <label className="button-lbl">{ num } </label></button>)}   
            </div>

            <button disabled = {disable} className='buttons' onClick={() => subtruct()}><div className='icon-center'><IoIosArrowDown /></div></button>
        </div>

        )
    }
  
  
const MinuteSelector = ({addZiro , state, mainBtn, handleChange , temp , depOrArr,   sameDay }) => {

    const showMinutes = useRef(null)
    let minuteBtns = []

    for (let i = 0; i < 59; i+=5) {minuteBtns.push(addZiro(i))} 


    let updateMinutes = (time) => {
        state.selectedDate[depOrArr].setMinute(time)

        if ((sameDay && state.selectedDate[0].hour === state.selectedDate[1].hour) && 
        (sameDay && state.selectedDate[0].minute >= state.selectedDate[1].minute )) { 
            !depOrArr?  
                state.selectedDate[1].setMinute(time):
                 state.selectedDate[0].setMinute(time)
        }
        else state.selectedDate[depOrArr].setMinute(time)
        
        handleChange(state.selectedDate)
     } 


    let add = () => {
        
        temp = parseInt(state?.selectedDate[depOrArr]?.minute)
        59 > temp? updateMinutes(temp += 1):<></>
    }


    let subtruct = () => {    
        temp = parseInt(state?.selectedDate[depOrArr]?.minute)
        temp > 0? updateMinutes(temp -= 1):<></>
        // updateMinutes(temp -= 1)
    }
     

        let disable = !state.selectedDate[depOrArr]
    return(

        <div className='min-column'>

            <button disabled = {disable}   className='buttons' onClick={() => add(false)}><div className='icon-center'><IoIosArrowUp /></div></button>
            <button disabled = {disable}   ref={mainBtn} className='buttons'  onClick={() => {showMinutes.current.hidden = false}} > 
                { state.selectedDate[depOrArr]? addZiro(state?.selectedDate[depOrArr]?.minute):"--" }
            </button>

            <div className='time-menu'
                ref={showMinutes} 
                disabled = {disable} 
                hidden>
                {minuteBtns.map((num) => 
                    <button 
                        key={num}
                        className='selector-buttons' 
                        onClick={() => {
                            updateMinutes(num)
                            showMinutes.current.hidden = true
                             }
                        }>
                        <label  className="button-lbl">{ num } </label></button>)
                }

            </div>

            <button disabled = {disable}  className='buttons' onClick={() => subtruct(false)}><div className='icon-center'><IoIosArrowDown /></div></button>
        </div>
    )


    }


export default TimeSelector

