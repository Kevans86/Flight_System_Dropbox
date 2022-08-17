
import './Form.css'
import React, {useCallback, useRef} from 'react'
import { FaSearch } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { FilteredCountryMethod } from "../methods/FilterMethods"
import { format } from "date-fns";
import DateRangePicker from '../components/FormComponents/DatePicker/DateRangePicker';
import { CountrySelectAsync } from '../components/FormComponents/SelectComponents';



const FlightSearchForm = () => {

    let navigate = useNavigate();    
    let[fromSearchOption, setFromSearchOption] = useState(0);
    let[toSearchOption, settoSearchOption] = useState(0);
    let departureTime = useRef("")   
    let arrivalTime = useRef("")  


    
    //Prevents child refresh on date entery , 
    //fix for calendar flicker on data entery    
    let updateDates = useCallback((dates) => {
    dates[0]? departureTime.current = format(new Date(dates[0]), "yyyy-MM-dd") :departureTime.current = ""
    dates[1]? arrivalTime.current = format(new Date(dates[1]), "yyyy-MM-dd")  : arrivalTime.current = ""
      }, []);


    let handleClick = () => {
        let flightSearchParams = 
        {
            'fromSearchOption':fromSearchOption, 
            'toSearchOption':toSearchOption,
            departureTime:departureTime.current, 
            arrivalTime:arrivalTime.current
        }

        navigate("/flights/",  { state: {  flightSearchParams: flightSearchParams }} )                     
    }


    let getCountries = async (searchTerm) => {
        let filtered = await FilteredCountryMethod(searchTerm) 
        return filtered?.map((country) => ({value:country.id, label:country.country_name}))
    }


    return ( 
        <div className="search-container">

            <CountrySelectAsync 
                placeHolderLabel="&#x1F6EA; From?" 
                getCountries = {getCountries}
                setSearchOption = {setFromSearchOption}
             />

            <CountrySelectAsync 
                placeHolderLabel="&#x1F6EA; To?" 
                getCountries = {getCountries}
                setSearchOption = {settoSearchOption}
             />
             
            <DateRangePicker  updateDates = { updateDates }/>

          <button
                className="search-button" 
                onClick={handleClick}
                >
                <i className="search-icon"><FaSearch /></i>
        
        </button> 
    </div>
        
    )
}

export default FlightSearchForm