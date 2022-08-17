
import { CheckPasswords } from '../forms/AccountForm'
import UserForm from './UserMethods'

/**
* Register a new user
* @param  {Dictionary} e The information (register details: email, password, confirm password, username, first_name, last_name, address, phone_number, credit_card_num)
* @return {Dictionary} Message(string), and errors(dictionary)
*/
const Register = async (e) => {

    let message 
    let errors = []

    if (CheckPasswords(e)===false){
        message = 'Passwords must match and be 8 characters long'
    }
    else{
        message=''
    let result = await UserForm(e, 'Customer', 'POST', '/backend/api/user_api')
    let data =  result.data
    let status = result.status
    
    if (status !==200){errors = data}

    }


    return {message, errors}
}

export { Register }