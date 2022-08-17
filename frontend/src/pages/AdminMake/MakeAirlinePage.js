import {useState, useEffect, useContext} from "react";
import AuthContext from "../../context/authentication";
import AirlineForm from "../../forms/AirlineForm";
import { useParams , useNavigate } from 'react-router-dom';
import { Check_if_User, TurnIntoAirline } from "../../methods/AdminMethods";
import FormTemplate from '../../forms/FormTemplate/FormTemplate';


const MakeAnAirline = () =>{
    let params = useParams();
    let {user, authToken} = useContext(AuthContext)
    let nav = useNavigate()
    let [message, setMessage] = useState()
    let [reset, setReset] = useState(false)
    
    /**
    * Makes user into an airline, if all's ok, sends to view_airlines page, if not, displays error
    * @param  {Dictionary} e The information (name, country)
    */  
    const airlineMaker = async(e)=>{
    e.preventDefault()
    if(!e.target.country.value){
        setMessage('You must choose a country!')
    }else{
    let result = await TurnIntoAirline(params.username,e,authToken)
    if (result.status===200){
        nav('/admin/view_airlines')
    }
    else{
        setMessage(result.data)
    }
    }}

    useEffect(() => {
        Check_if_User(user, params,"Airline", authToken, nav)
        },[])
        

    return(
        <form onSubmit={(e)=>airlineMaker(e)} >

            <FormTemplate 
                formName= {"Add as an Airline"}
                btnDesc = {'Add'} 
                formFields = {<AirlineForm resetProps = { {'reset' :reset,"setReset" :setReset} }  /> }
                formErrors = {message? (<p className="alert alert-warning">{message}</p>):<></>}
                setReset = { setReset }
            />

        </form>
    )



}

export default MakeAnAirline