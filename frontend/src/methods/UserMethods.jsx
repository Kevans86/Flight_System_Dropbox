import GetCookie from "../utilities/csrf_token";

/**
 * creates a customer
 * @param  {Dictionary} e The information (username, email, password, password2, first_name, last_name, address, phone_number, credit_card_no)
 * @param  {String} account_role dumby value, not needed anymore
 * @param  {String} method always send POST, dumby from earlier build
 * @param  {String} url the required url
 * @return {String} The data and the response.status
 * 
 */
let UserForm = async (e, account_role, method, url) =>{
    var csrftoken = GetCookie('csrftoken')
    let response = await fetch(url,{
        method:method,
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
            },
            body:JSON.stringify({'username': e.target.username.value,
                                'email':e.target.email.value, 
                                'password':e.target.password.value,
                                'password2': e.target.password2.value,
                                'first_name': e.target.first_name.value,
                                'last_name': e.target.last_name.value,
                                'address':e.target.address.value,
                                'phone_number':e.target.phone_number.value,
                                'credit_card_no': e.target.credit_card_no.value},
                                    )
        })
    let data = await response.json()
    return {'data':data, 'status':response.status}}

/**
 * update an account
 * @param  {Dictionary} context The information to update (depends on the account role)
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
export const UpdateUser=async(context, authToken)=>{
    var csrftoken = GetCookie('csrftoken')
    let response = await fetch('/backend/api/user_api',{
        method:'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
            },
            body:JSON.stringify(context)
        })
    let data = await response.json()
    return {'data':data, 'status':response.status}}



/**
 * get a user's customer, airline or admin data
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
export const getUserInfo = async(authToken) =>{
        let response = await fetch('/backend/api/user_api', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authToken.access)
            }
        })
        let data = await response.json()
        return {'data':data, 'status':response.status}
}

/**
 * update password
 * @param  {Dictionary} e The information to update (old_password, password)
 * @param  {Dictionary} authToken The authentication token
 * @return {Dictionary} The data and the response.status
 * 
 */
 export const PasswordChange=async(e, authToken)=>{
    var csrftoken = GetCookie('csrftoken')
    let response = await fetch('/backend/api/user_api',{
        method:'PATCH',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authToken.access),
            'X-CSRFToken': csrftoken
            },
            body:JSON.stringify({'old_password':e.target.old_password.value,
                                 'password': e.target.password.value,},)
        })
    let data = await response.json()
    return {'data':data, 'status':response.status}}



export default UserForm