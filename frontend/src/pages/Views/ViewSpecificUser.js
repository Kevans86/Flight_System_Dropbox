import {useState, useEffect, useContext, useRef} from "react";
import AuthContext from "../../context/authentication";
import { Link } from "react-router-dom";
import GetUsers from "../../methods/AdminMethods";
import { DeleteUser, UpdateToAdminFromCus} from "../../methods/AdminMethods";
import Select from 'react-select'
import "../PagesCss/Pages.css"
import { AccountCard } from "../../components/UserCards";

const SearchForUser = ()=>{
    const [accounts, setAccounts] = useState([]);
    const [allAccounts, setAllAccounts] = useState([]);
    const [searchedItem, setSearchedItem] = useState(null);
    let {user, authToken} = useContext(AuthContext)
    const message = useRef()

    useEffect(()=>{
        GetAccounts()
    },[])

    /**
    * sets all accounts along with search options
    */  
    let GetAccounts = async() =>{
        
        let result = await GetUsers("Accounts", authToken)
        let data =  result.data
        let status = result.status
        if (status ===200){
            setAccounts(data.map((account) => ({value:account.id, label:`${account.username}, Account type: ${account.account_role}`})))
            setAllAccounts(data)
        }
        else{
            alert(status, data)
        }
    }

    /**
    * sets the searched item to the searched account
    * @param  {Dictionary} e The information (username)
    */  
    const searchforaccount = async(e)=>{
        e.preventDefault()
        setSearchedItem(allAccounts.find(account=> account.id===parseInt(e.target.username.value)))
    }

    /**
    * deletes an account. gets accounts and resets search item after usage to show update
    * @param  {Dictionary} e The information
    */  
    let Delete= async(e) =>{
        let result = await DeleteUser(e, authToken)
        message.current =result.data
        GetAccounts()
        setSearchedItem(null)

    }

    
    /**
    * updates a customer to an admin, gets all customers again to update with results
    * @param  {Dictionary} e The information (username, first_name, last_name)
    */  
     let UpdateToAdmin= async(e) =>{

        let result = await UpdateToAdminFromCus(e, authToken)
        message.current =result.data
        GetAccounts()
        setSearchedItem(null)

    }

    /**
    * returns all buttons to be displayed in cards
    */  
    let Buttons = (user)=>{
        return <div>
        {user.is_superuser===true?<p>Superuser may not be altered</p>:<>

        {user.account_role==="Customer"?
            <button onClick={()=>UpdateToAdmin(user)}className="btn btn-primary btn-sm" >Add as Admin</button>:<>
            <Link className="btn btn-primary btn-sm" to={`/admin/make_customer/${user.username}`} >Add as Customer</Link> </>}
        {user.account_role!=="Airline"?
            <Link className="btn btn-primary btn-sm" to={`/admin/make_airline/${user.username}`} >Add as Airline</Link>:
            <Link className="btn btn-primary btn-sm" to={`/admin/make_admin/${user.username}`} >Add as Admin</Link>}
        <button onClick={()=>Delete(user.username)}className="btn btn-danger btn-sm" >Delete</button>

        </>}
    </div>
    }


    return(
        <>

        {/* <div className="admin-label-center"><label className="admin-label-display" >Admin: {user.username}</label></div> */}
        <div className="title-label-container"><div className="users-label">Users</div></div>


        {/* <div id="user-view-container"> */}

        {message.current? (<p className="alert alert-secondary">{message.current}</p>):<></>}
        <div className="admin-search-container">
            <form className="admin-search-form"  onSubmit={(e)=>searchforaccount(e)}>
                    <Select 
                            required
                            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                            name='username'
                            id='username'
                            className='admin-select'
                            placeholder = 'Search for a user'
                            options ={accounts}
                            isSearchable
                            isClearable />

                    <input id="user-search-btn" className="btn btn-primary btn-sm" type="submit" value='Search'/>
            </form>
            {searchedItem?<button 
                id="admin-clear-btn"  
                className="btn btn-primary btn-sm" 
                onClick={()=>setSearchedItem(false)}>
                    Clear search 
                </button>
                :<></>}
        </div>

        {searchedItem?
             (<>
                <AccountCard account={searchedItem} buttons={Buttons(searchedItem)}/>

                </>
                ) : (
                        <div id="label-positioning"><label id="after-search-label" >Search for a user</label></div>
                )
            }
        </>)
}

export default SearchForUser