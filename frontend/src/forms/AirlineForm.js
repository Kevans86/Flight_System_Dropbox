import React, {useEffect, useState} from 'react'
import { AllCountries } from '../methods/CountriesMethods'
import { CountrySelect } from '../components/FormComponents/SelectComponents';


const AirlineForm = ({ userData, resetProps })=>{
    let [countryOptions, setCountryOptions] = useState()
    let set = null

    if (userData!==undefined){
        set = true
    }

    let getContries = async () => {

        let data = await AllCountries()
        if (data){
            setCountryOptions(data.map((country) => ({value:country.id, label:country.country_name})))        
        }}    
    useEffect(() => {getContries()},[])


    return(
        <>
            <input className='form-input' type="text" name="name" placeholder="  Airline Name" defaultValue = {set?(userData.name):null} required />
            <CountrySelect
                name='country'
                id=""
                countryOptions={countryOptions}
                placeholder={set?
                    `Please pick a country, your original one is ${userData.country}`
                    :`Please pick a country`}
                defaultCountry = { userData?.country }
                update = { set }
                resetProps = { resetProps }         
            />             
        </>
    )
}


export default AirlineForm