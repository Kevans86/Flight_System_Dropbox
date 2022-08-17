import GetCookie from "../utilities/csrf_token";


/**
 * Returns all users of a specific type
 * @param  {String} view Which account type you wish to pull from the server (Admins, Customers, Airlines)
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
const GetUsers = async(view, authToken) =>{
    var csrftoken = GetCookie('csrftoken')

    let response = await fetch('/backend/api/admin_api', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({"view":view})
    })
    let data = await response.json()
    return {'data':data, 'status':response.status}}

/**
 * Deletes a user
 * @param  {String} username The username of the user you wish to delete
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary}      The data and the response.status
 */
export const  DeleteUser = async(username,authToken)=>{
    var csrftoken = GetCookie('csrftoken')

    let response = await fetch(`/backend/api/admin_api/${username}`, {
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
 * Updates a Customer to an Admin
 * @param  {Dictionary} e The form information (username, first_name, last_name)
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 */
export const UpdateToAdminFromCus = async(e,authToken)=>{
    var csrftoken = GetCookie('csrftoken')
    let where = 'from_all'
    if (e.account===undefined){
        where = 'from_search'
        e.account=e.username
    }
    let response = await fetch('/backend/api/admin_api', {
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({"make":"Admin",
            "username":e.account,
            "first_name": e.first_name,
            "last_name": e.last_name,
            "from":where})
    })
    let data = await response.json()
    return {'data':data, 'status':response.status}
}

/**
 * Gets a specific user's data
 * @param  {String} username The user 
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 */
export const GetSpecificUser = async(username, authToken) =>{
    var csrftoken = GetCookie('csrftoken')
    let response = await fetch('/backend/api/admin_api', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({"view":"Specific",
                            "username":username
    })
    })
    let data = await response.json()
    return {'data':data, 'status':response.status}}

/**
 * Checks if it's ok to change a user (that it's not the logged in user, that not already of the role you wish to change to, that not a super user)
 * @param  {Dictionary} user The logged in user
 * @param  {Dictionary} params The parameters for the user
 * @param  {String} role The account role you wish to change the user into
 * @param  {Dictionary} authToken The authentication token
 * @param  {Node} nav The navigator to move the user back to the main page if need be
 * @return {Dictionary} The data and the response.status
 */
export let Check_if_User = async(user, params,role, authToken, nav)=>{
    if (user.username===params.username){
        nav('/')
    }
    let result = await GetSpecificUser(params.username, authToken)
    let data = result.data
    if (result.status === 200){
        if (data.account_role===role){
            nav('/')
        }
        if (data.is_superuser===true){
            alert('Superuser cannot be changed!')
            nav('/')
        }
    }
    else{
        alert("User does not exist")
        nav('/')}
    return(data)

    }

/**
 * Turns any user into an airline
 * @param  {String} username The username of the user you're sending to the server
 * @param  {Dictionary} e The form information (name, country)
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 */
export let TurnIntoAirline=async(username,e,authToken)=>{
    var csrftoken = GetCookie('csrftoken')
    let response = await fetch('/backend/api/admin_api', {
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({"make":"Airline",
            "username":username,
            "country": e.target.country.value,
            "name": e.target.name.value})
    })
    let data = await response.json()
    return {'data':data, 'status':response.status}

}

/**
 * Turns any user into an admin
 * @param  {String} username The username of the user you're sending to the server
 * @param  {Dictionary} e The form information (first_name, last_name)
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
export let TurnIntoAdmin=async(username,e,authToken)=>{
    var csrftoken = GetCookie('csrftoken')

    let response = await fetch('/backend/api/admin_api', {
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({"make":"Admin",
            "username":username,
            "first_name": e.target.first_name.value,
            "last_name": e.target.last_name.value,
        'from':'from_all'})
    })
    let data = await response.json()
    return {'data':data, 'status':response.status}

}

/**
 * Turns any user into a customer
 * @param  {String} username The username of the user you're sending to the server
 * @param  {Dictionary} e The form information (first_name, last_name, address, phone_number, credit_card_no)
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
export let TurnIntoCustomer=async(username,e,authToken)=>{
    var csrftoken = GetCookie('csrftoken')

    let response = await fetch('/backend/api/admin_api', {
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({"make":"Customer",
            "username":username,
            "first_name": e.target.first_name.value,
            "last_name": e.target.last_name.value,
            'address':e.target.address.value,
            'phone_number':e.target.phone_number.value,
            'credit_card_no': e.target.credit_card_no.value})
    })
    let data = await response.json()
    return {'data':data, 'status':response.status}

}

export default GetUsers