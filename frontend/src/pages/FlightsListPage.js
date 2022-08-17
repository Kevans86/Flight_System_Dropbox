
import React, {useState, useEffect, useContext} from 'react'
import { useLocation } from 'react-router-dom' ;
import { FilteredFlightsMethod } from "../methods/FilterMethods"
import AuthContext from "../context/authentication";
import { AllCountries } from '../methods/CountriesMethods';
import { ViewMyTickets } from '../methods/TicketMethods';
import "./PagesCss/Pages.css"
import  Pagination from "../components/Pagination";
import { format } from "date-fns";


const FlightsListPage = () => {
  const { state } = useLocation();
  let [myFlights, setMyFlights] = useState(null);
  let[filteredFlights, setFilteredFlights] = useState();
  let flightSearchParams = {'fromSearchOption':0, 'toSearchOption':0 ,departureTime:"", arrivalTime:""}
  const [countries, setCountries] = useState([]);
  let {user, authToken} = useContext(AuthContext)

  useEffect(() => {
      
  if(!state) {getfilteredflights(flightSearchParams) }
  else { getfilteredflights(state.flightSearchParams)}

    }, []);


/**
* gets filtered search results for flights. sets the results and all countries from the DB. if user is customer, sets myflights based on tickets from the db
* @param  {Dictionary} flightSearchParams the parameters you wish to filter by (if none, all flights returned)
*/
  let getfilteredflights = async (flightSearchParams) => {
    // if (!flightSearchParams.departureTime ) {
    //   flightSearchParams.departureTime = format(new Date(), "yyyy-MM-dd")
    // }

    let filtered = await FilteredFlightsMethod(
        {
          departureTime: flightSearchParams.departureTime,
          arrivalTime: flightSearchParams.arrivalTime,
          fromSearchOption:flightSearchParams.fromSearchOption,
          toSearchOption:flightSearchParams.toSearchOption
        }
    );

      setFilteredFlights(filtered);
      let country_data = await AllCountries()
      if (country_data){
          setCountries(country_data)
      if (user && user?.account_role === 'Customer'){      
      let result = await ViewMyTickets(authToken?authToken:null)
      let data =  result.data
      let status = result.status

      if (status ===200){setMyFlights(data)}
      } 
  }
  }




  return (

    <Pagination 
      sourcePage = {"flightListPage"} 
      myFlights = {myFlights} 
      filteredFlights = {filteredFlights}  
      countries={countries} 
      />

  )
}



export default FlightsListPage
