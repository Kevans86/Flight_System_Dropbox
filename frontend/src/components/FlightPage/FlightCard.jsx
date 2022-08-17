import './FlightCard.css'
import { MdFlight ,   MdFlightTakeoff } from 'react-icons/md';
import { GrDocumentMissing } from 'react-icons/gr';

import React, {useEffect, useContext}  from 'react'
import AuthContext from "../../context/authentication";
import moment from 'moment';
import { TicketAddButton , TicketRemoveButton  } from "../Buttons/TicketsButtons";


const FlightCard = (props) => {
  let {user, authToken} = useContext(AuthContext);
  

  let flight = null
  let currentTicket =null

  if(props.custFlight!==undefined)
  {flight = props.custFlight.flight;
    currentTicket = {"id":props.custFlight.id , "flight": props.custFlight.flight.id};
  }else
  {flight = props.flight}

  const d_country = props.countries?.find(count=> count.country_name===flight.destination_country)
  const o_country = props.countries?.find(count=> count.country_name===flight.origin_country)

  useEffect(() => {
     }, [flight, props])


  /**
  * calculates flight time
  */  
let showDuration = () => { 
  let duration = moment.duration(moment(flight.landing_time).diff(moment(flight.departure_time)));
  let totalHours = duration.asHours()
  if (totalHours % 1 !== 0) {totalHours = Math.floor(totalHours)}
  return `${totalHours}h ${duration.minutes()}m`
}


  return (
   <> 
  <div className="col-lg-4">  
    <div className="mb15">
      <div className="flight-display-card">
        <div id="card-header">
            <label id="airline-name">{ flight?.airline }</label>

            <div id="flight-id-display">
              <small>flight</small>
              <strong>{ flight?.id }</strong>
            </div>
        </div>


      <section id="cities-section">
        <div className="city-display">
          <small id='city-left'>
          <img src={o_country?.flag} alt={flight?.origin_country.slice(0,3) + ' flag'}/>
            { flight?.origin_country } 
          </small>
          <strong>{ flight?.origin_country.slice(0, 3) } </strong>
        </div>

        <div id='flight-icon'>
          <MdFlight />
        </div>

        <div className="city-display">
          <small id='city-right'>
            <img src={d_country?.flag}  alt={flight?.destination_country.slice(0,3) + ' flag'}/>

            { flight?.destination_country }    
            </small>
          <strong>{ flight?.destination_country.slice(0, 3) } </strong>
        </div>
      </section>


      <section id="times-section">
        <div id='time-left'>
          <small id="date-left">{`${flight?.departure_time.slice(8,10)}/${flight?.departure_time.slice(5,7)}/${flight?.departure_time.slice(0,4)}`} </small>
          <strong>{ flight?.departure_time.slice(11,16) } </strong>
        </div>
            
        <div id='duration-time'>
          <label id="duration" >{ showDuration() }</label>
          <div id='flight-icon' >
            <div id="icon-label"> <MdFlightTakeoff /></div>
          </div>
        </div>
            
        <div id='time-right'>
          <small id="date-right">{`${flight?.landing_time.slice(8,10)}/${flight?.landing_time.slice(5,7)}/${flight?.landing_time.slice(0,4)}`}</small>
          <strong>{ flight?.landing_time.slice(11,16) }</strong>  
        </div>
    
      </section>

      <div id='tickets-box'>
          <small id="tickets-num">tickets left:</small>
          <label id='ticket-number' >{ flight?.remaining_tickets }</label>
        </div>

        {/* /**
        Removes the add / remove buttons if the user is other than customer or anonymous 
        */ }
        
      <section id="btn-select-box">
        {!(user && user?.account_role !== 'Customer')? (<>

        {/* /**
          checkes if the flight is booked bu the customer , if it is, it returns the remove button
          if the filght is not booked it checkes number of tickets , if there are no tickets for a flight the add button is not added 
        */ }
        

        {props.custFlight?
        <TicketRemoveButton authToken = {authToken} currentTicket = {currentTicket} />
        :!(flight.remaining_tickets === 0)? <TicketAddButton authToken = {authToken} currentFlight = {flight.id} />:<></>}


          </>):<></>}

            {props.updateDeleteBtn?props.updateDeleteBtn:<></>} 

            
      </section>
    </div>
  </div>
  </div>

</>

  )
}


export default FlightCard