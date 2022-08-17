import {useState, useEffect, useContext} from "react";
import AuthContext from "../../context/authentication";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Check_if_User, TurnIntoAdmin } from "../../methods/AdminMethods";
import AdminForm from "../../forms/AdminForm";
import FormTemplate from '../../forms/FormTemplate/FormTemplate';


const MakeAnAdmin = () =>{
    let params = useParams();
    let {user, authToken} = useContext(AuthContext)
    let nav = useNavigate()
    let [reference, setReference] = useState()
    let [message, setMessage] = useState()

    /**
    * Makes user into an admin, if all's ok, sends to view_admins page, if not, displays error
    * @param  {Dictionary} e The information (first_name, last_name)
    */  
    const adminmaker = async(e)=>{
    e.preventDefault()
    let result = await TurnIntoAdmin(params.username,e,authToken)
    if (result.status===200){

        nav('/admin/view_admins')
    }
    else{
        setMessage(result.data)
    }
    }

    /**
    * Runs "check if user" (that it's not the logged in user, that not already of the role you wish to change to, that not a super user), and checks if user is already an admin
    */  
    let check_user = async()=>{
        let data = await Check_if_User(user, params,"Admin", authToken, nav)
        setReference(data)    }

    useEffect(() => {
        check_user()
        },[])
        
    return(<>
        {message? (<p className="alert alert-warning">{message}</p>):<></>}
        <form onSubmit={(e)=>adminmaker(e)}>
        <FormTemplate 
            formName= {`Add as Admin`}
            btnDesc = {'Add'} 
            formFields = {<AdminForm userData= {reference} /> }
            formErrors = {message? (<p className="alert alert-warning">{message}</p>):<></>}
            
             />
        </form></>
    )



}

export default MakeAnAdmin