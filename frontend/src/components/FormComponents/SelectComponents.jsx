import React,  { useRef } from 'react'
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

const CountrySelectAsync = ({ placeHolderLabel, getCountries , setSearchOption }) => {

  return (
    <AsyncSelect 
    className='country-input-container'
    classNamePrefix='country-input'
    hideSelectedOptions
    components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
    noOptionsMessage={() => null}
    placeholder = { placeHolderLabel }
    cacheOptions
    loadOptions = {getCountries}
    isSearchable
    isClearable
    maxMenuHeight = {300}
    onInputChange = {(e) => {getCountries(e)}} 
    onChange = {(e)=> e? 
        setSearchOption(e.value)
        : setSearchOption(0)
    }/>
  ) 
}



const CountrySelect = ({ countryOptions , name , id , placeholder , defaultCountry, update ,resetProps }) => {
 const asyncSelect = useRef(null)

  // if its not  an update clear fields 
  // if its an update return the original value 
  if ((asyncSelect && resetProps.reset) && !update ) {
    asyncSelect.current.clearValue()
    resetProps.setReset(false)}

  if ((asyncSelect && resetProps.reset) && update ){
    asyncSelect.current.setValue(countryOptions.find(country => country.label === defaultCountry))
    resetProps.setReset(false)
  } 

    // the value of defaultCountry is undefined for a couple of renders 
    //this waits until defaultCountry get a value if its on update mode , 
    //if not in update mode sets to true and countryOptions sets the select 
  if (!update){defaultCountry = true}

  return (

    defaultCountry && countryOptions? 
        <Select
          required
          hideSelectedOptions
          ref={ asyncSelect }
          name={ name }
          id={ id }
          defaultValue={ defaultCountry && update? countryOptions.find(country => country.label === defaultCountry):"" }
          className='select-dropdown'
          options={ countryOptions }
          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
          isSearchable
          placeholder={<div className="select-dropdown-placeholder">{placeholder}</div>}
          isClearable 
        />
    :<></>
  )
}
export  { CountrySelectAsync , CountrySelect }