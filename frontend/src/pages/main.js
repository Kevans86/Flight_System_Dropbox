import React from 'react'
import FlightSearchForm from '../forms/FlightSearchForm';


const MainPage = (message) => {

    return (
    
    <div>

        <h1>Where Do You Want To Go?</h1>
        <br></br>
        <FlightSearchForm />
    
     {!message ==={}? (<h2>{message}</h2>):<></>}</div>)
}

export default MainPage

