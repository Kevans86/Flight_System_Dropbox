import React, { useState , useContext,  } from 'react'
import { CheckIfFlightFormIsValid, CreateMyFlight } from '../../methods/AirlineMethods';
import AuthContext from '../../context/authentication';
import NewFlightForm from '../../forms/NewFlightForm';
import FormTemplate from '../../forms/FormTemplate/FormTemplate';

const CreateAFlight = () =>{
    let [message, setMessage] = useState()
    let {user, authToken} = useContext(AuthContext)
    let [reset, setReset] = useState(false)


    /**
    * checks validatety of form data, if it is, creates a flight based on the form data and sets a message. if not, sets an error message
    * @param  {Dictionary} e The information (origin_country, destination_country, departure_time, landing_time)
    */  
    const handleSubmit = async(e)=>{
        e.preventDefault()


        let is_form_valid = CheckIfFlightFormIsValid(e)
        if (is_form_valid!==true){
            setMessage(is_form_valid)
        }
        else{
            let result = await CreateMyFlight(e, authToken)
            setMessage(result.data)
        }

    }

    return(

        <form onSubmit={(e)=>handleSubmit(e)} >
            <FormTemplate
                formName = {`New Flight for ${user.username}`}
                btnDesc = {'Add this flight'} 
                formFields = {<NewFlightForm  resetProps = { {'reset' :reset,"setReset" :setReset} } /> }
                formErrors = {message? (<p className="alert alert-warning">{message}</p>):<></>}
                setReset = { setReset }
            />
         </form>
    )
}


export default CreateAFlight