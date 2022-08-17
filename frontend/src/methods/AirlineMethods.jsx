import GetCookie from "../utilities/csrf_token";


  

/**
 * Get all logged in airline's flights
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
export const ViewMyFlights = async(authToken) => {
  var csrftoken = GetCookie('csrftoken')

  let response = await fetch('/backend/api/airline_api', {
      method:'GET',
      headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer ' + String(authToken.access),
          'X-CSRFToken': csrftoken
      }})
  let data = await response.json()
  return {'data':data, 'status':response.status}}


/**
 * Creates a new flight
 * @param  {Dictionary} e The information (origin_country, destination_country, departure_time, landing_time, tickets)
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
export const CreateMyFlight = async(e, authToken) =>{
    var csrftoken = GetCookie('csrftoken')


  
    let response = await fetch('/backend/api/airline_api', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({
        "origin_country":e.target.origin_country.value,
        "destination_country":e.target.destination_country.value,
        "departure_time": e.target.departure_time.value,
        "landing_time":e.target.landing_time.value,
        "remaining_tickets":e.target.tickets.value
      })})
  let data = await response.json()
  return {'data':data, 'status':response.status}}

/**
 * Deletes a flight
 * @param  {String} id The id of the flight to be deleted
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
export const  DeleteFlightAsAirline = async(id,authToken)=>{
    var csrftoken = GetCookie('csrftoken')

    let response = await fetch(`/backend/api/airline_api/${id}`, {
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authToken.access),
                'X-CSRFToken': csrftoken
            }
        })
    let data = await response.json()
    return {'data':data, 'status':response.status}}

/**
 * Updates a flight
 * @param  {Dictionary} e The information (origin_country, destination_country, departure_time, landing_time, tickets)
 * @param  {String} id The id of the flight to be updated
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
export const UpdateMyFlight = async(e, id, authToken) =>{
      var csrftoken = GetCookie('csrftoken')

    
      let response = await fetch(`/backend/api/airline_api/${id}`, {
          method:'PATCH',
          headers:{
              'Content-Type':'application/json',
              'Authorization':'Bearer ' + String(authToken.access),
              'X-CSRFToken': csrftoken
          },
          body:JSON.stringify({
          "origin_country":e.target.origin_country.value,
          "destination_country":e.target.destination_country.value,
          "departure_time": e.target.departure_time.value,
          "landing_time":e.target.landing_time.value,
          "remaining_tickets":e.target.tickets.value
        })})
    let data = await response.json()
    return {'data':data, 'status':response.status}}

/**
 * checks that origin and destination don't match and that landing > destination
 * @param  {Dictionary} e The information (origin_country, destination_country, departure_time, landing_time)
 * @return {Boolean} true if all is good, error message (string) if not
 * 
 */
export const CheckIfFlightFormIsValid = (e)=>{
  if (!e.target.origin_country.value){
    return "Missing origin country!"
  }
  if (!e.target.destination_country.value){
    return "Missing destination country!"
  }
  if (e.target.destination_country.value===e.target.origin_country.value){
    return "Origin and destination may not be the same!"
  }
  if (new Date(e.target.departure_time.value)>=new Date(e.target.landing_time.value)){
    return "Landing must be after departure!"
  }
  return true
}
  
  
  
  
  