
import React, {useEffect, useState } from 'react'
import { AllCountries } from '../methods/CountriesMethods';
import DateRangePickerAirline from '../components/FormComponents/DatePicker/DateRangePickerAirline'
import { CountrySelect } from '../components/FormComponents/SelectComponents';


const NewFlightForm = ({ flightData, resetProps })=>{


    let [countryOptions, setCountryOptions] = useState()

    let set = null
    if (flightData!==undefined) set = true 
        

    /**
    * Gets all countries and sets them up for react select
    */
    let getContries = async () => {
        let country_data = await AllCountries()
        if (country_data){
            
            setCountryOptions(country_data.map((country) => ({value:country.id, label:country.country_name})))
                                  
        }}    
    useEffect(() => {getContries()},[])
    
    return(
        <>
        
            <CountrySelect 
                name='origin_country'
                id='origin_country'
                countryOptions ={ countryOptions }
                placeholder = {set?
                                `Please pick an origin country, your original one is ${flightData.origin_country}`
                                :`Origin country`}
                defaultCountry = { flightData?.origin_country }
                update = { set }
                resetProps = { resetProps }
            />               

            <CountrySelect 
                name='destination_country'
                id='destination_country'
                countryOptions ={ countryOptions }
                placeholder = {set?
                    `Please pick an destination country, your original one is ${flightData.destination_country}`
                    :`Destination country`}
                    defaultCountry = {flightData?.destination_country }
                    update = { set }
                    resetProps = { resetProps }
            />


            {flightData?
                <DateRangePickerAirline  
                    currentDepDate = { flightData.departure_time }  
                    currentArrDate = { flightData.landing_time } 
                    resetProps = { resetProps }
                />
                :<DateRangePickerAirline resetProps = { resetProps } /> }

            
            <h5 className='new-flight-label'>Ticket Number</h5>
            <input
                className='form-input-number'
                required
                id='tickets'
                defaultValue ={set?flightData.remaining_tickets:1}
                type='number'
                step="1"
                min="0"
                />     
        </>
    )
}


export default NewFlightForm