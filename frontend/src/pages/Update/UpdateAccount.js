
import AuthContext from '../../context/authentication'
import React, { useContext,} from 'react'
import UpdateAccountForm from '../../forms/UpdateAccountForm'
import CustomerForm from '../../forms/CustomerForm'
import AirlineForm from '../../forms/AirlineForm'
import AdminForm from '../../forms/AdminForm'
import { useState, useEffect } from 'react'
import { UpdateUser, getUserInfo } from '../../methods/UserMethods'
import { Link } from "react-router-dom";
import FormTemplate from '../../forms/FormTemplate/FormTemplate';


const UpdatePage = () =>{
    let {user, authToken, logout} = useContext(AuthContext)
    let [userData, setUserData]= useState([])
    let [message, setMessage] = useState()
    let [reset, setReset] = useState(false)


    useEffect(()=>{
        GetLoggedUserData()
    }, [])

    /**
    * Gets logged in user's data.
    */  
    let GetLoggedUserData = async() =>{
        if (!user.is_superuser){
            let result = await getUserInfo(authToken)
            if(result.status === 200){
                setUserData(result.data)
        }
        else{
            console.log(result.status)
        }}

    }

    /**
    * gets user info from form, updates profile and logs user out
    * @param  {Dictionary} e The information (email. the rest changes depending on account role. If customer, first_name, last_name, address, phone_number, credit_card_no. if airline, name, country. if admin, first_name, last_name )
    */  
    let handleSubmit = async(e)=>{
        
        e.preventDefault();
        if (user.account_role==='Customer'){
            var context = {
                            'email':e.target.email.value, 
                            'first_name': e.target.first_name.value,
                            'last_name': e.target.last_name.value,
                            'address':e.target.address.value,
                            'phone_number':e.target.phone_number.value,
                            'credit_card_no': e.target.credit_card_no.value}
        }else if (user.is_superuser){
            var context = {'email':e.target.email.value}
        }
        else if(user.account_role==='Admin'){
            var context = {
                'email':e.target.email.value, 
                'first_name': e.target.first_name.value,
                'last_name': e.target.last_name.value,}
        }else{
            var context = {
                'email':e.target.email.value, 
                'name': e.target.name.value,
                'country': e.target.country.value,}
        }
        let result = await UpdateUser(context, authToken)
        if (result.status===200){
            logout()
        }
        else{
            setMessage(result.data)
        }
        
    }

    const handleReset = ()=>{ 
        setReset(
            {resetFields:  true,
            render :  !reset.render})
    }


    /**
    * sets which form to use based on account role
    */  
    let fieldOptionChooice = () => {
        if (user.is_superuser !== true){
        switch (user?.account_role)
        {
            case 'Customer':
                
                return  <CustomerForm userData={userData}/>
            case 'Airline':
                return <AirlineForm userData={userData} resetProps = { {'reset' :reset,"setReset" :setReset} }  />
            case 'Admin': 
                return <AdminForm userData={userData}/>
            default:
                return ""        
        }   
    }
    else{return ""}
    }

return(<>

    <p className="alert alert-warning">Warning: this will ask you to log back in if you update your account</p>


    <form onSubmit={(e)=>handleSubmit(e)} onReset={handleReset}> 

        <FormTemplate 
            formName= {"Account Update"}
            btnDesc = {'Update'} 
            formFields = {<><UpdateAccountForm/>  { fieldOptionChooice() } </>}
            formErrors = {message? (<p className="alert alert-warning">{message}</p>):<></>}
            additionalButtons = {<Link id="reset-password-button" to="/update/password" >Change Password</Link>}
            setReset = { setReset }
        />

    </form>
    
    </>
)

}

export default UpdatePage