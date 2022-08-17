import GetCookie from "../utilities/csrf_token";



/**
 * get all logged in user's tickets
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
const ViewMyTickets = async (authToken) => {
  let csrftoken = GetCookie('csrftoken')

  let response = await fetch('/backend/api/customer_api', {
      method:'GET',
      headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer ' + String(authToken.access),
          'X-CSRFToken': csrftoken
      }})

  let data = await response.json()
  return {'data':data, 'status':response.status}}



/**
 * create a ticket for a user for a selected flight
  * @param  {string} flight_id The flight id
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
const CreateTicket = async (flight_id, authToken) => {
    let csrftoken = GetCookie('csrftoken')
    let response = await fetch(`/backend/api/customer_api`, {
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer ' + String(authToken.access),
        'X-CSRFToken': csrftoken

      },
      body:JSON.stringify({
        "flight":flight_id
      })})

    let data = await response.json()
    return {'data':data, 'status':response.status}
      
}

/**
 * delete a selected ticket
  * @param  {string} ticket The ticket id
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
let RemoveTicket = async(ticket, authToken) => {
  let csrftoken = GetCookie('csrftoken')
  console.log(ticket);

  let response = await fetch(`/backend/api/customer_api`, {
  
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization':'Bearer ' + String(authToken.access),
      'X-CSRFToken': csrftoken

    },
    body:JSON.stringify({
      "ticket":ticket.id,
      "flight":ticket.flight,
    })})

  let data = await response.json()
  return {'data':data, 'status':response.status}

  }
export { RemoveTicket  , CreateTicket ,ViewMyTickets }


