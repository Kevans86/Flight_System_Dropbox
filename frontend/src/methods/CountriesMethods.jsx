import GetCookie from "../utilities/csrf_token";

const GetCountryMethod = async (countryid) => {
  let response = await fetch(`/backend/contries/${countryid}/`)
  let data = await response.json()
  return data

}

const CreateCountryMethod  = async  (submitted) => {
    console.log(submitted)

    fetch(`/backend/contries/create`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(submitted)
    }).then(() => {
    console.log('flight added')
    });

}

const UpdateCountryMethod  = async (submitted , countryid) => {

  fetch(`/backend/contries/${countryid}/update` , {
    method: "PUT",
    headers: {
              'content-Type': 'application/json'
    },
    remaining_tickets: JSON.stringify(submitted)
  })

}

/**
* Creates a new country
* @param  {Dictionary} e The information (country_name, flag)
* @param  {Dictionary} authToken The authentication token
* @return {Dictionary} The data and the response.status
* 
*/
export const CreateCountry = async(e, authToken) =>{
 var csrftoken = GetCookie('csrftoken')
 let formData = new FormData()
 formData.append("flag", e.target.flag.files[0])
 formData.append("country_name",e.target.country_name.value)
 let response = await fetch('/backend/countries', {
     method:'POST',
     headers:{
         'Authorization':'Bearer ' + String(authToken.access),
         'X-CSRFToken': csrftoken
     },
     body:formData})
let data = await response.json()
return {'data':data, 'status':response.status}}


let DeleteCountryMethod  = async(countryid) => {
  fetch(`/backend/contries/${countryid}/delete` , {
    method: "DELETE",
    headers: {
              'content-Type': 'application/json'
    }
  })

}

/**
* gets all countries data
* @return {Dictionary} all countries data, null if server issues
* 
*/
export const AllCountries = async ()=>{
  let response = await fetch(`/backend/countries`)
  let data = await response.json()
  if (response.status===200){
    return data}
  else{
    alert('something went wrong, please refresh the page')
    return null
  }
}

export { CreateCountryMethod , UpdateCountryMethod , DeleteCountryMethod, GetCountryMethod }


