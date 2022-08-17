import {useState, useContext} from "react";
import AuthContext from "../../context/authentication";
import { CreateCountry } from "../../methods/CountriesMethods";
import CountryForm from "../../forms/CountryForm";
import FormTemplate from '../../forms/FormTemplate/FormTemplate';


const MakeCountry = () =>{
    let {authToken} = useContext(AuthContext)
    let [message, setMessage] = useState()


    /**
    * Makes a country, if all's ok. sets message telling if it was successful or if there were errors.
    * @param  {Dictionary} e The information (flag(file), name)
    */  
    const makeCountry = async(e)=>{

        e.preventDefault()
        setMessage('Upload in Progress...')
        let result = await CreateCountry(e,authToken)

        if (result.status===200){
            setMessage('Successfully made this country!')
        }
        else{
            setMessage('Country with this name already exists!')
        }
        }


    return(<>
       

        <form onSubmit={(e)=>makeCountry(e)}>
            <FormTemplate 
            formName= {"New Country Form"}
            btnDesc = {'Add a Country'} 
            formFields = {<CountryForm /> }
            formErrors = {message? (<p className="alert alert-warning">{message}</p>):<></>}
             />


        </form>
        
        
        </>

    )



}

export default MakeCountry