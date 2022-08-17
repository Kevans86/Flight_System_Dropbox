
import {useState, useEffect, useContext, useRef} from "react";
import CustomerCard from "../components/UserCards";
import AuthContext from "../context/authentication";
import { Link } from "react-router-dom";
import GetUsers from "../methods/AdminMethods";
import { DeleteUser, UpdateToAdminFromCus } from "../methods/AdminMethods";
import Select from 'react-select'
import ReactPaginate from "react-paginate"
import "./PagesCss/Pages.css"


const AdminDashboard= () => {
    const [customers, setCustomers] = useState([]);
    const [searchedItem, setSearchedItem] = useState(null);
    const [searchOptions, setSearchOptions] = useState([]);
    const hiddenBack = useRef("hidden-back")
    const hiddenNext = useRef("")
    let {user, authToken} = useContext(AuthContext)
    const message = useRef()
    useEffect(()=>{
        GetCustomers()
    },[])

    /**
    * sets all customers along with search options
    */  
    let GetCustomers = async() =>{
        
        let result = await GetUsers("Customers", authToken)
        let data =  result.data
        let status = result.status
        if (status ===200){
            setCustomers(data)
            setSearchOptions(data.map((account) => ({value:account.id, label:`${account.account}, ${account.first_name} ${account.last_name}. Number is ${account.phone_number}`})))
        }
        else{
            alert(status, data)
        }
    }

    /**
    * deletes a customer. gets customers and resets search item after usage to show update
    * @param  {Dictionary} e The information
    */  
    let Delete= async(e) =>{

        let result = await DeleteUser(e, authToken)
        message.current =result.data
        GetCustomers()
        setSearchedItem(false)

    }

    /**
    * returns all buttons to be displayed in cards
    */  
         let Buttons = (user)=>{

            return <div>
                        <Link className="btn btn-primary btn-sm" to={`/admin/make_airline/${user.account}`} >Add as Airline</Link>
                        <button onClick={()=>UpdateToAdmin(user)}className="btn btn-primary btn-sm" >Add as Admin</button>
                        <button onClick={()=>Delete(user.account)}className="btn btn-danger btn-sm" >Delete</button>
                </div>
        }


    /**
    * updates a customer to an admin, gets all customers again to update with results
    * @param  {Dictionary} e The information (username, first_name, last_name)
    */  
    let UpdateToAdmin= async(e) =>{

        let result = await UpdateToAdminFromCus(e, authToken)

        message.current =result.data
        GetCustomers()
        setSearchedItem(null)

    }

    /**
    * sets the searched item to the searched account
    * @param  {Dictionary} e The information (username)
    */  
    const searchforaccount = async(e)=>{
        e.preventDefault()
        setSearchedItem(customers.find(account=> account.id===parseInt(e.target.username.value)))}


    const [pagenumber, setPageNumber] = useState(0)
    const cusPerPage = 3
    const pagesSeen = pagenumber * cusPerPage


    /**
    * shows card for each user, sets it up for the pagination
    */

    const displayCustomers = customers.slice(pagesSeen, pagesSeen + cusPerPage).map((customer)=>{
    return (
        <div key={customer.account} className="list-group-item list-group-item-action flex-column align-items-start">
        <CustomerCard customer={customer} buttons={Buttons(customer)}/>

    </div>
    )})
    const pageCount = Math.ceil(customers.length / cusPerPage)
    const changePage = ({selected})=>{
        selected === 0? hiddenBack.current = "hidden-back":hiddenBack.current = ""         
        selected === (pageCount -1)?hiddenNext.current = "hidden-next":hiddenNext.current = ""
        setPageNumber(selected)
    }



    return (
    <>
        <div className="title-label-container"><div className="customers-label">Customers</div></div>
        {message.current? (<p className="alert alert-secondary">{message.current}</p>):<></>}

        <div className="admin-search-container">
            <form className="admin-search-form" onSubmit={(e)=>searchforaccount(e)}>
                <Select 
                    required
                    name='username'
                    id='username'
                    className='admin-select'
                    placeholder = 'Search for a user'
                    options ={searchOptions}
                    isSearchable 
                    components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                    isClearable  />
                
                <input type="submit" id="admin-search-btn" className="btn btn-primary btn-sm"  value='Search'/>
       
            </form>
            {searchedItem?<button 
                id="admin-clear-btn"  
                className="btn btn-primary btn-sm" 
                onClick={()=>setSearchedItem(false)}>
                    Clear search and view all customers
                </button>
                :<></>}
        </div> 

        {searchedItem?<>
        {
        <div key={searchedItem.id} className="list-group-item list-group-item-action flex-column align-items-start">
        <p>Searched for:</p>

        <CustomerCard customer={searchedItem} buttons={Buttons(searchedItem)}/>
        </div>
        }</>
        :<>
        
        {
                customers?.length > 0
                ? (
                     <>
                    {displayCustomers}
                    <div className='pagination-container' >

                    <ReactPaginate
                        className= {"pagination"}
                        previousLabel = {'Back'}
                        nextLabel = {'Next'}
                        pageCount={pageCount > 1? pageCount: 0}
                        breakLabel=".."
                        pageRangeDisplayed={ 4 }
                        marginPagesDisplayed={ 1 }
                        renderOnZeroPageCount = {null}
                        nextClassName = { hiddenNext.current }
                        previousClassName = { hiddenBack.current }
                        onPageChange={changePage}
                        siblingCount = {0}
                        containerClassName={""}
                        previousLinkClassName={"btn btn-outline-info"}
                        nextLinkClassName={"btn btn-outline-info"}
                    />
                </div>
                    </>
                ) : (
                        <h2>No Customers found</h2>
                )
            }</>}
    </>)
}

export default AdminDashboard