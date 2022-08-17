import {useState, useEffect, useContext} from "react";
import AuthContext from "../../context/authentication";
import { useParams , useNavigate} from 'react-router-dom';
import { Check_if_User, TurnIntoCustomer } from "../../methods/AdminMethods";
import CustomerForm from "../../forms/CustomerForm";
import FormTemplate from '../../forms/FormTemplate/FormTemplate';


const MakeACustomer = () =>{
    let params = useParams();
    let {user, authToken} = useContext(AuthContext)
    let nav = useNavigate()
    let [reference, setReference] = useState()
    let [message, setMessage] = useState()

    /**
    * Makes user into a customer, if all's ok, sends to admin dashboard page, if not, displays error
    * @param  {Dictionary} e The information (first_name, last_name, address, phone_number, credit_card_no)
    */  
    const customermaker = async(e)=>{
    e.preventDefault()
    let result = await TurnIntoCustomer(params.username,e,authToken)
    if (result.status===200){
        nav('/admin')
    }
    else{
        setMessage(result.data)
    }
    }

    /**
    * Runs "check if user" (that it's not the logged in user, that not already of the role you wish to change to, that not a super user), and checks if user is already a customer
    */  
    let check_user = async()=>{
        let data = await Check_if_User(user, params,"Customer", authToken, nav)
        setReference(data)
    }

    useEffect(() => {
        check_user()
        },[])

    return(<>

        <form onSubmit={(e)=>customermaker(e)}>
        <FormTemplate 
            userData = {reference}
            formName= {"Add as Customer"}
            btnDesc = {'Add'} 
            formFields = {<CustomerForm userData= {reference} />}
            formErrors = {message? (<p className="alert alert-warning">{message}</p>):<></>}
             />

        </form></>
    )



}

export default MakeACustomer